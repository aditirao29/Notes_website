const crypto = require("crypto");
const mongoose = require('mongoose');

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
const IV_LENGTH = 16;

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(text) {
  const [ivHex, encryptedData] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: "" },
  folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

// Encrypt before save
noteSchema.pre("save", function(next) {
  if (this.isModified("content")) {
    this.content = encrypt(this.content);
  }
  next();
});

// Decrypt when converting to JSON
noteSchema.methods.toJSON = function() {
  const obj = this.toObject();
  if (obj.content) {
    try {
      obj.content = decrypt(obj.content);
    } catch (e) {
      obj.content = "";
    }
  }
  return obj;
};

module.exports = mongoose.model("Note", noteSchema);