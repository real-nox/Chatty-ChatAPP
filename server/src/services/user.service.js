import * as user_repository from "../repositories/user.repository.js"
import { catchFctAsync } from "../utils/functions.js"

export const get_user_s = catchFctAsync(async (userId) => {
    if (!userId)
        return { success: false, error: "User ID was not provided!" }

    const user = await user_repository.getUserById(userId)

    if (!user)
        return { success: false, msg: "User was not provided!" }

    const { display_name, id, username } = user

    return { id: id, display_name: display_name, username: username, avatar: null, presence: true }
})

export const update_user_s = catchFctAsync(async (userId, display_name, username) => {
    if (!userId)
        return { success: false, error: "User ID was not provided!" }

    const user = await user_repository.getUserById(userId)

    if (!user)
        return { success: false, msg: "User was not provided!" }

    if (!display_name)
        return { success: false, msg: "Display name was not provided!" }

    if (!username)
        return { success: false, msg: "Username was not provided!" }

    const found_username = await user_repository.getUsernames(username)

    if (found_username)
        return { success: false, msg: "Username already been used! Comme up with a new one!" }

    const result = await user_repository.EditUser(userId, username, display_name)

    if (result)
        return { success: true, msg: "User profile has been updated!" }
    return { success: false, msg: "User profile could not be updated, try again." }
})

export const get_user_theme_s = catchFctAsync(async (userid) => {
    if (!userid)
        return { success: false, error: "User ID was not provided!" }

    let user = await user_repository.getUserById(userid)

    if (!user)
        return { success: false, error: "User is not found!" }

    const theme = await user_repository.getUserTheme(userid)

    if (theme)
        return { success: true, theme: theme, error: "" }
    return { success: false, error: "Could not retrieve user's theme." }
})

export const set_user_theme_s = catchFctAsync(async (userid, theme) => {
    if (!userid)
        return { success: false, error: "User ID was not provided!" }

    if (!theme)
        return { success: false, error: "Theme was not provided!" }

    let user = await user_repository.getUserById(userid)

    if (!user)
        return { success: false, error: "User is not found!" }

    const result = await user_repository.setUserTheme(userid, theme)

    if (result)
        return { success: true, error: "" }
    return { success: false, error: "Could not update user's theme." }
})

export const fetchUser = catchFctAsync(async (userId) => {
    const User = await user_repository.getUserById(userId)

    if (!User)
        return { success: false, error: "User is not found!" }

    return { success: true, error: "", user: User }
})

/*export const fetchUserByEmail = catchFctAsync(async (email) => {
    let User = await user_repository.getUserByEmail(email)

    if (!User)
        return { success: false, error: "User is not found!" }

    User = { id: User.id, email: User.email, pwd: User.password }
    return { success: true, error: "", user: User }
}

export const changeUserPWD = catchFctAsync(async (email, new_pwd) => {
    const User = await user_repository.getUserByEmail(email)

    if (!User)
        return { success: false, error: "User is not found!" }

    if (User.password && bcrypt.compareSync(new_pwd, User.password)) {
        return { success: false, error: "Use another password." }
    }

    const salt = bcrypt.genSaltSync()
    const newPWD = bcrypt.hashSync(new_pwd, salt)
    const changePWD = await user_repository.updatePwdUser(User.id, newPWD)

    console.log(changePWD)
    if (changePWD)
        return { success: true, error: "" }
    return { success: false, error: "Could not change password." }
}*/