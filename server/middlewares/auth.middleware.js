import * as auth_service from "../services/auth.service.js"

export const auth_m = async (req, res, next) => {
    if (!req.session.userId) {
        req.user = null
        return next()
    }

    try {
        const { success, error, user = null } = await auth_service.fetchUser(req?.session?.userId)
        req.user = success ? user : null
        next()
    } catch (error) {
        next(error)
    }
}

export const ifLogged = (req, res, next) => {
    if (req.session.userId)
        return res.redirect("/")
    next()
}