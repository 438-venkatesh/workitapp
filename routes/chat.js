// routes/chat.js
const express = require('express');
const Chat = require('../models/Chat');
const User = require('../models/User');
const Message = require('../models/Message');
const router = express.Router();

// Start a new chat or get existing chat
router.post('/chat', async (req, res) => {
  const { publisher, bidder } = req.body;
  try {
    let chat = await Chat.findOne({ publisher : publisher, bidder : bidder });
    if (!chat) {
      chat = new Chat({ publisher : publisher, bidder : bidder, status: true });
      await chat.save();
    }
    res.status(201).json(chat);
  } catch (error) {
    console.log(req.body)
    console.log(error)
    res.status(400).json({ error: error.message });
  }
});

// Send a message
router.post('/chat/:chatId/message', async (req, res) => {
    const { chatId } = req.params;
    const { sender, message } = req.body;
    try {
      const chat = await Chat.findById(chatId);
      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
      }
      const messageObj = await Message.create({
        chatId: chatId,
        sender: sender,
        message: message,
      });
      res.status(201).json(messageObj);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Get messages for a specific chat
router.get('/chat/:chatId/message', async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await Message.find({ chatId: chatId });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;