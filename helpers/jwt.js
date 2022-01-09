const jwt = require('jsonwebtoken')

const genToken = (payload) => {
    return jwt.sign(payload, 'rahasia')
}

const verifyToken = (token) => {
    return jwt.verify(token, 'rahasia')
}

module.exports = { genToken, verifyToken }