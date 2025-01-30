import { RequestColorCallback, RequestColorPayload } from '$shared/types/events/client/RequestColor'
import { isValidColor } from '$shared/utils/validators'
import io from '@/global/server'
import state from '@/global/state'
import CustomSocket from '@/types/CustomSocket'
import { check, isValidEventAndPayload } from '@/utils/eventUtils'

export default function RequestColor(
	socket: CustomSocket,
	value: RequestColorPayload,
	callback: RequestColorCallback
) {
	if (!isValidEventAndPayload(socket, callback, value?.socketId, value?.color)) {
		return
	}

	const { socketId, color } = value

	if (check(!isValidColor(color), 'invalid-color', callback)) {
		return
	}

	const room = state.getRoomFromUser(socketId)
	if (check(!room, 'user-not-in-room', callback)) {
		return
	}

	state.updateUser(socketId, { color })
	io.in(room!.id).emit('change-user-data', { socketId, color })

	callback({
		value: { color },
		error: null
	})
}
