let express = require('express')
let app = express();
var cors = require('cors');
const fileUpload = require('express-fileupload');
var fs = require('fs');
var path = require('path');

let http = require('http');
let server = http.Server(app);
let socketIO = require('socket.io');
let io = socketIO(server);
let users = [];

const port = process.env.PORT || 3000;

// default options
app.use(fileUpload());
app.use(cors());

app.post('/upload', function(req, res) {
  console.log("upload");
  console.log(__dirname);

  if (Object.keys(req.files).length == 0) {
    res.sendStatus(400).send('No files were uploaded.');
    return;
  }

  let file = req.files["file"];
  let uploadPath = __dirname + '/uploads/' + file.name;

  file.mv(uploadPath, function(err) {
    if (err) {
      return res.sendStatus(500).send(err);
    }

    res.sendStatus(200);
  });
});

app.post('/download', function(incomingData, res) {
  console.log("download");

  var filePath = __dirname + '/uploads/' + incomingData.body.file;
  res.sendFile(filePath);
});

io.on('connection', (socket) => {
    socket.on('join', function(data){
      socket.join(data.room);      
      console.log(`user: ${data.user}; socket: ${socket.id}; room: ${data.room}`);

      users.push({ user: data.user, socketId: socket.id });
      io.in(data.room).emit('new user joined', { user: data.user, users: users, message:'has joined this room.' });

      // socket.broadcast.to(data.room).emit('new user joined', { user: data.user, users: users, message:'has joined this room.' });
    });

    socket.on('leave', function(data){
    
      console.log(data.user + 'left the room : ' + data.room);

      socket.broadcast.to(data.room).emit('left room', {user:data.user, message:'has left this room.'});

      socket.leave(data.room);
    });

    socket.on('message',function(data){
      console.log(`${data.user} sent a message in the room: ${data.room}: ${data.message}`);
      io.in(data.room).emit('new message', {user: data.user, isFile: data.isFile, message: data.message});
    });

    socket.on('private_message',function(data){
      console.log(`${data.user} sent a private message to ${data.userTo}: ${data.message}`);
      socket.to(data.socketId).emit('new message', {user: data.user, private: true, message: data.message});
    });
});

server.listen(port, () => {
    console.log(`started on port: ${port}`);
});