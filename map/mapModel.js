const db = require('../database/dbConfig')

module.exports =
{
    add,
    findById,
    addUser,
    getAllforUser
}

function findById(id) { return db('rooms').where({id}).first() }

async function add(room)
{
    try
    {
        const [id] = await db('rooms').insert(room, 'id')
        return findById(id)
    }
    catch(error) {return room.id}
}

async function addUser(roomId, userId)
{
    try
    {
        await db('users_rooms').insert({'room_id': roomId, 'user_id': userId, 'visited': true})
        return 1
    }
    catch(error)
    {
        return 0
    }
}

async function getAllforUser(userId)
{
    try
    {
        rooms = await db('users_rooms').where({'user_id': userId, visited: true})
        detailedRooms = []
        rooms.forEach(el => detailedRooms.push(findById(el.id)))
        return detailedRooms
    }
    catch(error)
    {
        return error
    }
}