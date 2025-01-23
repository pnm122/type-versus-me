import { Room } from '$shared/types/Room'
import { User } from '../../User'

type Payload = {
	userSocketId: User['socketId']
	room: Room
}

export type { Payload as ServerLeaveRoomPayload }
