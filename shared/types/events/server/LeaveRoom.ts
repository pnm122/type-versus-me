import { User } from '../../User'

type Payload = Pick<User, 'id'>

export type {
  Payload as ServerLeaveRoomPayload
}