export const catchAsync = (fct) => (req, res, next) => {
    Promise.resolve(fct(req, res, next)).catch(next)
}

export const catchDBAsync = (fct) => (...arg) => {
    Promise.resolve(fct(...arg)).catch((err) => console.error(err))
}