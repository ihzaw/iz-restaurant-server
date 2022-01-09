const { verifyToken } = require('../helpers/jwt')

const auth = async (req, res, next) => {
    try {
        const { access_token } = req.headers
        const validUser = verifyToken(access_token)
        if (!validUser) {
            throw {name: 'unauthorizedUser'}
        }
        req.user = {
            id: validUser.id,
            email: validUser.email
        }  
        next()
    } catch (err) {
        next(err)
    }
}

module.exports = { auth }