import session from "express-session"
import connectpg from "connect-pg-simple"
import { pool } from "../db/index.db.js"
import { config } from "dotenv"
config({quiet:true})

const PGStore = connectpg(session)

export const sessionM = session({
    store: new PGStore({ pool: pool }),
    secret: process.env.SSSKEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 2,
        sameSite: 'none',
        httpOnly: true,
        secure: true,
        partitioned: true
    }
})