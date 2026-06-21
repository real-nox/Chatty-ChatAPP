import * as auth_service from "../services/auth.service.js"
import { catchAsync } from "../utils/functions.js"

export const user_authenticated_c = catchAsync(async (req, res, next) => {
    return res.json(req?.session?.userId ? req?.session?.userId : false)
})

export const register_c = catchAsync(async (req, res, next) => {
    const { username, display_name, email, pwd, passwordCheck } = req?.body

    if (!username || !display_name || !email || !pwd || !passwordCheck)
        return res.json({ success: false, error: "Complete the form" })

    if (pwd !== passwordCheck)
        return res.json({ success: false, error: "Passwords are not matching!" })

    const { success, error } = await auth_service.register_s({ display_name, username, email, pwd })

    if (!success)
        return res.json({ success: false, error: error })

    return res.json({ success: true, error: null })
})

export const login_c = catchAsync(async (req, res, next) => {
    const { email, pwd, remember_me } = req.body

    if (!email || !pwd)
        return res.json({ success: false, error: "Complete the form" })

    const { success, error, user = null } = await auth_service.login_s({ email, pwd })

    if (!success)
        return res.json({ success: false, error: error })

    req.session.userId = user.id

    if (remember_me)
        req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30

    return res.json({ success: true, error: null })
})

export const forgot_password_c = catchAsync(async(req, res, next) => {
    //To be completed later
})

export const logout_c = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) return next(err)
        res.clearCookie("connect.sid")
        return res.json(true)
    })
}