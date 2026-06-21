import { pool } from "../db/index.db.js"
import { catchFctAsync } from "../utils/functions.js"
import { getUserById } from "./user.repository.js"

export const sendFriendRequest = catchFctAsync(async (receiverId, senderId) => {
    const result = await pool.query("insert into friends_requests (sender_id, receiver_id) values ($1, $2)", [senderId, receiverId])

    if (result?.rowCount > 0)
        return true
    return false
})

export const getFriendRequest = catchFctAsync(async (receiverId, senderId) => {
    const result = await pool.query("select * from friends_requests where (sender_id = $1 and receiver_id = $2) or (sender_id = $2 and receiver_id = $1)", [senderId, receiverId])

    if (result?.rowCount > 0)
        return true
    return false
})

export const getSentFriendsRequest = catchFctAsync(async (receiver_id) => {
    const result = await pool.query(`SELECT fr.sender_id as id, u.username, u.display_name
            FROM friends_requests fr JOIN users u ON u.id = fr.sender_id
            WHERE fr.receiver_id = $1 AND fr.status = 'pending'
            limit 10`,
        [receiver_id]
    )

    if (result?.rowCount > 0) {
        let resultat = Array();

        for (const data of result?.rows) {
            resultat.push({ id: data.id, username: data.username, display_name: data.display_name, pending: receiver_id });
        }
        return resultat
    }
    return false
})

export const acceptReqF = catchFctAsync(async (receiver_id, sender_id) => {
    const result = await pool.query("update friends_requests set status = 'accepted' where receiver_id = $1 and sender_id = $2", [receiver_id, sender_id])

    if (result?.rowCount > 0)
        return true
    return false
})

export const declinetReqF = catchFctAsync(async (receiver_id, sender_id) => {
    const result = await pool.query("delete from friends_requests where receiver_id = $1 and sender_id = $2", [parseInt(receiver_id), parseInt(sender_id)])

    if (result?.rowCount > 0)
        return result?.rows
    return false
})

export const listF = catchFctAsync(async (user_id) => {
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
                left join conversation_members cm1 on cm1.user_id = $1
                left join conversation_members cm2 on cm2.conversation_id = cm1.conversation_id and cm2.user_id = u.id
                left join conversations c on c.id = cm2.conversation_id
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
})

export const isFriend = catchFctAsync(async (friend_id, user_id) => {
    const result = await pool.query(`select * from friends_requests where ((receiver_id = $1 and sender_id = $2) or (sender_id = $1 and receiver_id = $2)) and status = 'accepted'`,
        [friend_id, user_id])

    if (result?.rowCount > 0)
        return true
    return false
})

export const userListSent = catchFctAsync(async (sender_id) => {
    const result = await pool.query(
        `select 
            fr.receiver_id as id, u.username, u.display_name 
            from friends_requests fr 
            join users u on (fr.receiver_id = u.id)
            where fr.sender_id = $1 and fr.status = 'pending'
            `, [sender_id]
    )

    console.log(result.rows)

    if (result.rowCount > 0)
        return result.rows
    return []
})

export const getFriendRequestNotification = catchFctAsync(async (receiver_id, sender_id) => {
    const result = await pool.query(`select notified from friends_requests where receiver_id = $1 and sender_id = $2 and status = 'pending'`, [receiver_id, sender_id])

    if (result.rowCount > 0)
        return result.rows[0]?.notified
    return false
})

export const setFriendRequestNotification = catchFctAsync(async (receiver_id, sender_id) => {
    const result = await pool.query(`update friends_requests set notified = 1 where receiver_id = $1 and sender_id = $2 and status = 'pending' and notified = 0`, [receiver_id, sender_id])

    return true
})