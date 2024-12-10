const ServerEvents = {
  /** A user has joined the room */
  JOIN_ROOM: 'join-room',
  /** A user's data has changed */
  CHANGE_USER_DATA: 'change-user-data',
  /** The room's data has changed */
  CHANGE_ROOM_DATA: 'change-room-test',
  /** A user has left the room */
  LEAVE_ROOM: 'leave-room'
} as const

export default ServerEvents