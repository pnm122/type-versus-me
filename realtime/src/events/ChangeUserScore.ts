import {
	ChangeUserScoreCallback,
	ChangeUserScorePayload
} from '$shared/types/events/client/ChangeUserScore'
import io from '@/global/server'
import state from '@/global/state'
import CustomSocket from '@/types/CustomSocket'
import { check, isValidEventAndPayload } from '@/utils/eventUtils'

export default function ChangeUserScore(
	socket: CustomSocket,
	value: ChangeUserScorePayload,
	callback: ChangeUserScoreCallback
) {
	if (!isValidEventAndPayload(socket, callback, value?.id, value?.score)) {
		return
	}

	const room = state.getRoomFromUser(value.id)
	if (check(!room, 'user-not-in-room', callback)) {
		return
	}

	if (check(room!.state !== 'in-progress', 'invalid-room-state', callback)) {
		return
	}

	state.updateUser(value.id, { score: value.score })
	io.in(room!.id).emit('change-user-data', value)

	callback({
		value: { score: value.score },
		error: null
	})
}
