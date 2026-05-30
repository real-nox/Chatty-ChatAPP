import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
import { config } from "dotenv"

config({ quiet: true })
const __dirname = dirname(fileURLToPath(import.meta.url))

import { LoadDB } from "./db/index.db.js"

import authR from "./routes/auth.route.js"
import friendsR from "./routes/friends.route.js"

import { auth_m } from "./middlewares/auth.middleware.js"
import { initSocket } from "./chat/socket.js"
import { sessionM } from "./middlewares/session.middleware.js"

import cors from "cors"

const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
const httpServer = createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
})

app.use(express.static(join(__dirname, "public")))

app.set("views", join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(sessionM)
io.engine.use(sessionM)

//Routes
app.use("/auth", authR)
app.use("/friends", friendsR)

app.get("/", auth_m, async (req, res) => {
    res.render("home", { user: req.user })
})

app.use((req, res) => {
    res.status(404).render("errors/404")
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).render("errors/500")
})

httpServer.listen(5500, async () => {
    console.log("[SERVER] Running on http://localhost:5500")
    await LoadDB()
    initSocket(io)
})