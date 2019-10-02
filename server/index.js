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

  socket.on('chat message', msg => {
    console.log(`message: ${msg}`);
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(3001, () => {
  console.log('listening on http://localhost:3001');
});
