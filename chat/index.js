module.exports.startChat = server => {
  const io = require('socket.io').listen(server);
  const clients = {};

  io.on('connection', socket => {
    const id = socket.id;
    const obj = {
      id,
      username: socket.request.headers.username
    };
    clients[id] = obj;

    socket.json.emit('all users', clients);
    socket.broadcast.json.emit('new user', obj);

    socket.on('chat message', (message, user) => {
      console.log(id, user);
      io.to(user).emit('chat message', message, id);
    });

    socket.on('disconnect', () => {
      socket.broadcast.json.emit('delete user', id);
      delete clients[id];
    });
  });
};

