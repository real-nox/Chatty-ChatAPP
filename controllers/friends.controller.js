import * as friends_service from "../services/friends.service.js"

export const send_request_c = async (req, res, next) => {
    const user_id = req?.body?.user_id

    if (!user_id)
        return res.json({ success: false, error: "Fill in the form" })

    const sender = req?.user

    if (!sender)
        return res.json({ success: false, error: "Fill in the form" })

    try {
        const result = await friends_service.sendFriendRequest(user_id, sender)

        return res.json(result)
    } catch (err) {
        next(err)
    }
}

export const get_sent_c = async (req, res, next) => {
    const sender = req?.user

    try {
        const result = await friends_service.getFriendsRequest(sender)

        return res.json(result)
    } catch (err) {
        next(err)
    }
}

export const accept_request_c = async (req, res, next) => {
    const request_id = req?.params?.id
    const user_id = req?.user?.id

    try {
        if (!request_id)
            return res.json({ success: false, error: "Request id is not provided"})

        const resultat = await friends_service.acceptFriendRequest(request_id, user_id)

        return res.json(resultat)
    } catch (err) {
        console.log(err)
    }
}

export const decline_request_c = async (req, res, next) => {
    const request_id = req?.params?.id
    const user_id = req?.user?.id

    try {
        if (!request_id)
            return res.json({ success: false, error: "Request id is not provided"})

        const resultat = await friends_service.declineFriendRequest(request_id, user_id)

        return res.json(resultat)
    } catch (err) {
        console.log(err)
    }
}

export const list_friends_c = async (req, res, next) => {
    const user_id = req?.user?.id

    try {
        const result = await friends_service.listFriends(user_id)

        return res.json(result)
    } catch (err) {
        console.log(err)
    }
}

export const friend_info_c = async (req, res, next) => {
    const friend_id = req?.params?.friend
    const user_id = req?.user?.id

    try {
        const result = await friends_service.getFriendInfo(friend_id, user_id)

        return res.json(result)
    } catch (err) {
        console.log(err)
    }
}

export const lookForUsers = async (req, res, next) => {
    const { search } = req?.query;
    const user_id = req?.user?.id 

    try {
        const result = await friends_service.fetchUsersByUsername(search, user_id)

        return res.json(result)
    } catch (err) {
        console.log(err)
    }
}

export const getUserListSent = async (req, res, next) => {
    const user_id = req?.user?.id

    try {
        const result = await friends_service.fetchUserListSent(user_id)

        return res.json(result)
    } catch (err) {
        console.log(err)
    }
}