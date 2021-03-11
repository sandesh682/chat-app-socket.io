const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path')

app.use(express.static(path.join(__dirname, "public")))


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

let count = 0

io.on('connection', (socket) => {

    // To send welcome message when user refresh the page(sending to single user)!
    socket.emit('sendMessage','Welcome..!')

    // To send message to all users except , new joiner
    socket.broadcast.emit('sendMessage','A new user has joined..!')
  
    // To send message to all users...!
    socket.on('sendMessage',(message,callback)=>{        
        io.emit('sendMessage',message)
        callback('Devivered!')
    })

    socket.on('sendLocation',(coords,callback)=>{
      io.emit('locationMessage',`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`)
      callback('Location Shared')
    })

    //To send message to all users except who left...!, Disconnect event will get called automatically when browser window closes
    socket.on('disconnect', () => {
        io.emit('sendMessage','a user has left!')
    });

});

http.listen(3000, () => {
  console.log('listening on *:3000');
});