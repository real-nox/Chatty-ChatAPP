import { Router } from "express";

import * as user_controller from "../controllers/user.controller.js"

const userR = Router()

userR.get("/me", user_controller.user_get_c)

userR.post("/get-user", user_controller.user_get_c)

userR.get("/theme", user_controller.get_user_theme_c)

userR.patch("/theme", user_controller.set_user_theme_c)

userR.patch("/user", user_controller.update_user_c)


export default userR;