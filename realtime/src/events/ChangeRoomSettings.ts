import {
	ChangeRoomSettingsPayload,
	ChangeRoomSettingsCallback
} from '$shared/types/events/client/ChangeRoomSettings'
import CustomSocket from '@/types/CustomSocket'

export default function ChangeRoomSettings(
	// eslint-disable-next-line
	socket: CustomSocket,
	// eslint-disable-next-line
	value: ChangeRoomSettingsPayload,
	// eslint-disable-next-line
	callback: ChangeRoomSettingsCallback
) {}
