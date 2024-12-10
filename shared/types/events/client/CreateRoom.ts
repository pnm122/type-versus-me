import { User } from '../../User'
import { Room } from '../../Room'
import { Return } from '../../Return'

type Payload = User

type Callback = Return<
  Room,
  | 'invalid-user-id'
  | 'username-not-provided'
  | 'color-not-provided'
  | 'user-in-room-already'
  | 'max-rooms-created'
>

export {
  Payload as CreateRoomPayload,
  Callback as CreateRoomCallback
}