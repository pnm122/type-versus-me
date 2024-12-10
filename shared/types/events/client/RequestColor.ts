import { User } from '../../User'
import { Return } from '../../Return'

type Payload = Pick<User, 'id' | 'color'>

type Callback = Return<
  null,
  | 'invalid-user-id'
  | 'color-not-provided'
  | 'invalid-color'
  | 'color-taken'
  | 'user-not-in-room'
>

export {
  Payload as RequestColorPayload,
  Callback as RequestColorCallback
}