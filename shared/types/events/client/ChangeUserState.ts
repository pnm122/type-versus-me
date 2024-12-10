import { User } from '../../User'
import { Return } from '../../Return'

type Payload = Pick<User, 'id' | 'state'>

type Callback = (
  value: Return<
    null,
    | 'invalid-user-id'
    | 'invalid-state'
    | 'user-not-in-room'
  >
) => void

export type {
  Payload as ChangeUserStatePayload,
  Callback as ChangeUserStateCallback
}