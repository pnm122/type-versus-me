import { User } from '../../User'
import { Return } from '../../Return'

type Payload = Pick<User, 'id' | 'score'>

type Callback = Return<
  null,
  | 'invalid-user-id'
  | 'invalid-room-state'
  | 'user-not-in-room'
>

export {
  Payload as ChangeUserStatePayload,
  Callback as ChangeUserStateCallback
}