import { User } from '../../User'
import { Room } from '../../Room'
import { Return } from '../../Return'

type Payload = User

type Callback = (
  value: Return<
    {
      room: Room,
      user: User
    },
    | 'no-argument-provided'
    | 'invalid-user-id'
    | 'invalid-username'
    | 'invalid-color'
    | 'user-in-room-already'
    | 'max-rooms-created'
  >
) => void

export type {
  Payload as CreateRoomPayload,
  Callback as CreateRoomCallback
}