import {
	ChangeUsernameCallback,
	ChangeUsernamePayload
} from '$shared/types/events/client/ChangeUsername'
import { isValidUsername } from '$shared/utils/validators'
import io from '@/global/server'
import state from '@/global/state'
import CustomSocket from '@/types/CustomSocket'
import { check, isValidEventAndPayload } from '@/utils/eventUtils'

export default function ChangeUsername(
	socket: CustomSocket,
	value: ChangeUsernamePayload,
	callback: ChangeUsernameCallback
) {
	if (!isValidEventAndPayload(socket, callback, value?.socketId, value?.username)) {
		return
	}

	const { username, socketId } = value

	if (check(!isValidUsername(username), 'invalid-username', callback)) {
		return
	}

	const room = state.getRoomFromUser(socketId)
	if (check(!room, 'user-not-in-room', callback)) {
		return
	}

	const usernameTaken = !!state
		.getRoomFromUser(socketId)!
		.users.find((u) => u.username === username)
	if (check(usernameTaken, 'username-taken', callback)) {
		return
	}

	// Should be defined since we checked that the user is in a room already
	const newUser = state.updateUser(socketId, { username })!
	io.in(room!.id).emit('change-user-data', newUser)

	callback({
		value: { username },
		error: null
	})
}
