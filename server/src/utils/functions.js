export const catchAsync = (fct) => (req, res, next) => {
    Promise.resolve(fct(req, res, next)).catch(next)
}

export const catchFctAsync = (fct) => async(...arg) => {
    try {
        return await fct(...arg)
    } catch (err) {
        console.error(err)
        return { success: false, error: "Something went wrong. Please try again." };
    }
}