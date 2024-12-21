import { User } from "./User"

export interface RoomMetadata {
  id: string
  test?: string
  state: RoomState
}

export type Room = RoomMetadata & {
  users: User[]
}

/**
 * waiting: a game has not been played yet, and not all players are ready
 * in-progress: all players readied up and are currently typing
 * complete: a game has been played, and not all players are ready. The only difference between 'complete'
 * and 'waiting' is that a game has already been played.
 */
export type RoomState = 'waiting' | 'in-progress' | 'complete'