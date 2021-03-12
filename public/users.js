let users = []

// ***************************** GET requests **************************************************

const getUser = (id)=>{
    const index = users.findIndex((user)=> user.id === id)

    if(index !== -1){
        return {
            status:'success',
            data: users[index]
        }
    }
    else{
        return {
            status: 'error',
            data: 'no user found.'
        }
    }
}

const getUsersFromRoom = (room)=>{
    
    const members = users.filter((user)=> user.room === room)

    if(users){
        return {
            status:'success',
            data: members
        }
    }
    else{
        return {
            status: 'error',
            data: `no user found in room ${room}`
        }
    }
}

// ***************************** POST requests **************************************************

const addUser = ({id,username,room}) => {

    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    
    let doesExists = users.find((user)=> ((user.username === username) && (user.room === room)) )

    if(doesExists){
        return {
            status : 'error',
            message : 'User already exists in same room'
        }
    }
    else{
        users.push({id,username,room})
        return {
            status : 'success',
            message : 'User added to room'
        }
    }
}

// ***************************** delete requests **************************************************

const removeUser = (id) => {

    const index = users.findIndex((user)=> user.id === id)

    if(index !== -1){
       return users.splice(index,1)[0]
    }
}

module.exports = {
    getUser,
    getUsersFromRoom,
    addUser,
    removeUser
}

