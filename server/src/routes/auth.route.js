import { Router } from "express"
import * as auth_controller from "../controllers/auth.controller.js"
import { auth_m, ifLogged } from "../middlewares/auth.middleware.js"
import { getUserById } from "../repositories/user.repository.js"

const authR = Router()

authR.get("/", (req, res) => {
    if (req?.session?.userId) {
        res.json(req?.session?.userId)
    } else
        res.json(false)
})

authR.get("/me", async(req, res) => {
    if (req?.session?.userId) {
        const {display_name, id, username} = await getUserById(req?.session?.userId)

        res.json({ id: id, display_name: display_name, username:    username, avatar: null, presence: true })
    } else
        res.json(false)
})

authR.post("/register", auth_controller.register_c)

authR.post("/login", auth_controller.login_c)

authR.get("/logout", auth_controller.logout_c)

authR.post("/get-user", auth_controller.user_get_c)

authR.get("/theme", auth_controller.user_get_theme_c)

authR.patch("/theme", auth_controller.user_set_theme_c)

authR.patch("/user", auth_controller.user_Update)

export default authR