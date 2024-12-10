import { User } from '../../User'
import { Room } from '../../Room'
import { Return } from '../../Return'

type Payload = User

type Callback = Return<
  {
    user: User,
    room: Room
  },
  | 'invalid-user-id'
  | 'username-not-provided'
  | 'color-not-provided'
  | 'user-in-room-already'
  | 'room-does-not-exist'
  | 'game-in-progress'
  | 'room-is-full'
>

export {
  Payload as ClientJoinRoomPayload,
  Callback as ClientJoinRoomCallback
}