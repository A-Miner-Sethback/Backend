const router = require('express').Router()
const Mappy = require('./mapModel')
const restricted = require('../utils/restricted')
const cors = require('cors')
const axios = require('axios')

router.use(cors())

router.get('/:userId', restricted, (req, res) =>
{
    Mappy.getAllforUser(req.params.userId)
        .then(response =>
            {
                res.status(200).json(response)
            })
        .catch(error =>
            {
                res.status(500).json({ errorMessage: `Internal Error: Could not get rooms for user ${req.params.userId}` })
            })
})

router.post('/:userId', restricted, (req, res) =>
{
    room = req.body.room
    Mappy.add(room)
        .then(response =>
        {
            Mappy.addUser(response.id, req.params.userId)
            .then(resp =>
            {
                Mappy.getAllforUser(req.params.userId)
                .then(resp3 =>
                {
                    res.status(201).json(resp)
                })
            })
            .catch(err =>
            {
                res.status(500).json({ errorMessage: `Internal Error: Could not add user ${req.params.userId} to room ${response.id}` })
            })
        })
        .catch(error =>
        {
            Mappy.addUser(error, req.params.userId)
            .then(resp =>
            {
                res.status(201).json(resp)
            })
            .catch(err =>
            {
                res.status(500).json({ errorMessage: `Internal Error: Could not add user ${req.params.userId} to room ${error}` })
            })
        })
})

router.post('/:userId/travel', restricted, (req, res) =>
{
    let {curRoom, prevRoom, direction} = req.body
    Mappy.travel(prevRoom, curRoom, direction)
        .then(response =>
        {
            res.status(200).json(response)
        })
        .catch(error =>
        {
            res.status(500).json({errorMessage: 'ERROR, something something travel problem'})
        })
})

router.put('/:userId', restricted, (req, res) =>
{
    room = req.body.room
    Mappy.updateRoom(room)
        .then(response =>
        {
            res.status(200).json(response)
        })
        .catch(error =>
        {
            res.status(500).json(error)
        })
})

module.exports = router