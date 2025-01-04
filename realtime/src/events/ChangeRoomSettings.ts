import { MAX_TEST_TIME, MAX_TEST_WORDS, MIN_TEST_TIME, MIN_TEST_WORDS } from '$shared/constants'
import {
	ChangeRoomSettingsPayload,
	ChangeRoomSettingsCallback
} from '$shared/types/events/client/ChangeRoomSettings'
import { roomCategories } from '$shared/types/Room'
import io from '@/global/server'
import state from '@/global/state'
import CustomSocket from '@/types/CustomSocket'
import { check, isValidEventAndPayload } from '@/utils/eventUtils'

export default function ChangeRoomSettings(
	// eslint-disable-next-line
	socket: CustomSocket,
	// eslint-disable-next-line
	value: ChangeRoomSettingsPayload,
	// eslint-disable-next-line
	callback: ChangeRoomSettingsCallback
) {
	if (!isValidEventAndPayload(socket, callback, value?.userId, value?.roomId, value?.settings)) {
		return
	}

	const { roomId, userId, settings } = value

	if (
		check(
			settings.category && !roomCategories.includes(settings.category),
			'invalid-settings',
			callback
		)
	) {
		return
	}

	if (
		check(
			settings.numWords &&
				(settings.numWords < MIN_TEST_WORDS || settings.numWords > MAX_TEST_WORDS),
			'invalid-settings',
			callback
		)
	) {
		return
	}

	if (
		check(
			settings.timeLimit &&
				(settings.timeLimit < MIN_TEST_TIME || settings.timeLimit > MAX_TEST_TIME),
			'invalid-settings',
			callback
		)
	) {
		return
	}

	const room = state.getRoom(roomId)

	if (check(!room, 'room-does-not-exist', callback)) {
		return
	}

	if (check(room!.admin !== userId, 'user-not-admin', callback)) {
		return
	}

	if (check(room!.state === 'in-progress', 'game-in-progress', callback)) {
		return
	}

	const newSettings = { ...room!.settings, ...settings }
	state.updateRoom(roomId, { settings: newSettings })
	io.in(roomId).emit('change-room-data', { settings: newSettings })

	callback({
		value: null,
		error: null
	})
}
