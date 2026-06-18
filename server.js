import dotenv from "dotenv";
dotenv.config({ quiet: true })

import { initSocket } from "./server/chat/socket.js";
import { LoadDB } from "./server/db/index.db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import app from "./server/app.js";

const PORT = process.env.PORT || 5500;

const server = createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.VITE_PATH_CLIENT, credentials: true }
});

initSocket(io);
LoadDB();

server.listen(5500, async () => {
    console.log(`[SERVER] Running on http://localhost:${process.env.PORT}`);
})