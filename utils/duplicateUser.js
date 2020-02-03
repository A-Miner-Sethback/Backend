const Users = require('../auth/authModel')

module.exports = (req, res, next) =>
{
    const username = req.body.username
    Users.findBy({username})
        .then(response =>
            {
                if (response.length > 0) res.status(409).json({ errorMessage: 'That user already exists' })
                else next()
            })
        .catch(err =>
            {
                res.status(500).json({ errorMessage: 'Internal Error: Could not retrieve users' })
            })
}