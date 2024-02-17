module.exports = fn => {
    return (req, res, next) => {
        //NOTE: aynisi fn(req, res, next).catch(err => next(err))
        fn(req, res, next).catch(next)
    }
}