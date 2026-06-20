import dotenv from "dotenv";
dotenv.config({ quiet: true })

import { initSocket } from "./src/chat/socket.js";
import { LoadDB } from "./src/db/index.db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import app from "./src/app.js";

const PORT = process.env.PORT || 5500;
const PRODUCTION = process.env.PRODUCTION || false;

const CLIENT = process.env.CLIENT_PATH
const SERVER = process.env.SERVER_PATH

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT,
    credentials: true
  }
});

initSocket(io);
LoadDB();

server.listen(PORT, '0.0.0.0', async () => {
  console.log(`[SERVER] : Running on\n${PRODUCTION ?
      `- Public : ${SERVER}`
      :
      `- Locally : http://localhost:${process.env.PORT}`
    }`
  );
})