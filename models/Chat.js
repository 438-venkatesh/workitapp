// models/Chat.js
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: { type: Boolean, required: true },
});

module.exports = mongoose.model("Chat", chatSchema);
