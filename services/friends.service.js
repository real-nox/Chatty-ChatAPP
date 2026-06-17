import * as user_repository from "../repositories/user.repository.js"
import * as friends_repository from "../repositories/friends.repository.js"

export const sendFriendRequest = async (user_id, sender) => {
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
}

export const getFriendsRequest = async (sender) => {
    try {
        if (!sender || !sender.id)
            return { success: false, error: "Could not find current user" }

        const result = await friends_repository.getSentFriendsRequest(sender.id)

        return result
    } catch (err) {
        console.log(err)
    }
}

export const acceptFriendRequest = async (receiver_id, sender_id) => {
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
}

export const declineFriendRequest = async (receiver_id, sender_id) => {
    try {
        if (!receiver_id)
            return { success: false, error: "Could not find receiver" }

        if (!sender_id)
            return { success: false, error: "Could not find sender" }

        console.log(receiver_id, sender_id)
        const result = await friends_repository.declinetReqF(receiver_id, sender_id)

        if (result)
            return { success: true, error: "" }
        return { success: false, error: "Could not decline request" }
    } catch (err) {
        console.log(err)
    }
}

export const listFriends = async (user_id) => {
    try {
        if (!user_id)
            return { success: false, error: "Unfound user_id" }

        const result = await friends_repository.listF(user_id)

        if (!result || result.length === 0)
            return { success: false, error: "No friends found" }
        return { success: true, friends: result }

    } catch (err) {
        console.log(err)
    }
}

export const getFriendInfo = async (friend_id, user_id) => {
    try {
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

    } catch (err) {
        console.log(err)
    }
}

export const fetchUsersByUsername = async (username, user_id) => {
    try {
        if (!username)
            return { success: false, error: "Empty search" }

        if (!user_id)
            return { success: false, error: "Unfound user_id" }

        const result = await user_repository.getUsersByUsername(username, user_id);

        if (result == []) 
            return { success: false, error: "No users found" }

        return { success: true, users: result }

    } catch (err) {
        console.log(err)
    }
}

export const fetchUserListSent = async (sender_id) => {
    try {
        if (!sender_id)
            return { success: false, error: "Unfound user_id" }

        const result = await friends_repository.userListSent(sender_id)

        if (result == []) 
            return { success: false, error: "No users found" }
        
        return { success: true, users: result }

    } catch (err) {
        console.log(err)
    }
}