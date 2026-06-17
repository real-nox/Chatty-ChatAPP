import { pool } from "../db/index.db.js"
import { getUserById } from "./user.repository.js"

export const sendFriendRequest = async (receiverId, senderId) => {
    try {
        const result = await pool.query("insert into friends_requests (sender_id, receiver_id) values ($1, $2)", [senderId, receiverId])

        if (result?.rowCount > 0)
            return true
        return false
    } catch (error) {
        console.log(error)
    }
}

export const getFriendRequest = async (receiverId, senderId) => {
    try {
        const result = await pool.query("select * from friends_requests where (sender_id = $1 and receiver_id = $2) or (sender_id = $2 and receiver_id = $1)", [senderId, receiverId])

        if (result?.rowCount > 0)
            return true
        return false
    } catch (error) {
        console.log(error)
    }
}

export const getSentFriendsRequest = async (receiver_id) => {
    try {
        const result = await pool.query(`SELECT fr.id, u.username, u.display_name
            FROM friends_requests fr JOIN users u ON u.id = fr.sender_id
            WHERE fr.receiver_id = $1 AND fr.status = 'pending'
            limit 10`,
            [receiver_id]
        )

        if (result?.rowCount > 0) {
            let resultat = Array();

            for (const data of result?.rows) {
                resultat.push({ id: data.id, username: data.username, display_name: data.display_name });
            }
            return resultat
        }
        return false
    } catch (error) {
        console.log(error)
    }
}

export const acceptReqF = async (request_id, user_id) => {
    try {
        const result = await pool.query("update friends_requests set status = 'accepted' where id = $1 and receiver_id = $2", [request_id, user_id])

        if (result?.rowCount > 0)
            return true
        return false
    } catch (err) {
        console.log(err)
    }
}

export const declinetReqF = async (request_id, user_id) => {
    try {
        const result = await pool.query("update friends_requests set status = 'declined' where id = $1 and receiver_id = $2", [request_id, user_id])

        if (result?.rowCount > 0)
            return result?.rows
        return false
    } catch (err) {
        console.log(err)
    }
}

export const listF = async (user_id) => {
    try {
        const result = await pool.query(
            `select 
                u.id, u.username, u.display_name,
                m.content as last_message,
                m.created_at,
                m.seen,
                m.sender_id,
                c.id as conversation_id,
                coalesce(uc.unseen_count, 0) as unseen_count
                from friends_requests f
                join users u on u.id = case 
                    when f.sender_id = $1 then f.receiver_id 
                    else f.sender_id 
                end
                join conversation_members cm1 on cm1.user_id = $1
                join conversation_members cm2 on cm2.conversation_id = cm1.conversation_id and cm2.user_id = u.id
                join conversations c on c.id = cm1.conversation_id
                left join lateral (
                    select content, created_at, seen, sender_id from messages
                    where conversation_id = c.id
                    order by created_at desc, id desc
                    limit 1
                ) m on true
                left join lateral (
                    select count(*) as unseen_count
                    from messages
                    where conversation_id = c.id
                        and sender_id != $1
                        and seen = 0
                ) uc on true
                where (f.sender_id = $1 or f.receiver_id = $1)
                and f.status = 'accepted'
                order by m.created_at desc
            `, [user_id])

        if (result?.rowCount > 0) {
            let list = {};

            for (const { created_at, display_name, id, conversation_id, last_message, seen, sender_id, unseen_count, username } of result?.rows) {
                list[id] = { created_at: created_at, display_name: display_name, id: id, last_message: last_message, seen: seen, sender_id: sender_id, unseen_count: unseen_count, username: username }
            }

            return list
        }
        return []
    } catch (err) {
        console.log(err)
    }
}

export const isFriend = async (friend_id, user_id) => {
    try {
        const result = await pool.query(`select * from friends_requests where ((receiver_id = $1 and sender_id = $2) or (sender_id = $1 and receiver_id = $2)) and status = 'accepted'`,
            [friend_id, user_id])

        if (result?.rowCount > 0)
            return true
        return false
    } catch (err) {
        console.log(err)
    }
}