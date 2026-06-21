import cors from "cors"
import express from "express"
import cookieParser from "cookie-parser"

//Routes
import authR from "./routes/auth.route.js"
import userR from "./routes/user.route.js"
import friendsR from "./routes/friends.route.js"

//Middlewares
import { sessionM } from "./middlewares/session.middleware.js"
import { attachUser } from "./middlewares/auth.middleware.js"

const app = express()

const CLIENT = process.env.CLIENT_PATH || "https://chatty-82wa.onrender.com"

app.use(cors({ origin: CLIENT, credentials: true }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

app.set('trust proxy', 1)
app.use(sessionM)
app.use(attachUser)

//Routes
app.use("/auth", authR)
app.use("/user", userR)
app.use("/friends", friendsR)

/*app.use((req, res) => {
    res.status(404).json("errors/404")
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).render("errors/500")
})*/

export default app;