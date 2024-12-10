import { RegisterPayload, RegisterCallback } from './Register'
import { CreateRoomPayload, CreateRoomCallback } from './CreateRoom'
import { ClientJoinRoomPayload, ClientJoinRoomCallback } from './JoinRoom'
import { ChangeUsernamePayload, ChangeUsernameCallback } from './ChangeUsername'
import { RequestColorPayload, RequestColorCallback } from './RequestColor'
import { ChangeUserStatePayload, ChangeUserStateCallback } from './ChangeUserState'
import { ChangeUserScorePayload, ChangeUserScoreCallback } from './ChangeUserScore'
import { LeaveRoomCallback } from './LeaveRoom'

interface ClientEvents {
  /** Register a user and get a User object */
  'register': (value: RegisterPayload, callback: RegisterCallback) => Promise<void>
  /** Request to create a game room */
  'create-room': (value: CreateRoomPayload, callback: CreateRoomCallback) => Promise<void>
  /** Request to join a game room */
  'join-room': (value: ClientJoinRoomPayload, callback: ClientJoinRoomCallback) => Promise<void>
  /** Request to change username */
  'change-username': (value: ChangeUsernamePayload, callback: ChangeUsernameCallback) => Promise<void>
  /** Request to change color */
  'request-color': (value: RequestColorPayload, callback: RequestColorCallback) => Promise<void>
  /** Request to change state */
  'change-user-state': (value: ChangeUserStatePayload, callback: ChangeUserStateCallback) => Promise<void>
  /** Request to change score */
  'change-user-score': (value: ChangeUserScorePayload, callback: ChangeUserScoreCallback) => Promise<void>
  /** Request to leave a room */
  'leave-room': (_: any, callback: LeaveRoomCallback) => Promise<void>
}

export default ClientEvents