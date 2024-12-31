import { CreateRoomCallback, CreateRoomPayload } from '$shared/types/events/client/CreateRoom'
import { User } from '$shared/types/User'
import { isValidColor, isValidUsername } from '$shared/utils/validators'
import { INITIAL_USER_SCORE, INITIAL_USER_STATE, MAX_ROOMS } from '$shared/constants'
import state from '@/global/state'
import CustomSocket from '@/types/CustomSocket'
import { check, isValidEventAndPayload } from '@/utils/eventUtils'

export default function CreateRoom(
	socket: CustomSocket,
	value: CreateRoomPayload,
	callback: CreateRoomCallback
) {
	if (!isValidEventAndPayload(socket, callback, value?.user?.id, value?.user, value?.settings)) {
		return
	}

	const { user, settings } = value

	if (check(!isValidUsername(user.username), 'invalid-username', callback)) {
		return
	}

	if (check(!isValidColor(user.color), 'invalid-color', callback)) {
		return
	}

	if (check(state.getRoomFromUser(user.id), 'user-in-room-already', callback)) {
		return
	}

	if (check(state.getRooms().length >= MAX_ROOMS, 'max-rooms-created', callback)) {
		return
	}

	const initialUser: User = {
		...user,
		state: INITIAL_USER_STATE,
		score: INITIAL_USER_SCORE
	}
	const room = state.createRoom(initialUser, settings)
	socket.join(room.id)

	callback({
		value: {
			room,
			user: initialUser
		},
		error: null
	})
}
