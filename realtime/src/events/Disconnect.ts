import state from '@/global/state'
import CustomSocket from '@/types/CustomSocket'
import LeaveRoom from './LeaveRoom'
import io from '@/global/server'

export default function Disconnect(socket: CustomSocket) {
	io.emit('change-user-count', io.engine.clientsCount)

	const room = state.getRoomFromUser(socket.id)

	if (room) {
		LeaveRoom(socket, () => {})
	}
}
