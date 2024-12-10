import io from "./global/server";
import Register from "./events/Register";

io.on('connect', (socket) => {
  socket.on('register', (...args) => Register(socket, ...args))
})

io.listen(5000)