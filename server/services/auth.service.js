import bcrypt from "bcrypt"
import * as auth_repository from "../repositories/user.repository.js"

export const register_s = async (newUserInfo) => {
    let { display_name, username, email, pwd } = newUserInfo

    const FoundUsername = await auth_repository.getUsernames(username)

    if (FoundUsername)
        return { success: false, error: "This username has been already been used! Use another one" }

    const FoundEmail = await auth_repository.getEmails(email)

    if (FoundEmail)
        return { success: false, error: "This email has been already been used! Use another one" }

    const salt = bcrypt.genSaltSync()
    pwd = bcrypt.hashSync(pwd, salt)

    const result = await auth_repository.addUser({ display_name, username, email, pwd })

    if (result)
        return { success: true, error: "" }
    else
        return { success: false, error: "Database error, could not add user!" }

}

export const login_s = async (userInfo) => {
    let { email, pwd } = userInfo

    const FoundUser = await auth_repository.getUserByEmail(email)

    if (!FoundUser)
        return { success: false, error: "Email does not exist! Create a new account." }

    const IsPassWord = bcrypt.compareSync(pwd, FoundUser.password)

    if (!IsPassWord)
        return { success: false, error: "Email or Password is incorrect." }

    return { success: true, error: "", user: FoundUser }
}

export const fetchUser = async (userId) => {
    const User = await auth_repository.getUserById(userId)

    if (!User)
        return { success: false, error: "User is not found!" }

    return { success: true, error: "", user: User }
}

export const fetchUserByEmail = async (email) => {
    let User = await auth_repository.getUserByEmail(email)

    if (!User)
        return { success: false, error: "User is not found!" }

    User = { id: User.id, email: User.email, pwd: User.password }
    return { success: true, error: "", user: User }
}

export const changeUserPWD = async (email, new_pwd) => {
    const User = await auth_repository.getUserByEmail(email)

    if (!User)
        return { success: false, error: "User is not found!" }

    if (User.password && bcrypt.compareSync(new_pwd, User.password)) {
        return { success: false, error: "Use another password." }
    }

    const salt = bcrypt.genSaltSync()
    const newPWD = bcrypt.hashSync(new_pwd, salt)
    const changePWD = await auth_repository.updatePwdUser(User.id, newPWD)

    console.log(changePWD)
    if (changePWD)
        return { success: true, error: "" }
    return { success: false, error: "Could not change password." }
}

export const getUserTheme_s = async (userid) => {
    if (!userid)
        return { success: false, error: "User ID was not provided!" }

    let user = await auth_repository.getUserById(userid)

    if (!user)
        return { success: false, error: "User is not found!" }

    const theme = await auth_repository.getUserTheme(userid)

    if (theme)
        return { success: true, theme: theme, error: "" }
    return { success: false, error: "Could not retrieve user's theme." }
}

export const setUserTheme_s = async (userid, theme) => {
    if (!userid)
        return { success: false, error: "User ID was not provided!" }

    if (!theme)
        return { success: false, error: "Theme was not provided!" }

    let user = await auth_repository.getUserById(userid)

    if (!user)
        return { success: false, error: "User is not found!" }

    const result = await auth_repository.setUserTheme(userid, theme)

    if (result)
        return { success: true, error: "" }
    return { success: false, error: "Could not retrieve user's theme." }
}

export const UpdateUserUsername_Display = async (user_id, display_name, username) => {
    const user = await auth_repository.getUserById(user_id)

    if (!user)
        return { success: false, msg: "User ID was not provided!" }

    if (!display_name)
        return { success: false, msg: "Display name was not provided!" }

    if (!username)
        return { success: false, msg: "Username was not provided!" }

    const found_username = await auth_repository.getUsernames(username)

    if (found_username)
        return { success: false, msg: "Username already used! Comme up with a new one!" }

    const result = await auth_repository.EditUser(user_id, username, display_name)

    if (result)
        return { success: true, msg: "User profile has been updated!" }
    return { success: false, msg: "User profile could not be updated, try again." }
}