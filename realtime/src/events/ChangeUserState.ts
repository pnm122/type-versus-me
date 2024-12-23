import {
	ChangeUserStateCallback,
	ChangeUserStatePayload
} from '$shared/types/events/client/ChangeUserState'
import { RoomState } from '$shared/types/Room'
import { UserState } from '$shared/types/User'
import state from '@/global/state'
import CustomSocket from '@/types/CustomSocket'
import { check, isValidEventAndPayload, setRoomToInProgress } from '@/utils/eventUtils'
import io from '@/global/server'
import { INITIAL_USER_SCORE } from '$shared/constants'

export default function ChangeUserState(
	socket: CustomSocket,
	value: ChangeUserStatePayload,
	callback: ChangeUserStateCallback
) {
	if (!isValidEventAndPayload(socket, callback, value?.id, value?.state)) {
		return
	}

	const room = state.getRoomFromUser(value.id)
	if (check(!room, 'user-not-in-room', callback)) {
		return
	}

	// mapping of current room states to invalid requested user states
	const invalidStates: { [key in RoomState]: UserState[] } = {
		complete: ['in-progress', 'complete', 'failed'],
		'in-progress': ['not-ready', 'ready'],
		waiting: ['in-progress', 'complete', 'failed']
	}

	const invalidRequestedState = Object.keys(invalidStates).find(
		(roomState) =>
			!!invalidStates[roomState as RoomState].find(
				(userState) => room!.state === roomState && value.state === userState
			)
	)
	if (check(invalidRequestedState, 'invalid-state', callback)) {
		return
	}

	const lastScore =
		value.state === 'complete' || value.state === 'failed'
			? {
					netWPM: state.getUserInRoom(room!.id, value.id)!.score!.netWPM,
					failed: value.state === 'failed'
				}
			: undefined

	state.updateUser(value.id, { state: value.state, lastScore })
	io.in(room!.id).emit('change-user-data', { id: value.id, state: value.state, lastScore })

	const allUsersReady =
		room!.users.every((u) => u.id === value.id || u.state === 'ready') && value.state === 'ready'
	if (allUsersReady) {
		setRoomToInProgress(room!.id)
	}

	const allUsersDone =
		room!.users.every((u) => u.id === value.id || u.state === 'complete' || u.state === 'failed') &&
		(value.state === 'complete' || value.state === 'failed')
	if (allUsersDone) {
		state.updateRoom(room!.id, { state: 'complete' })
		io.in(room!.id).emit('change-room-data', { state: 'complete' })

		state.getRoom(room!.id)!.users.forEach((u) => {
			state.updateUser(u.id, { score: INITIAL_USER_SCORE, state: 'not-ready' })
		})
		io.in(room!.id).emit('change-all-user-data', { score: INITIAL_USER_SCORE, state: 'not-ready' })

		return callback({
			value: { state: 'not-ready' },
			error: null
		})
	}

	callback({
		value: { state: value.state },
		error: null
	})
}
