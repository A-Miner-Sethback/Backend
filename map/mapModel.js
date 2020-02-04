const db = require('../database/dbConfig')

module.exports =
{
    add,
    findById,
    addUser,
    getAllforUser,
    updateRoom,
    travel
}

function findById(id) { 
    console.log('id from findById', id)
    return db('rooms').where({id}).first() }

async function add(room)
{
    console.log('room from add', room)
    try
    {

        const [id] = await db('rooms').insert(room, 'id')
        console.log('id from add try', id)
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
        console.log('userId', userId)
        let rooms = await db('users_rooms').where({'user_id': userId, visited: true})
        let detailedRooms = []
        for(let i = 0; i<rooms.length; i++)
        {
            console.log('rooms[i]', rooms[i])
            detailedRoom = await findById(rooms[i].id)
            detailedRooms.push(detailedRoom)
        }
        
        return detailedRooms
    }
    catch(error)
    {
        return error
    }
}

async function updateRoom(room)
{
    await db('rooms').where({'id': room.id}).update(room)
    return findById(room.id)
}

async function travel(prevRoom, curRoom, direction, userId)
{
    console.log('user id from travel', userId)
    let revDict = {'n': 's_to', 'e': 'w_to', 's': 'n_to', 'w': 'e_to'}
    try
    {
        console.log('cur room', curRoom)
        await add(curRoom)
        console.log('a')
        await addUser(curRoom.id, userId)
        console.log('b')
        console.log('prevRoom', prevRoom)
        if(Object.keys(prevRoom).length > 0 )
        {
            console.log('if hit')
            let pRoom = await findById(prevRoom.id)
            let cRoom = await findById(curRoom.id)
            pRoom[`${direction}_to`] = cRoom.id
            cRoom[revDict[direction]] = pRoom.id
            await updateRoom(pRoom)
            
            await updateRoom(cRoom)

        }
        
        return getAllforUser(userId)
    }
    catch(error)
    {
        return 0
    }
}