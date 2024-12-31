import { User } from '../../User'
import { Room, RoomSettings } from '../../Room'
import { Return } from '../../Return'

type Payload = {
	user: User
	settings: RoomSettings
}

type Callback = (
	value: Return<
		{
			room: Room
			user: User
		},
		| 'missing-argument'
		| 'invalid-user-id'
		| 'invalid-username'
		| 'invalid-color'
		| 'user-in-room-already'
		| 'max-rooms-created'
		| 'invalid-settings'
	>
) => void

export type { Payload as CreateRoomPayload, Callback as CreateRoomCallback }
