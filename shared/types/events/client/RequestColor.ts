import { User } from '../../User'
import { Return } from '../../Return'

type Payload = Pick<User, 'id' | 'color'>

type Callback = (
  value: Return<
    Pick<User, 'color'>,
    | 'missing-argument'
    | 'invalid-user-id'
    | 'invalid-color'
    | 'invalid-color'
    | 'color-taken'
    | 'user-not-in-room'
  >
) => void

export type {
  Payload as RequestColorPayload,
  Callback as RequestColorCallback
}