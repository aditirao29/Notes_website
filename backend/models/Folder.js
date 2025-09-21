const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
    name: { type:String, required:true, },
    parentFolder: { type:mongoose.Schema.Types.ObjectId, ref:"Folder", default:null },
    category: { type: String, enum: ["studies","todo","journal","other"], default:"other"},
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const Folder = mongoose.model("Folder", folderSchema);

module.exports = Folder;