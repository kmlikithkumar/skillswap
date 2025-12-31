import { Router } from 'express';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

const router = Router();

// Get conversations for a user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const convos = await Conversation.find({ participants: userId }).sort({ updatedAt: -1 }).lean();
  res.json(convos);
});

// Get one conversation with messages
router.get('/:conversationId', async (req, res) => {
  const { conversationId } = req.params;
  const convo = await Conversation.findById(conversationId).lean();
  if (!convo) return res.status(404).json({ error: 'Conversation not found' });
  const messages = await Message.find({ conversation: conversationId }).sort({ createdAt: 1 }).lean();
  res.json({ ...convo, messages });
});

// Create conversation
router.post('/', async (req, res) => {
  const { participants } = req.body;
  if (!participants || participants.length !== 2) {
    return res.status(400).json({ error: 'participants (2) required' });
  }
  const existing = await Conversation.findOne({ participants: { $all: participants } });
  if (existing) return res.json(existing);
  const convo = await Conversation.create({ participants });
  res.status(201).json(convo);
});

export default router;
