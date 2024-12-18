import { Room } from '$shared/types/Room'
import { User } from '../../User'

type Payload = {
  userId: User['id']
  room: Room
}

export type {
  Payload as ServerLeaveRoomPayload
}