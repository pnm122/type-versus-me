import { Room } from '$shared/types/Room'
import { User } from '../../User'

type Payload = {
  user: User
  room: Room
}

export type {
  Payload as ServerJoinRoomPayload
}