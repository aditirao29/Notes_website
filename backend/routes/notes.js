const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Note = require("../models/Note");
const axios = require("axios");

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

module.exports = router;