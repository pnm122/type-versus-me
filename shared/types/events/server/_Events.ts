import { ServerJoinRoomPayload } from './JoinRoom'
import { ChangeUserDataPayload } from './ChangeUserData'
import { ChangeAllUserDataPayload } from './ChangeAllUserData'
import { ChangeRoomDataPayload } from './ChangeRoomData'
import { ServerLeaveRoomPayload } from './LeaveRoom'
import { ChangeUserCountPayload } from './ChangeUserCount'

interface ServerEvents {
	/** A user has joined the room */
	'join-room': (value: ServerJoinRoomPayload) => void
	/** A user's data has changed */
	'change-user-data': (value: ChangeUserDataPayload) => void
	/** All user's data has changed */
	'change-all-user-data': (value: ChangeAllUserDataPayload) => void
	/** The room's data has changed */
	'change-room-data': (value: ChangeRoomDataPayload) => void
	/** A user has left the room */
	'leave-room': (value: ServerLeaveRoomPayload) => void
	/** A user connected/disconnected, so the number of active users has changed */
	'change-user-count': (value: ChangeUserCountPayload) => void
}

export default ServerEvents
