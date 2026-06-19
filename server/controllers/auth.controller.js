import * as auth_service from "../services/auth.service.js"

export const register_c = async (req, res, next) => {
    try {
        const { username, display_name, email, pwd, passwordCheck } = req?.body

        if (!username || !display_name || !email || !pwd || !passwordCheck)
            return res.json({ success: false, error: "Complete the form" })

        if (pwd !== passwordCheck)
            return res.json({ success: false, error: "Passwords are not matching!" })

        const { success, error } = await auth_service.register_s({ display_name, username, email, pwd })

        if (!success)
            return res.json({ success: false, error: error })

        return res.json({ success: true, error: null })
    } catch (err) {
        next(err)
    }
}

export const login_c = async (req, res, next) => {
    const { email, pwd, remember_me } = req.body

    if (!email || !pwd)
        return res.json({ success: false, error: "Complete the form" })

    try {
        const { success, error, user = null } = await auth_service.login_s({ email, pwd })

        if (!success)
            return res.json({ success: false, error: error })

        console.log(user.id)
        req.session.userId = user.id

        console.log(req.session)

        if (remember_me)
            req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30

        return res.json({ success: true, error: null })
    } catch (err) {
        next(err)
    }
}

export const logout_c = async (req, res, next) => {
    req.session.destroy((err) => {
        if (err) return next(err)
        res.clearCookie("connect.sid")
        return res.json(true)
    })
}

export const user_get_c = async (req, res, next) => {
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
}

export const user_get_theme_c = async (req, res, next) => {
    try {
        let user_id = req?.session?.userId

        let theme = await auth_service.getUserTheme_s(user_id)

        return res.json(theme)
    } catch (err) {
        next(err)
    }
}

export const user_set_theme_c = async (req, res, next) => {
    try {
        let user_id = req?.session?.userId
        let theme = req?.body?.theme

        let result = await auth_service.setUserTheme_s(user_id, theme)

        console.log(result)
        return res.json(result)
    } catch (err) {
        next(err)
    }
}

export const user_Update = async (req, res, next) => {
    try {
        let user_id = req?.body?.user_id
        let username = req?.body?.n_username
        let display_name = req?.body?.n_display_name

        let result = await auth_service.UpdateUserUsername_Display(user_id, display_name, username)

        return res.json(result)
    } catch (err) {
        next(err)
    }
}

export const getUser = async (req, res, next) => {
    try {
        let user_id = req?.session?.userId
        let username = req?.body?.n_username
        let display_name = req?.body?.n_display_name

        let result = await auth_service.UpdateUserUsername_Display(user_id, display_name, username)

        return res.json(result)
    } catch (err) {
        next(err)
    }
}