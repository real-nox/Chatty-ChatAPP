import * as friends_service from "../services/friends.service.js"
import { catchAsync } from "../utils/functions.js"

export const send_request_c = catchAsync(async (req, res, next) => {
    const user_id = req?.body?.user_id

    if (!user_id)
        return res.json({ success: false, error: "Fill in the form" })

    const sender = req?.user

    if (!sender)
        return res.json({ success: false, error: "Fill in the form" })


    const result = await friends_service.sendFriendRequest_s(user_id, sender)

    return res.json(result)
})

export const get_sent_c = catchAsync(async (req, res, next) => {
    const sender = req?.user

    const result = await friends_service.getFriendsRequest_s(sender)

    return res.json(result)
})

export const accept_request_c = catchAsync(async (req, res, next) => {
    const friend_id = req?.params?.id
    const user_id = req?.user?.id

    if (!friend_id)
        return res.json({ success: false, error: "Friend_id is not provided" })

    const resultat = await friends_service.acceptFriendRequest_s(user_id, friend_id)

    return res.json(resultat)
})

export const decline_sent_c = catchAsync(async (req, res, next) => {
    const friend_id = req?.params?.id
    const user_id = req?.user?.id

    if (!friend_id)
        return res.json({ success: false, error: "Friend_id id is not provided" })

    const resultat = await friends_service.declineFriendRequest_s(friend_id, user_id)

    return res.json(resultat)
})

export const decline_request_c = catchAsync(async (req, res, next) => {
    const friend_id = req?.params?.id
    const user_id = req?.user?.id

    if (!friend_id)
        return res.json({ success: false, error: "Request id is not provided" })

    const resultat = await friends_service.declineFriendRequest_s(user_id, friend_id)

    return res.json(resultat)
})

export const get_sent_user_list_c = catchAsync(async (req, res, next) => {
    const user_id = req?.user?.id

    const result = await friends_service.listFriends_s(user_id)

    return res.json(result)
})

export const get_notification_c = catchAsync(async (req, res, next) => {
    const receiver_id = req?.user?.id
    const sender_id = req?.body?.sender_id

    const result = await friends_service.getNotificationFR_s(receiver_id, sender_id)

    return res.json(result)
})

export const set_notification_c = catchAsync(async (req, res, next) => {
    const receiver_id = req?.user?.id
    const sender_id = req?.body?.sender_id

    const result = await friends_service.setNotificationFR_s(receiver_id, sender_id)

    return res.json(result)
})

export const list_friends_c = catchAsync(async (req, res, next) => {
    const user_id = req?.user?.id

    const result = await friends_service.fetchUserListSent_s(user_id)

    return res.json(result)
})

export const friend_info_c = catchAsync(async (req, res, next) => {
    const friend_id = req?.params?.friend
    const user_id = req?.user?.id

    const result = await friends_service.getFriendInfo_s(friend_id, user_id)

    return res.json(result)
})

export const find_users_c = catchAsync(async (req, res, next) => {
    const { search } = req?.query;
    const user_id = req?.user?.id

    const result = await friends_service.fetchUsersByUsername_s(search, user_id)

    return res.json(result)
})