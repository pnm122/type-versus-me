import io from "./global/server";
import Register from "./events/Register";
import CreateRoom from "./events/CreateRoom";
import JoinRoom from "./events/JoinRoom";

io.on('connect', (socket) => {
  socket.on('register', (...args) => Register(socket, ...args))
  socket.on('create-room', (...args) => CreateRoom(socket, ...args))
  socket.on('join-room', (...args) => JoinRoom(socket, ...args))
})

io.listen(5000)