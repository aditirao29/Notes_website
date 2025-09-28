const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Folder = require("../models/Folder");
const Note = require("../models/Note");

router.post("/", auth, async (req, res) => {
  try {
    const folder = new Folder({
      name: req.body.name,
      parentFolder: req.body.parentFolder || null,
      category: req.body.category ? req.body.category.toLowerCase() : "other",
      owner: req.user._id
    });
    await folder.save();
    res.status(201).json(folder);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", auth, async (req, res) => {
    try {
        const folders = await Folder.find({ parentFolder: null, owner: req.user._id });
        res.json(folders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/:id", auth, async (req, res) => {
    try {
        const parentId = req.params.id;
        const folders = await Folder.find({ parentFolder: parentId, owner: req.user._id });
        const notes = await Note.find({ folder: parentId, owner: req.user._id });
        res.json({ folders, notes });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch("/:id",auth,async (req,res) => {
  try {
    const folder = await Folder.findOne({_id: req.params.id, owner: req.user._id });
    if(!folder)
      return res.status(404).json({ message: "Folder not found" });
    folder.name = req.body.name ?? folder.name;
    await folder.save();
    res.json(folder);
  }
  catch(err) {
    res.status(500).json({message: err.message });
  }
})

router.delete("/:id", auth, async (req, res) => {
    try {
        const folderId = req.params.id;
        const noteResult = await Note.deleteMany({ 
            folder: folderId, 
            owner: req.user._id 
        });
        const folderResult = await Folder.deleteOne({ 
            _id: folderId, 
            owner: req.user._id 
        });

        if (folderResult.deletedCount === 0) {
            return res.status(404).json({ message: "Folder not found or unauthorized" });
        }

        res.status(200).json({ 
            message: `Folder and ${noteResult.deletedCount} notes permanently deleted` 
        });
    } catch (err) {
        console.error("Error deleting folder:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;