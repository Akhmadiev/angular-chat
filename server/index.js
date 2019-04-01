let express = require('express')
let app = express();

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);
let users = [];

const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('join', function(data){
      socket.join(data.room);      
      console.log(data.user + ' joined the room : ' + data.room);

      users.push("@" + data.user + " ");
      users = users.filter( onlyUnique );

      io.in(data.room).emit('new user joined', { user: data.user, sockedId: socket.id, users: users, message:'has joined this room.' });

      // socket.broadcast.to(data.room).emit('new user joined', { user: data.user, users: users, message:'has joined this room.' });
    });

    socket.on('leave', function(data){
    
      console.log(data.user + 'left the room : ' + data.room);

      socket.broadcast.to(data.room).emit('left room', {user:data.user, message:'has left this room.'});

      socket.leave(data.room);
    });

    socket.on('message',function(data){
      io.in(data.room).emit('new message', {user:data.user, userTo:data.userTo, message:data.message});
    });

    socket.on('private_message',function(data){
      socket.to(data.socketId).emit('new_private_message', {user:data.user, userTo:data.userTo, message:data.message});
    });
});

server.listen(port, () => {
    console.log(`started on port: ${port}`);
});

function onlyUnique(value, index, self) { 
  return self.indexOf(value) === index;
}