import { setSeenMsg } from "../repositories/chat.repository.js"

export const msgSeen_s = async (user_id, message_id) => {
    try {
        if (!user_id)
            return { success: false, error: "Unfound user" }

        if (!message_id)
            return { success: false, error: "Unfound message" }

        const result = await setSeenMsg(message_id)

        if (!result)
            return { success: false, error: "Could not modify in messages table" }

        return { success: true, error: "" }
    } catch (err) {
        return err
    }
}