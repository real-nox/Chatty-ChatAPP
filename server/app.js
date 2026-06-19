import cors from "cors"
import express from "express"
import cookieParser from "cookie-parser"

//Routes
import authR from "./routes/auth.route.js"
import friendsR from "./routes/friends.route.js"

//Middlewares
import { auth_m } from "./middlewares/auth.middleware.js"
import { sessionM } from "./middlewares/session.middleware.js"

const app = express()

app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

app.use(sessionM)
app.use(auth_m)

//Routes
app.use("/auth", authR)
app.use("/friends", friendsR)

/*app.use((req, res) => {
    res.status(404).render("errors/404")
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).render("errors/500")
})*/

export default app;