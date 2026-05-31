![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-blue)
![Socket.io](https://img.shields.io/badge/Socket.io-real--time-black)
![CI/CD](https://github.com/real-nox/ChatAPP/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-ISC-lightgrey)

<img width="272" height="267" alt="Icon" src="https://github.com/user-attachments/assets/9eae5ee3-6af1-496a-8ea0-fec818f92135" />

# Chatty 💬

A real-time chat application built with Node.js, Socket.io and PostgreSQL. Add friends, chat instantly, and see when they're online.

🔗 **[Live Demo](https://chatapp-1y95.onrender.com/)**

---

## Screenshots

<img width="1919" height="962" alt="image" src="https://github.com/user-attachments/assets/7712b958-d9cb-4ba7-8ec1-0eaa28f48cac" />
<img width="1919" height="957" alt="image" src="https://github.com/user-attachments/assets/44c38e48-b01f-4eca-ae5a-6baf21a1a679" />
<br>
<br>
<h3>Offline states / seen status</h3>

<img width="1919" height="956" alt="image" src="https://github.com/user-attachments/assets/d214af0c-b02f-4c63-b3c4-f8ae45f1d94d" />
<img width="1919" height="964" alt="image" src="https://github.com/user-attachments/assets/c6e64dc3-ae25-4bcc-accb-0718afe845f1" />
<br>
<br>

<h3>Register/Logging</h3>

<img width="1919" height="955" alt="image" src="https://github.com/user-attachments/assets/963953f8-f14a-4bd3-879a-0eb039e921e3" />
<img width="1919" height="951" alt="image" src="https://github.com/user-attachments/assets/9262c6b0-34b4-4eaa-b451-b6c4230e73ca" />


---

## Features

- 🔐 **Authentication** : Register and login with secure bcrypt-hashed passwords and session-based auth stored in PostgreSQL
- 👥 **Friend System** : Send, accept, and decline friend requests in real time
- 💬 **Real-time Messaging** : Instant messaging powered by Socket.io with no page reloads
- ✅ **Seen / Unseen Status** : Messages update to "Seen" in real time when your friend reads them
- ✍️ **Writing Indicator** : Animated dots show when your friend is typing
- 🟢 **Online Presence** : Green/red dot shows which friends are currently online
- 😊 **Emoji Picker** : Send emojis directly in messages
- 🌙 **Light / Dark Theme** : Toggle between themes, preference saved in localStorage and database
- 🔒 **XSS Protection** : All user input is sanitized before rendering

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Templating | EJS (Getting replaced with react.js) |
| Real-time | Socket.io |
| Database | PostgreSQL |
| ORM | node-postgres (pg) |
| Auth | bcrypt + express-session |
| Hosting | Render + Neon |

---

## Architecture

This project follows a clean **3-layer architecture**:

```
controllers/     → handles HTTP requests and responses
services/        → business logic
repositories/    → database queries
```

Each feature (auth, friends, messages) has its own controller, service, and repository — keeping the codebase modular and maintainable.

---

## What I Learned

- Designing a **relational database schema** with foreign keys and constraints
- Implementing **real-time bidirectional communication** with Socket.io rooms
- Building a **3-layer architecture** (controllers / services / repositories) 
  for separation of concerns
- Handling **session-based authentication** securely with bcrypt and PostgreSQL
- **Deploying a full-stack app** on Render with a cloud database (Neon)
- Use of docker, containerizing the app without need of downloading dependencies, the app will be working as expected

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL

### Installation

## Without Docker
```bash
# Clone the repository
git clone https://github.com/real-nox/chatty.git
cd chatty

# Install dependencies
npm install

# Create a .env file
cp .env.example .env
```

### Run the App

```bash
npm start
```

Visit `http://localhost:5500`

## Using Docker
```bash
# Clone the repository
git clone https://github.com/real-nox/chatty.git
cd chatty

# Create a .env file
cp .env.example .env

docker compose up --build
```

Visit `http://localhost:5500`

### Environment Variables

Create a `.env` file in the root directory:

```env
DB_URL = your_postgresql_connection_string
# Session key
SSSKEY=your_session_secret
```

### Database Setup

Run these SQL files in your PostgreSQL client in order:

```sql
-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sessions
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);

-- Friend Requests
CREATE TABLE friends_requests (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES users(id),
  reciever_id INTEGER REFERENCES users(id),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Conversations
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Conversation Members
CREATE TABLE conversation_members (
  conversation_id INTEGER REFERENCES conversations(id),
  user_id INTEGER REFERENCES users(id),
  PRIMARY KEY (conversation_id, user_id)
);

-- Messages
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES conversations(id),
  sender_id INTEGER REFERENCES users(id),
  content TEXT NOT NULL,
  seen BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Project Structure

```
chatty/
├── controllers/        # Request handlers
├── services/           # Business logic
├── repositories/       # Database queries
├── routes/             # Express routers
├── middlewares/        # Auth and session middleware
├── views/              # EJS templates
├── public/             # Static files (CSS, JS)
├── chat/               # Socket.io logic
├── db/                 # Database connection
└── app.js              # Entry point
```

---

## Author

**real-nox (Rayane Sirri)** — [GitHub](https://github.com/real-nox)

---

## License

ISC
