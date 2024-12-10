import { User } from '../../User'
import { Room } from '../../Room'
import { Return } from '../../Return'

type Payload = Pick<User, 'id' | 'username'>

type Callback = Return<
  null,
  | 'invalid-user-id'
  | 'invalid-username'
  | 'username-taken'
  | 'user-not-in-room'
>

export {
  Payload as ChangeUsernamePayload,
  Callback as ChangeUsernameCallback
}