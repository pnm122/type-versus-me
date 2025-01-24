import { ErrorReason, Return } from '$shared/types/Return'
import { User } from '$shared/types/User'
import { INITIAL_USER_SCORE } from '$shared/constants'
import state from '@/global/state'
import CustomSocket from '@/types/CustomSocket'
import debug, { DEBUG_COLORS } from './debug'
import generateTest from './generateTest'
import io from '@/global/server'
import { Room } from '$shared/types/Room'
import { createRace } from '$shared/utils/database/race'
import getPointsFromScore from '$shared/utils/getPointsFromScore'
import { createScores } from '$shared/utils/database/score'

/**
 * Check if an event with a payload is valid, returning appropriate errors through the callback if found.
 * The event is valid iff:
 *  1. callback is a function
 *  2. all expected values are non-null
 *  3. The user ID matches the socket ID
 * @returns true if valid, false if not
 */
export function isValidEventAndPayload<
	Callback extends (value: Return<any, 'missing-argument' | 'invalid-user-id'>) => void
>(socket: CustomSocket, callback: Callback, socketId: User['socketId'], ...expectedValues: any[]) {
	if (typeof callback !== 'function') return false

	const anyFailed =
		expectedValues.findIndex((value) => {
			return check(value === null || value === undefined, 'missing-argument', callback)
		}) !== -1

	if (anyFailed) return false

	if (check(socket.id !== socketId, 'invalid-user-id', callback)) {
		return false
	}

	return true
}

/**
 * Check if a condition is met, calling the callback with the given error reason if condition is met.
 * @param condition Error condition to check truthiness of
 * @param errorReason Reason for error if condition is met
 * @param callback Function to call if the condition is met
 * @returns whether or not the condition is met
 */
export function check<
	Reason extends ErrorReason,
	Callback extends (value: Return<any, Reason>) => void
>(condition: any, errorReason: Reason, callback: Callback) {
	if (condition) {
		debug(`${DEBUG_COLORS.RED}error:`, errorReason, DEBUG_COLORS.WHITE)
		callback({
			value: null,
			error: {
				reason: errorReason
			}
		})
		return true
	}

	return false
}

/**
 * Set a room to in-progress. Does the following:
 *  1. Creates a test based on the room settings
 *  2. Creates a race in the database & if successful:
 *  3. Updates the state with the new room data
 *  4. Emits an event to the clients with the new room data
 *  5. Sets every user in the room's score to 0's and their state to in-progress
 *  6. Emits an event to the clients to update every user accordingly
 * @returns error if present
 */
export async function setRoomToInProgress(room: Room) {
	const test = await generateTest(room.settings)
	const { data: race, error } = await createRace({
		// Technically not exactly when the race actually starts in the UI, but good enough
		startTime: new Date(),
		...room.settings
	})

	if (error || !race) {
		return error
	}

	state.updateRoom(room.id, { state: 'in-progress', test, raceId: race.id })
	io.in(room.id).emit('change-room-data', { state: 'in-progress', test, raceId: race.id })

	state.getRoom(room.id)!.users.forEach((u) => {
		state.updateUser(u.socketId, { score: INITIAL_USER_SCORE, state: 'in-progress' })
	})
	io.in(room.id).emit('change-all-user-data', { score: INITIAL_USER_SCORE, state: 'in-progress' })

	return null
}

/** Adds all users' `lastScore`s to the database, and calculates and adds the points earned from the score to the user */
export async function saveScoresToDatabase(roomId: Room['id']) {
	const newScores = state
		.getRoom(roomId)!
		.users.filter((u) => u.userId)
		.map(({ lastScore, userId }, _, users) => ({
			accuracy: lastScore!.failed ? -1 : lastScore!.accuracy,
			netWPM: lastScore!.failed ? -1 : lastScore!.netWPM,
			isWinner: lastScore!.failed
				? false
				: users
						.filter((u) => !u.lastScore?.failed)
						.sort((a, b) => b.lastScore!.netWPM - a.lastScore!.netWPM)
						.at(0)?.userId === userId,
			raceId: state.getRoom(roomId)!.raceId!,
			userId: userId!
		}))
		.map((s) => ({
			...s,
			points: getPointsFromScore({
				netWPM: s.netWPM,
				accuracy: s.accuracy,
				isWinner: s.isWinner,
				numWords: state.getRoom(roomId)!.settings.numWords,
				numUsers: state.getRoom(roomId)!.users.length
			})
		}))

	await createScores(newScores)
}
