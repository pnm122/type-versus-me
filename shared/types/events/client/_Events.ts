import { RegisterPayload, RegisterCallback } from './Register'
import { CreateRoomPayload, CreateRoomCallback } from './CreateRoom'
import { ClientJoinRoomPayload, ClientJoinRoomCallback } from './JoinRoom'
import { ChangeUsernamePayload, ChangeUsernameCallback } from './ChangeUsername'
import { RequestColorPayload, RequestColorCallback } from './RequestColor'
import { ChangeUserStatePayload, ChangeUserStateCallback } from './ChangeUserState'
import { ChangeUserScorePayload, ChangeUserScoreCallback } from './ChangeUserScore'
import { LeaveRoomCallback } from './LeaveRoom'
import { GetRoomPayload, GetRoomCallback } from './GetRoom'
import { ChangeRoomSettingsCallback, ChangeRoomSettingsPayload } from './ChangeRoomSettings'

interface ClientEvents {
	/** Register a user and get a User object */
	register: (value: RegisterPayload, callback: RegisterCallback) => Promise<void> | void
	/** Request to create a game room */
	'create-room': (value: CreateRoomPayload, callback: CreateRoomCallback) => Promise<void> | void
	/** Request to join a game room */
	'join-room': (
		value: ClientJoinRoomPayload,
		callback: ClientJoinRoomCallback
	) => Promise<void> | void
	/** Request to change username */
	'change-username': (
		value: ChangeUsernamePayload,
		callback: ChangeUsernameCallback
	) => Promise<void> | void
	/** Request to change color */
	'request-color': (
		value: RequestColorPayload,
		callback: RequestColorCallback
	) => Promise<void> | void
	/** Request to change state */
	'change-user-state': (
		value: ChangeUserStatePayload,
		callback: ChangeUserStateCallback
	) => Promise<void> | void
	/** Request to change score */
	'change-user-score': (
		value: ChangeUserScorePayload,
		callback: ChangeUserScoreCallback
	) => Promise<void> | void
	/** Request to leave a room */
	'leave-room': (_: any, callback: LeaveRoomCallback) => Promise<void> | void
	/** Get a room if it exists */
	'get-room': (value: GetRoomPayload, callback: GetRoomCallback) => Promise<void> | void
	'change-room-settings': (
		value: ChangeRoomSettingsPayload,
		callback: ChangeRoomSettingsCallback
	) => Promise<void> | void
}

export default ClientEvents
