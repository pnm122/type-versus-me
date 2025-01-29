import io from './global/server'
import Register from './events/Register'
import CreateRoom from './events/CreateRoom'
import JoinRoom from './events/JoinRoom'
import ChangeUsername from './events/ChangeUsername'
import ChangeUserState from './events/ChangeUserState'
import ChangeUserScore from './events/ChangeUserScore'
import LeaveRoom from './events/LeaveRoom'
import Disconnect from './events/Disconnect'
import debug, { DEBUG_COLORS } from './utils/debug'
import { config } from 'dotenv'
import GetRoom from './events/GetRoom'
import RequestColor from './events/RequestColor'
import ChangeRoomSettings from './events/ChangeRoomSettings'

config()

io.on('connect', (socket) => {
	debug(`${DEBUG_COLORS.BLUE}connect:${DEBUG_COLORS.WHITE}`, socket.id)

	// Need to give time for listeners to be set up client-side, 250ms should be way more than enough
	setTimeout(() => {
		io.emit('change-user-count', io.engine.clientsCount)
	}, 250)

	socket.on('register', (...args) => Register(socket, ...args))
	socket.on('create-room', (...args) => CreateRoom(socket, ...args))
	socket.on('join-room', (...args) => JoinRoom(socket, ...args))
	socket.on('change-username', (...args) => ChangeUsername(socket, ...args))
	socket.on('change-user-state', (...args) => ChangeUserState(socket, ...args))
	socket.on('change-user-score', (...args) => ChangeUserScore(socket, ...args))
	socket.on('request-color', (...args) => RequestColor(socket, ...args))
	socket.on('leave-room', (_, callback) => LeaveRoom(socket, callback))
	socket.on('get-room', (...args) => GetRoom(...args))
	socket.on('change-room-settings', (...args) => ChangeRoomSettings(socket, ...args))
	socket.on('disconnect', () => Disconnect(socket))

	socket.onAny((ev, ...args) => {
		debug(`${DEBUG_COLORS.BLUE}(IN) ${ev}:${DEBUG_COLORS.WHITE}`)
		debug(...args)
	})

	socket.onAnyOutgoing((ev, ...args) => {
		debug(`${DEBUG_COLORS.YELLOW}(OUT) ${ev}:${DEBUG_COLORS.WHITE}`)
		debug(...args)
	})

	socket.on('disconnect', () => {
		debug(`${DEBUG_COLORS.BLUE}disconnect:${DEBUG_COLORS.WHITE}`, socket.id)
	})
})

io.listen(5000)
