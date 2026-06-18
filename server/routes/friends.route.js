import { Router } from "express";
import { accept_request_c, decline_request_c, decline_sent_c, friend_info_c, get_sent_c, getUserListSent, list_friends_c, lookForUsers, send_request_c } from "../controllers/friends.controller.js";
import { auth_m } from "../middlewares/auth.middleware.js";

const friendsR = Router()

friendsR.use(auth_m)

friendsR.post("/requests/send", send_request_c)

friendsR.patch("/requests/:id/accept", accept_request_c)

friendsR.patch("/requests/:id/decline/sent", decline_sent_c)

friendsR.patch("/requests/:id/decline/request", decline_request_c)

friendsR.get("/requests/requests", get_sent_c)

friendsR.get("/requests/sent", getUserListSent)

friendsR.get("/list", list_friends_c)

friendsR.get("/:friend", friend_info_c)

friendsR.post("/fetch", lookForUsers)

export default friendsR