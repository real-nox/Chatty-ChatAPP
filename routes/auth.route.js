import { Router } from "express"
import * as auth_controller from "../controllers/auth.controller.js"
import { auth_m, ifLogged } from "../middlewares/auth.middleware.js"

const authR = Router()

authR.get("/", (req, res) => {
    if (req?.session?.userId)
        res.json(true)
})

authR.post("/register", auth_controller.register_c)

authR.post("/login", auth_controller.login_c)


//To be removed
authR.get("/", (req, res) => {
    return res.redirect("/")
})

authR.get("/register", ifLogged, (req, res) => {
    res.render("pages/register")
})

authR.get("/login", ifLogged, (req, res) => {
    res.render("pages/login")
})

authR.get("/logout", auth_controller.logout_c)

authR.get("/forgot-password", ifLogged, (req, res) => {
    res.render("pages/forgotpass")
})

authR.post("/get-user", auth_controller.user_get_c)

authR.post("/theme", auth_controller.user_get_theme_c)

authR.patch("/theme", auth_controller.user_set_theme_c)

authR.patch("/user", auth_controller.user_Update)

export default authR