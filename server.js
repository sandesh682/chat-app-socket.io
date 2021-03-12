const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path')
const { getUser,getUsersFromRoom,removeUser,addUser } = require('./public/users')

app.use(express.static(path.join(__dirname, "public")))


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

let count = 0

io.on('connection', (socket) => {
  
    // To send message to all users...!
    socket.on('sendMessage',(message,callback)=>{  
        
        const response = getUser(socket.id)
        if(response['status']=='success'){
          
          const data = response['data']
          io.to(data['room']).emit('sendMessage',message,data['username'])
          callback('Devivered!')
        }
    })

    socket.on('sendLocation',(coords,callback)=>{
      
      const response = getUser(socket.id)
      if(response['status']=='success'){

        const data = response['data']
        io.to(data['room']).emit('locationMessage',`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`,data['username'])
        callback('Location Shared')
      }  
    })

    socket.on('join',({username,room},callback)=>{
      
      const response = addUser({id:socket.id, username,room})
      
      if(response['status']=='success'){
          socket.join(room)
          // To send welcome message when user refresh the page(sending to single user)!
          socket.emit('sendMessage',`Welcome,${username}`)
          // To send message to all users except , new joiner
          socket.broadcast.to(room).emit('sendMessage',`${username} has joined.`)

          io.to(room).emit('liveUsers',{
             room : room,
             activeUsers : getUsersFromRoom(room)['data']
          })
      }
      else{
        callback(response['message'])
      }

    })


    //To send message to all users except who left...!, Disconnect event will get called automatically when browser window closes
    socket.on('disconnect', () => {
        
        const user = removeUser(socket.id)
        
        if(user){
          io.to(user['room']).emit('sendMessage',`${user['username']} has left!`)
          io.to(user['room']).emit('liveUsers',{
            room : user['room'],
            activeUsers : getUsersFromRoom(user['room'])['data']
         })
        }
    });

});

http.listen(3000, () => {
  console.log('listening on *:3000');
});