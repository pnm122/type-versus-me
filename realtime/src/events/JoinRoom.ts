import { ClientJoinRoomCallback, ClientJoinRoomPayload } from '$shared/types/events/client/JoinRoom'
import { User } from '$shared/types/User'
import { INITIAL_USER_SCORE, INITIAL_USER_STATE, MAX_USERS_PER_ROOM } from '$shared/constants'
import state from '@/global/state'
import CustomSocket from '@/types/CustomSocket'
import { check, isValidEventAndPayload } from '@/utils/eventUtils'
import { generateColorFromPreference } from '$shared/utils/generateColor'
import io from '@/global/server'

export default function JoinRoom(
	socket: CustomSocket,
	value: ClientJoinRoomPayload,
	callback: ClientJoinRoomCallback
) {
	if (!isValidEventAndPayload(socket, callback, value?.user?.id, value?.roomId, value?.user)) {
		return
	}

	const { roomId: tempRoomId, user } = value
	// Casing doesn't matter, since all room codes are uppercase
	const roomId = tempRoomId.toUpperCase()

	if (check(state.getRoomFromUser(user.id), 'user-in-room-already', callback)) {
		return
	}

	if (check(!state.getRoom(roomId), 'room-does-not-exist', callback)) {
		return
	}

	if (check(state.getRoom(roomId)!.state === 'in-progress', 'game-in-progress', callback)) {
		return
	}

	if (check(state.getRoom(roomId)!.users.length >= MAX_USERS_PER_ROOM, 'room-is-full', callback)) {
		return
	}

	if (
		check(
			state.getRoom(roomId)!.users.find((u) => u.username === value.user.username),
			'username-taken',
			callback
		)
	) {
		return
	}

	const takenColors = state.getRoom(roomId)!.users.map((u) => u.color)

	const userToAdd: User = {
		...user,
		color: generateColorFromPreference(user.color, takenColors),
		score: INITIAL_USER_SCORE,
		state: INITIAL_USER_STATE
	}

	const room = state.addUserToRoom(roomId, userToAdd)!

	io.in(roomId).emit('join-room', {
		user: userToAdd,
		room
	})
	socket.join(roomId)

	callback({
		value: {
			user: userToAdd,
			room
		},
		error: null
	})
}
