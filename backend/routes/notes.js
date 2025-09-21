const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Note = require("../models/Note");

router.post("/", auth, async (req, res) => {
    try {
        console.log("Incoming note payload: ",req.body);
        const note = new Note({
            title: req.body.title,
            content: req.body.content || "",
            folder: req.body.folder || req.body.folderId,
            owner: req.user._id
        });
        await note.save();
        res.status(201).json(note);
    } catch (err) {
        console.error("Error creating note: ",err);
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

router.patch("/:id", auth, async (req,res) => {
    try {
        const note = await Note.findOne({_id: req.params.id,owner:req.user._id});
        if(!note)
            return res.status(404).json({message: "Note not found"});
        if(typeof req.body.title === "string")
            note.title = req.body.title;
        if(typeof req.body.content === "string")
            note.content = req.body.content;
        await note.save();
        res.json(note);
    }
    catch(err) {
        res.status(500).json({message: err.message});
    }
});

module.exports = router;