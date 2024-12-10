import { User } from "./User"

export interface RoomMetadata {
  id: string
  test: string
  state: RoomState
}

export type Room = RoomMetadata & {
  users: User[]
}

export type RoomState = 'waiting' | 'in-progress' | 'complete'