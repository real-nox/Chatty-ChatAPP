import { Router } from "express"

import * as auth_controller from "../controllers/auth.controller.js"

const authR = Router()

authR.get("/", auth_controller.user_authenticated_c)

authR.post("/register", auth_controller.register_c)

authR.post("/login", auth_controller.login_c)

authR.post("/forgot-password", auth_controller.forgot_password_c)

authR.get("/logout", auth_controller.logout_c)

export default authR