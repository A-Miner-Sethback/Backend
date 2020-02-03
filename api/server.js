const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const authRouter = require('../auth/authRouter')
const userRouter = require('../user/userRouter')


const server = express()
server.use(cors())

server.use(helmet())
server.use(express.json())
server.use('/api/auth', authRouter)
server.use('/api/user', userRouter)

server.get('/', (req, res) =>
{
    res.send("server is running")
})
module.exports = server