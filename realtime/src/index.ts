import io from "./global/server";
import Register from "./events/Register";
import CreateRoom from "./events/CreateRoom";
import JoinRoom from "./events/JoinRoom";
import ChangeUsername from "./events/ChangeUsername";
import ChangeUserState from "./events/ChangeUserState";
import ChangeUserScore from "./events/ChangeUserScore";
import LeaveRoom from "./events/LeaveRoom";
import Disconnect from "./events/Disconnect";

io.on('connect', (socket) => {
  socket.on('register', (...args) => Register(socket, ...args))
  socket.on('create-room', (...args) => CreateRoom(socket, ...args))
  socket.on('join-room', (...args) => JoinRoom(socket, ...args))
  socket.on('change-username', (...args) => ChangeUsername(socket, ...args))
  socket.on('change-user-state', (...args) => ChangeUserState(socket, ...args))
  socket.on('change-user-score', (...args) => ChangeUserScore(socket, ...args))
  socket.on('leave-room', (_, callback) => LeaveRoom(socket, callback))
  socket.on('disconnect', () => Disconnect(socket))
})

io.listen(5000)