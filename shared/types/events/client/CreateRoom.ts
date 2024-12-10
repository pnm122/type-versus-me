import { User } from '../../User'
import { Room } from '../../Room'
import { Return } from '../../Return'

type Payload = User

type Callback = (
  value: Return<
    Room,
    | 'invalid-user-id'
    | 'username-not-provided'
    | 'color-not-provided'
    | 'user-in-room-already'
    | 'max-rooms-created'
  >
) => void

export type {
  Payload as CreateRoomPayload,
  Callback as CreateRoomCallback
}