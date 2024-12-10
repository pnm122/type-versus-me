const ClientEvents = {
  /** Request a connection to the WebSocket */
  CONNECT: 'connection',
  /** Disconnect from the WebSocket */
  DISCONNECT: 'disconnect',
  /** Request to create a game room */
  CREATE_ROOM: 'create-room',
  /** Request to join a game room */
  JOIN_ROOM: 'join-room',
  /** Request to change username */
  CHANGE_USERNAME: 'change-username',
  /** Request to change color */
  REQUEST_COLOR: 'request-color',
  /** Request to change state */
  CHANGE_USER_STATE: 'change-user-state',
  /** Request to change score */
  CHANGE_USER_SCORE: 'change-user-score',
  /** Request to leave a room */
  LEAVE_ROOM: 'leave-room'
} as const

export default ClientEvents