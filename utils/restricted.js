const jwt = require('jsonwebtoken')
const secret = require('../config/secret')
const Auth = require('../auth/authModel')

module.exports = (req, res, next) =>
{
    const token = req.headers.authorization
    if(token)
    {
        jwt.verify(token, secret.jwtSecret, (err, decodedToken) =>
        {
            if(err) res.status(401).json({ errorMessage: 'Invalid Credentials' })
            else
            {
                // TODO: adjust this req assign
                req.user = {username: decodedToken.username}
                next()
            }
        })
    }
    else res.status(400).json({ errorMessage: 'No credentials provided' })
}