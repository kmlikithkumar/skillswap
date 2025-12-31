import { Router } from 'express';
import User from '../models/User.js';

const router = Router();

// List users (basic)
router.get('/', async (_req, res) => {
  const users = await User.find().lean();
  res.json(users);
});

// Create user (basic)
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
