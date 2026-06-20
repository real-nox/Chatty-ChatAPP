![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-blue)
![Socket.io](https://img.shields.io/badge/Socket.io-real--time-black)
![CI](https://github.com/real-nox/ChatAPP/actions/workflows/ci.yml/badge.svg)
![CD](https://github.com/real-nox/ChatAPP/actions/workflows/cd.yml/badge.svg)
![License](https://img.shields.io/badge/license-ISC-lightgrey)

<img width="272" height="267" alt="Icon" src="https://github.com/user-attachments/assets/9eae5ee3-6af1-496a-8ea0-fec818f92135" />

# Chatty 💬

A real-time chat application built with React, Express.js, Socket.io and PostgreSQL. Add friends, chat instantly, and see when they're online.

🔗 **[Live Demo](https://chatty-82wa.onrender.com/)**

---

## Screenshots

<img width="1919" height="958" alt="image" src="https://github.com/user-attachments/assets/b6ad175e-73ae-4e76-a266-d55ba9b80f6e" />
<img width="1919" height="957" alt="image" src="https://github.com/user-attachments/assets/b4d557cb-1fbb-4854-9a05-8303867a75e9" />
<img width="1919" height="990" alt="image" src="https://github.com/user-attachments/assets/91b23393-c706-4a1c-8467-6d4f170a1ef4" />
<br>
<br>
<h3>Offline states / seen status</h3>

<img width="1919" height="951" alt="image" src="https://github.com/user-attachments/assets/4503d67a-6172-4f12-8f3a-9a0fa4b32115" />
<img width="1919" height="989" alt="image" src="https://github.com/user-attachments/assets/278cc896-da17-405c-aec4-91567bd43131" />
<br>
<br>

<h3>Register/Logging</h3>
<img width="1919" height="991" alt="image" src="https://github.com/user-attachments/assets/12de8426-e6a1-476d-8cff-43e5e59538ac" />
<img width="1919" height="991" alt="image" src="https://github.com/user-attachments/assets/dae84309-0167-4d07-bb45-b1a5bff5401e" />

<h3>Friends Requests</h3>
<img width="1919" height="960" alt="image" src="https://github.com/user-attachments/assets/52e00441-ff5e-4142-b596-bc17bff50b87" />
<img width="1919" height="953" alt="image" src="https://github.com/user-attachments/assets/6eee2b9f-089b-45b6-bc58-749a8d234d7a" />
<img width="1917" height="956" alt="image" src="https://github.com/user-attachments/assets/48c1338f-2664-4dc9-9dd2-16111143dbf3" />
<img width="1919" height="958" alt="image" src="https://github.com/user-attachments/assets/0134b32c-a193-423a-9ca1-e24ee8d86856" />
<img width="1919" height="955" alt="image" src="https://github.com/user-attachments/assets/e44ba090-2e62-4c0c-bbaf-16e46b0316cd" />

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
| Frontend | React |
| Backend Runtime | Node.js |
| Backend Framework | Express.js |
| Real-time | Socket.io |
| Database | PostgreSQL |
| ORM | node-postgres (pg) |
| Auth | bcrypt + express-session |
| Hosting | Render + Neon |

---

## Architecture

This project is split into two top level apps:

```
client/     → Frontend : React client
server/     → Backend  : Express.js REST Full API + Socket.io server
```
The backend follows a clean **3-layer architecture**:

```
controllers/     → handles HTTP requests and responses
services/        → business logic
repositories/    → database queries
```

Each feature (auth, friends, messages) has its own controller, service, and repository, keeping the codebase modular and maintainable.

---

## What I Learned

- Designing a **relational database schema** with foreign keys and constraints
- Implementing **real-time bidirectional communication** with Socket.io rooms
- Building a **3-layer architecture** (controllers / services / repositories) 
  for separation of concerns
- Handling **session-based authentication** securely with bcrypt and PostgreSQL
- **Deploying a full-stack app** on Render with a cloud database (Neon)
- Use of docker, containerizing the app without need of downloading dependencies, the app will be working as expected
- Splitting a monolithic EJS app into a separate React frontend and Express API backend
- Running both apps together locally with a single ``start.sh``

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL

### Installation

## Without Docker
```bash
# Clone the repository
git clone https://github.com/real-nox/Chatty-ChatAPP
cd Chatty-ChatAPP

# Install dependencies for both apps
cd client; npm install; cd ../server; npm install; cd ..

# Create a .env file in both apps
cp server/.env.example server/.env; cp client/.env.example client/.env
```

### Run the App

```bash
# Recommended: use Git Bash
cd Chatty-ChatAPP
bash start.sh

# Or, on Windows
./start.sh
```

- Frontend: ``http://localhost:5173``
- Backend:  ``http://localhost:5500``

## Using Docker
```bash
# Clone the repository
git clone https://github.com/real-nox/Chatty-ChatAPP
cd Chatty-ChatAPP

# Create a .env file in both apps
cd client; npm install; cd ../server; npm install; cd ..

docker compose up --build
```

Visit `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL = your_postgresql_connection_string

PORT = 5400
CLIENT_PATH =
SERVER_PATH =
PRODUCTION = false

SSSKEY = your_session_secret

POSTGRES_PASSWORD = 
POSTGRES_USER = 
POSTGRES_DB = 
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
  theme TEXT DEFAULT 'dark';
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
  notified INTEGER DEFAULT 0,
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
├── client/                     # React app
│   ├── icon/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── server/                     # Express.js API + Socket.io
│   ├── src/ 
│   │   ├── controllers/        # Request handlers
│   │   ├── services/           # Business logic
│   │   ├── repositories/       # Database queries
│   │   ├── routes/             # Express routers
│   │   ├── middlewares/        # Auth and session middleware
│   │   ├── views/              # EJS templates
│   │   ├──  public/            # Static files (CSS, JS)
│   │   ├── chat/               # Socket.io logic
│   │   ├── db/                 # Database connection
│   │   ├── Dockerfile
│   │   └── app.js              # Express App
│   └── server.js               # Entry point
├── start.sh                    # Starts frontend + backend
└── docker-compose.yml
```

---

## Author

**real-nox (Rayane Sirri) :** [GitHub](https://github.com/real-nox)

---

## License

ISC
