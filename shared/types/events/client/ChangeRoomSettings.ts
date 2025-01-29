import { Return } from '../../Return'
import { Room, RoomSettings } from '../../Room'
import { User } from '../../User'

type Payload = {
	userSocketId: User['socketId']
	roomId: Room['id']
	settings: Partial<RoomSettings>
}

type Callback = (
	value: Return<
		null,
		| 'missing-argument'
		| 'invalid-user-id'
		| 'invalid-settings'
		| 'user-not-admin'
		| 'game-in-progress'
		| 'room-does-not-exist'
	>
) => void

export type { Payload as ChangeRoomSettingsPayload, Callback as ChangeRoomSettingsCallback }
