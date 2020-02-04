const router = require('express').Router()
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Users = require('./authModel')
const cors = require('cors')
const duplicateUser = require('../utils/duplicateUser')
const hashCount = require('../utils/hashCount')

router.use(cors())



router.post('/register', duplicateUser, (req, res) =>
{
    if(!req.body.username || !req.body.password)
    {
        res.status(400).json({ errorMessage: "Missing username or password" })
    }
    else
    {
        let {username, password} = req.body
        //TODO: inform FE if username is taken
        bcryptjs.genSalt(hashCount, function(err, salt)
        {
            bcryptjs.hash(password, salt, function(err, hash)
            {
                Users.add({username, password: hash})
                    .then(response =>
                        {
                            Users.findBy({ username: response.username }).first()
                            .then(user =>
                                {
                                    bcryptjs.compare(password, user.password, function(err, response)
                                    {
                                        if(response)
                                        {
                                            const token = generateToken(user)
                                            res.status(201).json({ id: user.id, username: user.username, token: token })
                                        }
                                        else res.status(401).json({ errorMessage: 'Invalid Credentials' })
                                    })
                                })
                        })
                    .catch(error =>
                        {
                            res.status(500).json({ errorMessage: `Internal Error: Could not register user` })
                            // res.status(500).json(error)
                        })
            })
        })
    }
})

router.post('/login', (req, res) =>
{
    if(!req.body.username || !req.body.password)
    {
        res.status(400).json({ errorMessage: "Missing username or password" })
    }
    else
    {
        let {username, password} = req.body
        Users.findBy({ username })
            .first()
            .then(user =>
                {
                    if(user)
                    {
                        bcryptjs.compare(password, user.password, function(err, response)
                        {
                            if(response)
                            {
                                const token = generateToken(user)
                                res.status(200).json({ token, userId: user.id, username })
                            }
                            else res.status(401).json({ errorMessage: 'Invalid Credentials' })
                        })
                    }
                    else res.status(401).json({ errorMessage: 'Invalid Credentials' })
                })
            .catch(error =>
                {
                    res.status(500).json({ errorMessage: 'Internal Error: Could not login' })
                })
    }
})


function generateToken(user)
{
    const payload = { username: user.username }
    const secret = require('../config/secret').jwtSecret
    const options = { expiresIn: '1d' }

    return jwt.sign(payload, secret, options)
}

module.exports = router