import { Return } from '../../Return'
import { User } from '../../User'

type Payload = Partial<Pick<User, 'username' | 'color'>>

type Callback = Return<
  User
>

export {
  Payload as ConnectPayload,
  Callback as ConnectCallback
}