import * as user_repository from "../repositories/user.repository.js"
import * as friends_repository from "../repositories/friends.repository.js"
import { catchFctAsync } from "../utils/functions.js"

export const sendFriendRequest_s = catchFctAsync(async (user_id, sender) => {
    try {
        const reciever = await user_repository.getUserById(user_id)

        if (!reciever || !reciever.id)
            return { success: false, error: "Could not find user" }

        if (!sender || !sender.id)
            return { success: false, error: "Could not find current user" }

        if (reciever.id == sender.id)
            return { success: false, error: "Cannot add yourself" }

        const alreadyRequested = await friends_repository.getFriendRequest(reciever.id, sender.id)

        if (alreadyRequested)
            return { success: false, error: `Request was already been sent to ${user_id}` }
        const result = await friends_repository.sendFriendRequest(reciever.id, sender.id)

        if (!result)
            return { success: false, error: `Could not send friend request to ${user_id}` }

        return { success: true, error: "" }
    } catch (error) {
        console.log(error)
    }
})

export const getFriendsRequest_s = catchFctAsync(async (sender) => {
    try {
        if (!sender || !sender.id)
            return { success: false, error: "Could not find current user" }

        const result = await friends_repository.getSentFriendsRequest(sender.id)

        return result
    } catch (err) {
        console.log(err)
    }
})

export const acceptFriendRequest_s = catchFctAsync(async (receiver_id, sender_id) => {
    try {
        if (!receiver_id)
            return { success: false, error: "Could not find receiver" }

        if (!sender_id)
            return { success: false, error: "Could not find sender" }

        const result = await friends_repository.acceptReqF(receiver_id, sender_id)

        if (result)
            return { success: true, error: "" }
        return { success: false, error: "Could not accept request" }
    } catch (err) {
        console.log(err)
    }
})

export const declineFriendRequest_s = catchFctAsync(async (receiver_id, sender_id) => {
    if (!receiver_id)
        return { success: false, error: "Could not find receiver" }

    if (!sender_id)
        return { success: false, error: "Could not find sender" }

    console.log(receiver_id, sender_id)
    const result = await friends_repository.declinetReqF(receiver_id, sender_id)

    if (result)
        return { success: true, error: "" }
    return { success: false, error: "Could not decline request" }
})

export const listFriends_s = catchFctAsync(async (user_id) => {
    if (!user_id)
        return { success: false, error: "Unfound user_id" }

    const result = await friends_repository.listF(user_id)

    if (!result || result.length === 0)
        return { success: false, error: "No friends found" }
    return { success: true, friends: result }
})

export const getFriendInfo_s = catchFctAsync(async (friend_id, user_id) => {
    if (!user_id)
        return { success: false, error: "Unfound user_id" }

    if (!friend_id)
        return { success: false, error: "Unfound friend_id" }

    const is_friend_with_user = await friends_repository.isFriend(friend_id, user_id)

    if (!is_friend_with_user)
        return { success: false, error: "Not friends" }

    const result = await user_repository.getUserById(friend_id)

    if (!result || result.length === 0)
        return { success: false, error: "No friends found" }
    return { success: true, friend: result }
})

export const fetchUsersByUsername_s = catchFctAsync(async (username, user_id) => {
    if (!username)
        return { success: false, error: "Empty search" }

    if (!user_id)
        return { success: false, error: "Unfound user_id" }

    const result = await user_repository.getUsersByUsername(username, user_id);

    if (result == [])
        return { success: false, error: "No users found" }

    return { success: true, users: result }
})

export const fetchUserListSent_s = catchFctAsync(async (sender_id) => {
    if (!sender_id)
        return { success: false, error: "Unfound user_id" }

    const result = await friends_repository.userListSent(sender_id)

    console.log(result)
    if (result == [])
        return { success: false, error: "No users found" }

    return { success: true, users: result }

})

export const getNotificationFR_s = catchFctAsync(async (receiver_id, sender_id) => {
    if (!sender_id || !receiver_id)
        return { success: false, error: "Unfound user_id" }

    const result = await friends_repository.getFriendRequestNotification(receiver_id, sender_id)

    return result
})

export const setNotificationFR_s = catchFctAsync(async (receiver_id, sender_id) => {
    if (!sender_id || !receiver_id)
        return { success: false, error: "Unfound user_id" }

    const result = await friends_repository.setFriendRequestNotification(receiver_id, sender_id)

    return result
})