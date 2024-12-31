import { User } from './User'

export interface RoomMetadata {
	id: string
	admin: User['id']
	test?: string
	state: RoomState
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
	category: 'top-100' | 'top-1000' | 'quote'
	/** Number of words to generate for each test. */
	numWords: number
	/** Maximum time allowed for each test. */
	timeLimit: number
}
