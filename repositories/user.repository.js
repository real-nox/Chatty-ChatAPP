import { pool } from "../db/index.db.js"

export const getUsernames = async (username) => {
    try {
        const result = await pool.query("select username from users where username = $1", [username])

        if (result?.rowCount > 0)
            return true
        return false
    } catch (error) {
        console.log(error)
    }
}

export const getEmails = async (email) => {
    try {
        const result = await pool.query("select email from users where email = $1", [email])

        if (result?.rowCount > 0)
            return true
        return false
    } catch (error) {
        console.log(error)
    }
}

export const getUserById = async (userId) => {
    try {
        const result = await pool.query("select * from users where id = $1", [userId])

        if (result?.rowCount > 0)
            return result.rows[0]
        return false
    } catch (error) {
        console.log(error)
    }
}

export const getUserByEmail = async (email) => {
    try {
        const result = await pool.query("select * from users where email = $1", [email])

        if (result?.rowCount > 0)
            return result.rows[0]
        return false
    } catch (error) {
        console.log(error)
    }
}

export const getUserViaUsername = async (username) => {
    try {
        const result = await pool.query("select * from users where username= $1", [username])

        if (result?.rowCount > 0)
            return result.rows[0]
        return false
    } catch (error) {
        console.log(error)
    }
}

export const addUser = async (user_info) => {
    try {
        const result = await pool.query("insert into users (display_name, username, email, password) values ($1, $2, $3, $4)", [user_info.display_name, user_info.username, user_info.email, user_info.pwd])

        if (result?.rowCount > 0)
            return true
        return false
    } catch (error) {
        console.log(error)
    }
}

export const updatePwdUser = async (user_id, new_pwd) => {
    try {
        const result = await pool.query("update users set password = $1 where id = $2", [new_pwd, user_id])

        if (result?.rowCount > 0)
            return true
        return false
    } catch (err) {
        console.log(err)
    }
}

export const getUserTheme = async (user_id) => {
    try {
        const result = await pool.query("select theme from users where id=$1", [user_id])

        if (result?.rowCount > 0)
            return result?.rows[0].theme
        return false
    } catch (err) {
        console.log(err)
    }
}

export const setUserTheme = async (user_id, theme) => {
    try {
        const result = await pool.query("update users set theme = $2 where id = $1", [user_id, theme])

        if (result?.rowCount > 0)
            return true
        return false
    } catch (err) {
        console.log(err)
    }
}

export const EditUser = async(user_id, username, display_name) => {
    try {
        const result = await pool.query("update users set display_name = $1, username = $2 where id = $3", [display_name, username, user_id])

        if (result.rowCount > 0)
            return true
        return false
    } catch (err) {
        console.error(err)
    }
}