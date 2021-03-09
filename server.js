const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

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
    socket.on('sendMessage',(message)=>{        
        io.emit('sendMessage',message)
    })

    //To send message to all users except who left...!, Disconnect event will get called automatically when browser window closes
    socket.on('disconnect', () => {
        io.emit('sendMessage','a use has left!')
    });

});

http.listen(3000, () => {
  console.log('listening on *:3000');
});