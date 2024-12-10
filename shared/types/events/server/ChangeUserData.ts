import { User } from '../../User'

type Payload = Partial<User> & Pick<User, 'id'>

export {
  Payload as ChangeUserDataPayload
}