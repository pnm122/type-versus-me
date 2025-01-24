import { User } from './User'

export interface RoomMetadata {
	/** Unique identifier for the room */
	id: string
	/** Unique identifier for the current race. Only exists if the room state is "in-progress" */
	raceId?: number
	/** Socket ID of the room admin. Admins are the only user that can edit room settings. The initial admin is the user who created the room, with subsequent reassignments only occurring if this user leaves the room. Admins are selected by first to join the room. */
	admin: User['socketId']
	/** Text for the current race. Only relevant if the room state is "in-progress" */
	test?: string
	/** Current state of the room */
	state: RoomState
	/** Settings for the room */
	settings: RoomSettings
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

export interface RoomSettings {
	/** Category for tests given. **'top-100'**: Choose randomly from the 100 most common English words. **'top-1000'**: Choose randomly from the top 1000 most common English words. **'quote'**: Pick quotes at random from books. */
	category: (typeof roomCategories)[number]
	/** Number of words to generate for each test. */
	numWords: number
	/** Maximum time allowed for each test. */
	timeLimit: number
}

export const roomCategories = ['top-100', 'top-1000', 'quote'] as const
