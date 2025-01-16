import { CursorColor, CursorPosition } from './Cursor'

export interface User {
	/** Unique identifier for the User. Matches their socket connection ID. */
	id: string
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
