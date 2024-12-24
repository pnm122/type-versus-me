import { User, UserState } from './types/User'
import CursorColors from './utils/CursorColors'

const MAX_ROOMS = 8 as const
const MAX_USERS_PER_ROOM = CursorColors.length
const INITIAL_USER_STATE: UserState = 'not-ready' as const
const INITIAL_USER_SCORE: Required<User>['score'] = {
	cursorPosition: {
		word: 0,
		letter: 0
	},
	netWPM: 0
} as const

export { MAX_ROOMS, MAX_USERS_PER_ROOM, INITIAL_USER_STATE, INITIAL_USER_SCORE }
