import {
	DoesRoomExistCallback,
	DoesRoomExistPayload
} from '$shared/types/events/client/DoesRoomExist'
import state from '@/global/state'
import { check } from '@/utils/eventUtils'

export default function DoesRoomExist(
	value: DoesRoomExistPayload,
	callback: DoesRoomExistCallback
) {
	if (typeof callback !== 'function') return

	if (check(value === null || value === undefined, 'missing-argument', callback)) {
		return
	}

	if (state.getRoom(value)) {
		callback({ value: true, error: null })
	} else {
		callback({ value: false, error: null })
	}
}
