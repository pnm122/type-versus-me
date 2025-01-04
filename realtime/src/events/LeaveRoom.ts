import { LeaveRoomCallback } from '$shared/types/events/client/LeaveRoom'
import io from '@/global/server'
import state from '@/global/state'
import CustomSocket from '@/types/CustomSocket'
import { check, setRoomToInProgress } from '@/utils/eventUtils'

export default async function LeaveRoom(socket: CustomSocket, callback: LeaveRoomCallback) {
	if (typeof callback !== 'function') return

	const room = state.getRoomFromUser(socket.id)
	if (check(!room, 'user-not-in-room', callback)) {
		return
	}

	state.removeUserFromRoom(room!.id, socket.id)
	socket.leave(room!.id)
	io.in(room!.id).emit('leave-room', { userId: socket.id, room: room! })

	if (state.getRoom(room!.id)!.users.length === 0) {
		state.removeRoom(room!.id)
		return callback({
			value: null,
			error: null
		})
	}

	const allUsersReady = state.getRoom(room!.id)!.users.every((u) => u.state === 'ready')
	if (allUsersReady) {
		await setRoomToInProgress(room!)
	}

	const allUsersDone = state
		.getRoom(room!.id)!
		.users.every((u) => u.state === 'complete' || u.state === 'failed')
	if (allUsersDone) {
		state.updateRoom(room!.id, { state: 'complete' })
		io.in(room!.id).emit('change-room-data', { state: 'complete' })
	}

	if (state.getRoom(room!.id)!.admin === socket.id) {
		// relies on (A) the user making this request was already removed and (B) we already checked if the room was empty
		const newAdmin = state.getRoom(room!.id)!.users[0]!.id
		state.updateRoom(room!.id, { admin: newAdmin })
		io.in(room!.id).emit('change-room-data', { admin: newAdmin })
	}

	callback({
		value: null,
		error: null
	})
}
