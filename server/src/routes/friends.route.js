import { Router } from "express";

import * as friends_controller from "../controllers/friends.controller.js";

const friendsR = Router()

friendsR.post("/requests/send", friends_controller.send_request_c)

friendsR.get("/requests/requests", friends_controller.get_sent_c)

friendsR.patch("/requests/:id/accept", friends_controller.accept_request_c)

friendsR.patch("/requests/:id/decline/sent", friends_controller.decline_sent_c)

friendsR.patch("/requests/:id/decline/request", friends_controller.decline_request_c)

friendsR.get("/requests/sent", friends_controller.get_sent_user_list_c)

friendsR.post("/requests/notification", friends_controller.get_notification_c)

friendsR.post("/requests/notification/edit", friends_controller.set_notification_c)

friendsR.get("/list", friends_controller.list_friends_c)

friendsR.get("/:friend", friends_controller.friend_info_c)

friendsR.post("/fetch", friends_controller.find_users_c)

export default friendsR