import * as user_service from "../services/user.service.js"
import { catchAsync } from "../utils/functions.js"

export const user_get_c = catchAsync(async (req, res, next) => {
    let user_id = req?.session?.userId
    let username = req?.body?.n_username
    let display_name = req?.body?.n_display_name

    let result = null

    if (!username && !display_name) {
        result = await user_service.get_user_s(user_id)
    } else {
        result = await user_service.update_user_s(user_id, display_name, username)
    }

    return res.json(result)
})

export const get_user_theme_c = catchAsync(async (req, res, next) => {
    let user_id = req?.session?.userId

    let theme = await user_service.get_user_theme_s(user_id)

    return res.json(theme)
})

export const set_user_theme_c = catchAsync(async (req, res, next) => {
    let user_id = req?.session?.userId
    let theme = req?.body?.theme

    let result = await user_service.set_user_theme_s(user_id, theme)

    return res.json(result)
})

export const update_user_c = catchAsync(async (req, res, next) => {
    let user_id = req?.body?.user_id
    let username = req?.body?.n_username
    let display_name = req?.body?.n_display_name

    let result = await user_service.update_user_s(user_id, display_name, username)

    return res.json(result)
})

/*export const user_get_c = async (req, res, next) => {
    try {
        const { email, pwd = null, passwordCheck = null } = req?.body

        if (pwd == null) {
            if (!email)
                return res.render("pages/forgotpass", { error: "Complete the form" })

            const { success, error, user = null } = await auth_service.fetchUserByEmail(email)

            if (!success)
                return res.render("pages/forgotpass", { error })

            return res.render("pages/forgotpass", { user })
        }

        if (pwd !== passwordCheck)
            return res.render("pages/forgotpass", { error: "Passwords are not matching!" })

        const { success, error } = await auth_service.changeUserPWD(email, pwd)

        if (!success)
            return res.render("pages/forgotpass", { error })

        return res.redirect("/auth/login")
    } catch (err) {
        next(err)
    }
}*/