import { User, UserState } from './types/User'
import CursorColors from './utils/CursorColors'

export const MAX_ROOMS = 8 as const
export const MAX_USERS_PER_ROOM = CursorColors.length
export const INITIAL_USER_STATE: UserState = 'not-ready' as const
export const INITIAL_USER_SCORE: Required<User>['score'] = {
	cursorPosition: {
		word: 0,
		letter: 0
	},
	netWPM: 0
} as const

export const MIN_TEST_WORDS = 10
export const MAX_TEST_WORDS = 150
export const MIN_TEST_TIME = 5
export const MAX_TEST_TIME = 600
