import dotenv from "dotenv";
dotenv.config({ quiet: true })

import { initSocket } from "./chat/socket.js";
import { LoadDB } from "./db/index.db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";

const PORT = process.env.PORT || 5500;

const server = createServer(app);

console.log(process.env.VITE_PATH_CLIENT)

const io = new Server(server, {
  cors: { origin: process.env.VITE_PATH_CLIENT, credentials: true }
});

initSocket(io);
LoadDB();

server.listen(PORT, async () => {
    console.log(`[SERVER] Running on http://localhost:${process.env.PORT} or ${process.env.VITE_PATH_CLIENT}`);
})