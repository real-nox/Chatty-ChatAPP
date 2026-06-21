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

export const forgot_password_s = async() => {
    
}