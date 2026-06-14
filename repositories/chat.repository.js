import { pool } from "../db/index.db.js"

export const CreateConversation_Get_id = async () => {
    try {
        const result = await pool.query(
            `insert into conversations (created_at) values (NOW()) returning id`)

        if (result.rowCount > 0)
            return result.rows[0]
        return false
    } catch (err) {
        console.log(err)
    }
}

export const SetConversation_Member = async (user_id, conv_id) => {
    try {
        const result = await pool.query(
            `insert into conversation_members (user_id, conversation_id) values ($1, $2)`, [user_id, conv_id])

        if (result.rowCount > 0)
            return true
        return false
    } catch (err) {
        console.log(err)
    }
}

export const getConversation = async (user1_id, user2_id) => {
    try {
        const result = await pool.query(
            `select c.id from conversations c join conversation_members cm1 on (c.id = cm1.conversation_id) join conversation_members cm2 on (c.id = cm2.conversation_id) where cm1.user_id = $1 and cm2.user_id = $2`,
            [user1_id, user2_id]
        )

        if (result.rowCount > 0)
            return result.rows[0]

        const { id: conv_id } = await CreateConversation_Get_id()

        if (!conv_id)
            return false

        await SetConversation_Member(user1_id, conv_id)
        await SetConversation_Member(user2_id, conv_id)

        return await getConversation(user1_id, user2_id)

    } catch (err) {
        console.log(err)
    }
}

export const saveMessage = async (conv_id, sender_id, content) => {
    try {
        const result = await pool.query("insert into messages (sender_id, conversation_id, content) values ($1, $2, $3) returning id", [sender_id, conv_id, content])

        if (result.rowCount > 0)
            return result.rows[0]
        return false
    } catch (err) {
        console.log(err)
    }
}

export const getMessages = async (conv_id) => {
    try {
        const result = await pool.query("select m.id, m.sender_id, u.username, m.content, m.created_at, m.seen from messages m join users u on (m.sender_id = u.id) where m.conversation_id = $1 order by m.created_at desc limit 50 ", [conv_id])

        if (result.rowCount > 0) {
            return result.rows.reverse()
        }
        return false
    } catch (err) {
        console.log(err)
    }
}

export const setSeenMsg = async (message_id) => {
    try {

        const result = await pool.query("update messages set seen = 1 where id = $1", [message_id])

        if (result.rowCount > 0) {
            return true
        }
        return false
    } catch (err) {
        console.log(err)
    }
}

export const MarkAllMsgAsSeen = async (conversation_id, friendId) => {
    try {
        const result = await pool.query("update messages set seen = 1 where sender_id = $1 and conversation_id = $2", [friendId, conversation_id])

        if (result.rowCount > 0) {
            return true
        }
        return false
    } catch (err) {
        console.log(err)
    }
}