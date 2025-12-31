import { Router } from 'express';
import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

const router = Router();

const seed = async (_req, res) => {
  await Promise.all([
    Message.deleteMany({}),
    Conversation.deleteMany({}),
    User.deleteMany({}),
  ]);

  const [alice, bob] = await User.create([
    { name: 'Alice Wonder', email: 'alice@example.com', avatar: 'https://picsum.photos/seed/alice/200/200' },
    { name: 'Bob Smith', email: 'bob@example.com', avatar: 'https://picsum.photos/seed/bob/200/200' },
  ]);

  const convo = await Conversation.create({ participants: [alice._id, bob._id], lastMessage: 'Hi Bob!' });
  await Message.create([
    { conversation: convo._id, sender: alice._id, receiver: bob._id, content: 'Hey Bob, can you teach me design?' },
    { conversation: convo._id, sender: bob._id, receiver: alice._id, content: 'Sure, let\'s start this week!' },
  ]);

  res.json({ ok: true, users: [alice, bob], conversationId: convo._id });
};

router.post('/seed', seed);
router.get('/seed', seed);

export default router;
