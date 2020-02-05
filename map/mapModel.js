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

async function findById(id) { 
    console.log('id from findById', id)
    let room = await db('rooms').where({id}).first()
    return room 
}

async function add(room)
{
    console.log('room from add', room)
    try
    {
        let coords = room.coordinates.split('')
        coords.shift()
        coords.pop()
        coords = coords.join('')
        coords = coords.split(',')

        exitObj = {
            n_to: -2,
            e_to: -2,
            s_to: -2,
            w_to: -2
        }

        room.exits.forEach(el =>
        {
            exitObj[`${el}_to`] = -1
        })

        let insertionRoom = {
            id: room.room_id,
            title: room.title,
            description: room.description,
            x: coords[0],
            y: coords[1],
            special: '',
            n_to: exitObj.n_to,
            e_to: exitObj.e_to,
            s_to: exitObj.s_to,
            w_to: exitObj.w_to,
        }
        const [id] = await db('rooms').insert(insertionRoom, 'id')
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
            detailedRoom = await findById(rooms[i].room_id)
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
        // console.log('cur room', curRoom)
        let addedRoom = await add(curRoom)
        // console.log('addedRoom', addedRoom)
        let added = await addUser(curRoom.room_id, userId)
        // console.log('b', added)
        // console.log('prevRoom', prevRoom)
        if(Object.keys(prevRoom).length > 0 )
        {
            console.log('if hit')
            let pRoom = await findById(prevRoom.room_id)
            let cRoom = await findById(curRoom.room_id)
            // console.log('cRoom', cRoom)
            // console.log('pRoom', pRoom)
            pRoom[`${direction}_to`] = cRoom.id
            cRoom[revDict[direction]] = pRoom.id
            await updateRoom(pRoom)
            
            await updateRoom(cRoom)

        }
        console.log('thing')
        return getAllforUser(userId)
    }
    catch(error)
    {
        return 0
    }
}