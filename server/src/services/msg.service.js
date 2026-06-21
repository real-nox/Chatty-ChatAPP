import { setSeenMsg } from "../repositories/chat.repository.js"
import { catchFctAsync } from "../utils/functions.js"

export const msgSeen_s = catchFctAsync(async (user_id, message_id) => {
    if (!user_id)
        return { success: false, error: "Unfound user" }

    if (!message_id)
        return { success: false, error: "Unfound message" }

    const result = await setSeenMsg(message_id)

    if (!result)
        return { success: false, error: "Could not modify in messages table" }

    return { success: true, error: "" }
})