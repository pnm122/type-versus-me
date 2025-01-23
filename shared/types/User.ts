import { CursorColor, CursorPosition } from './Cursor'

export interface User {
	/** Socket connection ID. */
	socketId: string
	/** User ID from database. Only exists if the user has an account. */
	userId?: string
	/** User's displayed username. Must be unique for the room they are in. */
	username: string
	/** User's displayed color. Must be unique for the room they are in. */
	color: CursorColor
	/** User's current score. Only meaningful if the room state is `in-progress`. */
	score?: TestScore
	/** User's score from the last game they played in the room. */
	lastScore?: LastTestScore
	/** State the user is in. Only a subset of states are valid given the room state. */
	state?: UserState
}

export interface LastTestScore {
	netWPM: number
	accuracy: number
	failed: boolean
}

export interface TestScore {
	cursorPosition: CursorPosition
	netWPM: number
	accuracy: number
}

export type UserState = 'not-ready' | 'ready' | 'in-progress' | 'complete' | 'failed'
