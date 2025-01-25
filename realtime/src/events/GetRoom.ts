import { GetRoomCallback, GetRoomPayload } from '$shared/types/events/client/GetRoom'
import state from '@/global/state'
import { check } from '@/utils/eventUtils'

export default function GetRoom(value: GetRoomPayload, callback: GetRoomCallback) {
	if (typeof callback !== 'function') return

	if (check(value === null || value === undefined, 'missing-argument', callback)) {
		return
	}

	const room = state.getRoom(value) ?? null
	callback({ value: room, error: null })
}
