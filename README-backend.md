# Backend (Express + MongoDB + Socket.IO)

This project now includes a simple backend under `server/` to support users, conversations, messages, and Socket.IO for real-time events.

## Env

Create a `.env` file in the project root using the template:

```
MONGO_URI=mongodb://127.0.0.1:27017/skillswap
PORT=4000
```

## Install

Run once to install frontend + backend deps:

```
npm install
```

## Start (dev)

- Frontend only:
```
npm run dev
```
- Backend only:
```
npm run dev:server
```
- Both together:
```
npm run dev:all
```

Backend runs on `http://localhost:4000` by default.

## API

- `GET /api/health` – health check
- `GET /api/users` – list users
- `POST /api/users` – create user `{ name, email, avatar }`
- `GET /api/conversations/user/:userId` – list a user's conversations
- `GET /api/conversations/:conversationId` – conversation with messages
- `POST /api/conversations` – create conversation `{ participants: [userId1, userId2] }`
- `POST /api/messages` – send message `{ conversationId, senderId, receiverId, content }`

### Dev seed

```
POST /api/dev/seed
```
Resets collections and inserts two sample users and a conversation. Returns created ids.

## Socket.IO

- `join` – `{ conversationId }` join a room
- `message:send` – `{ conversationId, senderId, receiverId, content }`
- `message:new` – server broadcast with saved message doc

This is a basic foundation. For production features (auth, validation, rate limits, tests, and cloud deployment), extend from here.
