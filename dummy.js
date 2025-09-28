const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Note = require("../models/Note");
const axios = require("axios");

const { GoogleGenerativeAI } = require("@google/generative-ai"); 

// Read the API Key (Correct, but ensure it's defined in .env)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!process.env.GEMINI_API_KEY) {
    console.error("\n*** CRITICAL SETUP ERROR: GEMINI_API_KEY is NOT loaded. Check your .env file and server.js dotenv config. ***\n");
}
// 2. Initialize the AI Client
// The SDK uses the 'apiKey' parameter to authenticate all subsequent requests.

const ai = new GoogleGenerativeAI(GEMINI_API_KEY); 
function cleanSummary(text) {
    return text
        .replace(/\s+([?.!,])/g, "$1")
        .replace(/(^\w)|(\.\s+\w)/g, (c) => c.toUpperCase());
}

router.post("/", auth, async (req, res) => {
    try {
        console.log("Incoming note payload: ", req.body);
        const note = new Note({
            title: req.body.title,
            content: req.body.content || "",
            todoList: req.body.todoList || "",
            folder: req.body.folder || req.body.folderId,
            owner: req.user._id
        });
        await note.save();
        res.status(201).json(note);
    } catch (err) {
        console.error("Error creating note: ", err);
        res.status(500).json({ message: err.message });
    }
});

router.get("/:id", auth, async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, owner: req.user._id });
        if (!note) return res.status(404).json({ message: "Note not found" });
        res.json(note);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch("/:id", auth, async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, owner: req.user._id });
        if (!note) return res.status(404).json({ message: "Note not found" });

        if (typeof req.body.title === "string")
            note.title = req.body.title;
        if (typeof req.body.content === "string")
            note.content = req.body.content;

        if (typeof req.body.todoList === "string")
            note.todoList = req.body.todoList;
            
        await note.save();
        res.json(note);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/:id/summarize", auth, async (req, res) => {
    try {
        const originalNote = await Note.findOne({ _id: req.params.id, owner: req.user._id });
        if (!originalNote) {
            return res.status(404).json({ message: "Original note not found" });
        }

        const decryptedContent = originalNote.toJSON().content;

        const response = await axios.post("http://localhost:8000/summarize", {
            text: decryptedContent
        });

        let summaryText = response.data.summary || "";
        summaryText = cleanSummary(summaryText);

        const summaryNote = new Note({
            title: `Summary of ${originalNote.title}`,
            content: summaryText,
            folder: originalNote.folder,
            owner: req.user._id
        });

        await summaryNote.save();
        
        res.status(201).json(summaryNote);

    } catch (err) {
        console.error("Error summarizing note:", err);
        res.status(500).json({ message: err.message });
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const noteId = req.params.id;
        const result = await Note.deleteOne({ 
            _id: noteId, 
            owner: req.user._id 
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Note not found or unauthorized" });
        }
        res.status(200).json({ message: "Note permanently deleted" });
    } catch (err) {
        console.error("Error deleting note:", err);
        res.status(500).json({ message: err.message });
    }
});

router.post("/generate-flashcards", auth, async (req, res) => {
    try {
        const { content } = req.body;
        if (!content || content.trim().length < 10) {
            return res.status(400).json({ message: "Content is too short to generate flashcards." });
        }

        const ai = new GoogleGenerativeAI(GEMINI_API_KEY); 
        const model = ai.getGenerativeModel({ model: "gemini-2.5-pro" });

        const generationConfig = {
            responseMimeType: "application/json"
        };

        const systemPrompt = `You are a helpful AI that generates study flashcards from the user's notes.
Output **only valid JSON**: an array of objects with fields "question" and "answer".
Do not include any extra text, explanation, or comments.`;

        // 1. --- AI CALL ---
        const response = await model.generateContent({
            contents: [
                { role: "user", parts: [{ text: systemPrompt + "\n\nSTUDY NOTES:\n" + content }] }
            ],
            generationConfig
        });

        // 2. --- SAFE EXTRACTION AND EMPTY CHECK ---
        // Attempt to extract the text content and trim it immediately.
        // If content is null/undefined at any point, use an empty string.
        const jsonText = (
            response?.response?.candidates?.[0]?.content?.parts?.[0]?.text || ""
        ).trim();
        
        // This is the check that is incorrectly triggering
        if (jsonText === '') { 
            // Check if blocked by safety settings
            const blockReason = response.promptFeedback?.blockReason;
            if (blockReason) {
                console.error("Gemini API Error: Request was blocked.", blockReason, response.promptFeedback.safetyRatings);
                return res.status(403).json({
                    message: `Content was blocked by safety settings. Reason: ${blockReason}`,
                    details: response.promptFeedback.safetyRatings
                });
            }

            // Fallback for genuinely empty response (which is still impossible if your log is accurate)
            // Changing the message slightly to reflect the state.
            console.error("Gemini API Error: Extracted text was empty or only whitespace. Full Response:", JSON.stringify(response, null, 2));
            return res.status(500).json({
                message: "AI failed to generate any usable text content. The output was empty after trimming.",
            });
        }
        console.log("Gemini raw response:", JSON.stringify(response, null, 2));
        // 3. --- PARSE ---
        let flashcards;
        
        try {
            // jsonText is guaranteed to be a non-empty string here.
            flashcards = JSON.parse(jsonText);

            if (!Array.isArray(flashcards) || flashcards.length === 0) {
                // If parsing worked but the structure is wrong
                throw new Error("Parsed data is not a valid flashcard array or is empty.");
            }
        } catch (parseError) {
            // Log the 'unparsable response' error here, where it belongs.
            console.error("Gemini API Error: AI response failed JSON parsing/validation:", parseError, "Raw Response:", jsonText);
            return res.status(500).json({
                message: "AI returned invalid JSON format. Please try again.",
                rawResponse: jsonText
            });
        }

        // 4. --- RETURN FLASHCARDS ---
        res.status(200).json({ flashcards });

    } catch (err) {
        console.error("Gemini API General Error:", err);
        res.status(500).json({
            message: "Failed to connect to the AI service. Check your API key and network connection.",
            errorDetails: err.message
        });
    }
});

module.exports = router;