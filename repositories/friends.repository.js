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

export const getFriendsRequest = async (senderId) => {
    try {
        const result = await pool.query(`SELECT fr.id, fr.created_at, fr.sender_id, u.username 
            FROM friends_requests fr JOIN users u ON u.id = fr.sender_id
            WHERE fr.receiver_id = $1 AND fr.status = 'pending'`,
            [senderId]
        )

        if (result?.rowCount > 0) {
            let resultat = Array();

            for (const data of result?.rows) {
                resultat.push({ request_id: data.id, username: data.username, created_at: data.created_at, sender_id: data.sender_id });
            }
            console.log(resultat)
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
            `
            select 
            u.id, u.username,
            m.content as last_message,
            m.created_at,
            m.seen,
            m.sender_id,
            (
                select COUNT(*) from messages
                where conversation_id = (
                    select conversation_id from messages
                    where (sender_id = f.sender_id and receiver_id = f.receiver_id)
                        or (sender_id = f.receiver_id and receiver_id = f.sender_id)
                    limit 1
                )
                and sender_id != $1
                and seen = 0
            ) as unseen_count
            from friends_requests f
            join users u on u.id = case 
            when f.sender_id = $1 then f.receiver_id 
            else f.sender_id 
            end
            left join messages m on m.id = (
            select id from messages
            where (sender_id = f.sender_id and receiver_id = f.receiver_id)
                or (sender_id = f.receiver_id and receiver_id = f.sender_id)
            order by created_at desc
            limit 1
            )
            where (f.sender_id = $1 or f.receiver_id = $1)
            and f.status = 'accepted'
            order by m.created_at desc
`, [user_id])

        if (result?.rowCount > 0)
            return result.rows
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