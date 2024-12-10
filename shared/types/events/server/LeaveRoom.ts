import { User } from '../../User'

type Payload = Pick<User, 'id'>

export {
  Payload as ServerJoinRoomPayload
}