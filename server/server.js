import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRouter from './routes/users.js';
import conversationsRouter from './routes/conversations.js';
import messagesRouter from './routes/messages.js';
import devRouter from './routes/dev.js';

dotenv.config();

const app = express();
app.use(cors({ origin: '*'}));
app.use(express.json());

// API routes
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/users', usersRouter);
app.use('/api/conversations', conversationsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/dev', devRouter);

let PORT = Number(process.env.PORT) || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillswap';

const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: '*'}});

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  socket.on('join', ({ conversationId }) => {
    if (conversationId) {
      socket.join(conversationId);
    }
  });
  socket.on('message:send', async (payload) => {
    try {
      const { conversationId, senderId, receiverId, content } = payload || {};
      if (!conversationId || !senderId || !receiverId || !content) return;
      // Persist message via HTTP handler (reuse model to avoid duplication)
      const { default: Message } = await import('./models/Message.js');
      const { default: Conversation } = await import('./models/Conversation.js');
      const msg = await Message.create({ conversation: conversationId, sender: senderId, receiver: receiverId, content });
      await Conversation.findByIdAndUpdate(conversationId, { lastMessage: content, updatedAt: new Date() });
      io.to(conversationId).emit('message:new', msg);
    } catch (err) {
      console.error('message:send error', err);
    }
  });
  // WebRTC signaling passthrough
  socket.on('webrtc:offer', ({ conversationId, sdp }) => {
    if (!conversationId || !sdp) return;
    socket.to(conversationId).emit('webrtc:offer', { sdp });
  });
  socket.on('webrtc:answer', ({ conversationId, sdp }) => {
    if (!conversationId || !sdp) return;
    socket.to(conversationId).emit('webrtc:answer', { sdp });
  });
  socket.on('webrtc:ice-candidate', ({ conversationId, candidate }) => {
    if (!conversationId || !candidate) return;
    socket.to(conversationId).emit('webrtc:ice-candidate', { candidate });
  });
  socket.on('call:ended', ({ conversationId }) => {
    if (!conversationId) return;
    socket.to(conversationId).emit('call:ended');
  });
  socket.on('disconnect', () => console.log('socket disconnected', socket.id));
});

(async () => {
  try {
    await mongoose.connect(MONGO_URI, { dbName: 'skillswap' });
    console.log('MongoDB connected');
    const start = (attemptsLeft = 5) => {
      const tryPort = PORT;
      server.listen(tryPort, () => console.log(`API listening on http://localhost:${tryPort}`));
      server.once('error', (err) => {
        if (err && err.code === 'EADDRINUSE' && attemptsLeft > 0) {
          console.warn(`Port ${tryPort} in use, trying ${tryPort + 1}...`);
          PORT = tryPort + 1;
          // remove error listener before retry to avoid stacking
          server.removeAllListeners('error');
          start(attemptsLeft - 1);
        } else if (err) {
          console.error('Server listen error', err);
          process.exit(1);
        }
      });
    };
    start();
  } catch (err) {
    console.error('Mongo connection error', err);
    process.exit(1);
  }
})();
