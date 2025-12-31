import { Router } from 'express';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

const router = Router();

// Send message
router.post('/', async (req, res) => {
  try {
    const { conversationId, senderId, receiverId, content } = req.body;
    if (!conversationId || !senderId || !receiverId || !content) {
      return res.status(400).json({ error: 'conversationId, senderId, receiverId, content are required' });
    }
    const message = await Message.create({ conversation: conversationId, sender: senderId, receiver: receiverId, content });
    await Conversation.findByIdAndUpdate(conversationId, { lastMessage: content, updatedAt: new Date() });
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
