import { User } from '../../User'

type Payload = Partial<User> & Pick<User, 'id'>

export type {
  Payload as ChangeUserDataPayload
}