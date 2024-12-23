import { ErrorReason, Return } from '$shared/types/Return'
import { User } from '$shared/types/User'
import { INITIAL_USER_SCORE } from '$shared/constants'
import state from '@/global/state'
import CustomSocket from '@/types/CustomSocket'
import debug, { DEBUG_COLORS } from './debug'
import generateTest from './generateTest'
import io from '@/global/server'

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
>(socket: CustomSocket, callback: Callback, userId: User['id'], ...expectedValues: any[]) {
	if (typeof callback !== 'function') return false

	const anyFailed =
		expectedValues.findIndex((value) => {
			return check(value === null || value === undefined, 'missing-argument', callback)
		}) !== -1

	if (anyFailed) return false

	if (check(socket.id !== userId, 'invalid-user-id', callback)) {
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
 *  1. Sets the room state to in-progress in the state
 *  2. Emits an event to the clients to set the room state to in-progress
 *  3. Sets every user in the room's score to 0's and their state to in-progress
 *  4. Emits an event to the clients to update every user accordingly
 */
export function setRoomToInProgress(roomId: string) {
	state.updateRoom(roomId, { state: 'in-progress', test: generateTest() })
	io.in(roomId).emit('change-room-data', { state: 'in-progress', test: generateTest() })

	state.getRoom(roomId)!.users.forEach((u) => {
		state.updateUser(u.id, { score: INITIAL_USER_SCORE, state: 'in-progress' })
	})
	io.in(roomId).emit('change-all-user-data', { score: INITIAL_USER_SCORE, state: 'in-progress' })
}
