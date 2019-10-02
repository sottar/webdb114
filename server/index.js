var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const users = {};

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

io.on('connection', socket => {
  console.log('a user connected');
  socket.broadcast.emit('hi');

  socket.on('join', name => {
    console.log(`joined: ${name}`);
    io.emit('joined', name);
    users[socket.id] = name;
    console.log(users);
  });

  socket.on('chat message', ({ name, msg }) => {
    console.log(`message: ${msg}`);
    io.emit('chat', { name, msg });
  });

  socket.on('disconnect', e => {
    console.log('disconnected');
    io.emit('left', users[socket.id]);
    delete users[socket.id];
  });
});

http.listen(3001, () => {
  console.log('listening on http://localhost:3001');
});
