import { pool } from "../db/index.db.js"
import { catchFctAsync } from "../utils/functions.js"

export const getUserById = catchFctAsync(async (userId) => {
    const result = await pool.query("select * from users where id = $1", [userId])

    if (result?.rowCount > 0)
        return result.rows[0]
    return false
})

export const getUserByEmail = catchFctAsync(async (email) => {
    const result = await pool.query("select * from users where email = $1", [email])

    if (result?.rowCount > 0)
        return result.rows[0]
    return false
})

export const getUserByUsername = catchFctAsync(async (username) => {
    const result = await pool.query("select * from users where username= $1", [username])

    if (result?.rowCount > 0)
        return result.rows[0]
    return false
})

export const updateUser = catchFctAsync(async (user_id, username, display_name) => {
    const result = await pool.query("update users set display_name = $1, username = $2 where id = $3", [display_name, username, user_id])

    if (result.rowCount > 0)
        return true
    return false
})

export const updateUserPwd = catchFctAsync(async (user_id, new_pwd) => {
    const result = await pool.query("update users set password = $1 where id = $2", [new_pwd, user_id])

    if (result?.rowCount > 0)
        return true
    return false
})

export const addUser = catchFctAsync(async (user_info) => {
    const result = await pool.query("insert into users (display_name, username, email, password) values ($1, $2, $3, $4)", [user_info.display_name, user_info.username, user_info.email, user_info.pwd])

    if (result?.rowCount > 0)
        return true
    return false
})

export const getUserTheme = catchFctAsync(async (user_id) => {
    const result = await pool.query("select theme from users where id=$1", [user_id])

    if (result?.rowCount > 0)
        return result?.rows[0].theme
    return false
})

export const setUserTheme = catchFctAsync(async (user_id, theme) => {
    const result = await pool.query("update users set theme = $2 where id = $1", [user_id, theme])

    if (result?.rowCount > 0)
        return true
    return false
})

export const getUsernames = catchFctAsync(async (username) => {
    const result = await pool.query("select username from users where username = $1", [username])

    if (result?.rowCount > 0)
        return true
    return false
})

export const getEmails = catchFctAsync(async (email) => {
    const result = await pool.query("select email from users where email = $1", [email])

    if (result?.rowCount > 0)
        return true
    return false
})

export const getUsersByUsername = catchFctAsync(async (username, user_id) => {
    const result = await pool.query(`
            select 
                u.id, u.username, u.display_name,
                coalesce(
                    nullif(fr.sender_id, $2),
                    nullif(fr.receiver_id, $2)
                ) as isFriend,
                coalesce(
                    nullif(pen.sender_id, $2),
                    nullif(pen.receiver_id, $2)
                ) as pending
                from users u
                left join lateral (
                    select sender_id, receiver_id
                    from friends_requests
                    where (sender_id = $2 or receiver_id = $2)
                        and (sender_id = u.id or receiver_id = u.id)
                        and status = 'accepted'
                    limit 1
                ) fr on true
                left join lateral (
                    select sender_id, receiver_id
                    from friends_requests
                    where (sender_id = $2 or receiver_id = $2)
                        and (sender_id = u.id or receiver_id = u.id)
                        and status = 'pending'
                    limit 1
                ) pen on true
                where u.username ilike $1 and u.id != $2
                limit 10;
            `, [`%${username}%`, user_id]);

    if (result.rowCount > 0)
        return result.rows;
    return []
})