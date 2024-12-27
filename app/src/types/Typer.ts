import { CursorPosition } from '$shared/types/Cursor'

export type WordRegionType = 'correct' | 'incorrect' | 'untyped' | 'extra'

export interface Word {
	/** Whether this word was typed and submitted correctly */
	correct: boolean
	/** Regions within the current word */
	regions: WordRegion[]
	/** Index of the first character of the word, based on text displayed to user */
	start: number
	/** Distance to word currently being typed. Positive if before, 0 if current, and negative if after. */
	distanceToCurrent: number
}

export interface WordRegion {
	/** Type for this region */
	type: WordRegionType
	/** Text within the region */
	text: string
}

interface Stats {
	/** Number of errors made while typing */
	errorsMade: number
	/** Number of errors still left in typed text */
	errorsLeft: number
	/** Number of correct keystrokes made while typing */
	correctMade: number
	/** Number of correct keystrokes left in typed text */
	correctLeft: number
	/** End time in ms since epoch */
	endTime: number
	/** Words per minute without accounting for errors. (Keystrokes / 5) / (Elapsed time in minutes) */
	rawWPM: number
	/** Words for minute, counting only correct keystrokes. (Correct keystrokes / 5) / (Elapsed time in minutes) */
	netWPM: number
	/** Percentage of correct keystrokes. (Correct keystrokes) / (Total keystrokes) */
	accuracy: number
	/** Current position of the user's cursor */
	cursorPosition: CursorPosition
}

export type PerWordStats = Stats & {
	aggregateRawWPM: number
	aggregateNetWPM: number
}

export type TyperStats = Stats & {
	perWordStats: PerWordStats[]
}
