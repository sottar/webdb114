var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/foo', (req, res) => {
  res.send({ hoge: 'fooo' });
  // res.json({ hoge: 'fooo' });
});

io.on('connection', socket => {
  console.log('a user connected');
  socket.broadcast.emit('hi');

  socket.on('join', name => {
    console.log(`joined: ${name}`);
    io.emit('joined', name);
  });

  socket.on('chat message', ({ name, msg }) => {
    console.log(`message: ${msg}`);
    io.emit('chat', { name, msg });
  });

  socket.on('leave', name => {
    console.log('user left');
    io.emit('left', name);
  });

  socket.on('disconnect', e => {
    console.log('disconnected');
  });
});

http.listen(3001, () => {
  console.log('listening on http://localhost:3001');
});
