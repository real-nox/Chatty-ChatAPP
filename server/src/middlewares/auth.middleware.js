import * as user_service from "../services/user.service.js"

export const attachUser = async (req, res, next) => {
    if (!req.session.userId) {
        req.user = null
        return next()
    }

    try {
        const { success, error, user = null } = await user_service.fetchUser(req?.session?.userId)
        req.user = success ? user : null
        next()
    } catch (error) {
        next(error)
    }
}