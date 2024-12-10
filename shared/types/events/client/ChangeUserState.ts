import { User } from '../../User'
import { Return } from '../../Return'

type Payload = Pick<User, 'id' | 'state'>

type Callback = Return<
  null,
  | 'invalid-user-id'
  | 'invalid-state'
  | 'user-not-in-room'
>

export {
  Payload as ChangeUserStatePayload,
  Callback as ChangeUserStateCallback
}