import CustomSocket from '@/types/CustomSocket'
import { check, isValidEventAndPayload, setRoomToInProgress } from '@/utils/eventUtils'
import { createRoomForTesting, ioSpies, mockUser } from '../test-utils'
import state from '@/global/state'
import { INITIAL_USER_SCORE } from '$shared/constants'
import io from '@/global/server'
import { createRace } from '$shared/utils/database/race'

const socket = {
	id: 'TEST_ID'
} as CustomSocket

describe('isValidEventAndPayload', () => {
	it('returns false if no callback is provided', () => {
		expect(
			// @ts-expect-error missing parameters on purpose
			isValidEventAndPayload(socket, undefined, socket.id)
		).toBeFalsy()
	})

	it('returns false if an expected value is falsy', () => {
		expect(isValidEventAndPayload(socket, () => {}, socket.id, 'test', null)).toBeFalsy()
	})

	it('returns false if the socket ID does not match the user ID', () => {
		expect(isValidEventAndPayload(socket, () => {}, 'wrong ID', 'test 1', 'test 2')).toBeFalsy()
	})

	it('returns true if socket ID === user ID, callback is valid, and expected values are truthy', () => {
		expect(isValidEventAndPayload(socket, () => {}, socket.id, 'test 1', 'test 2')).toBeTruthy()
	})
})

describe('check', () => {
	it('calls callback with the correct format and reason if the condition is truthy', () => {
		const callback = jest.fn()
		check(true, 'reason', callback)
		expect(callback).toHaveBeenLastCalledWith({
			value: null,
			error: {
				reason: 'reason'
			}
		})
	})

	it('does not call callback if the condition is falsy', () => {
		const callback = jest.fn()
		check(false, 'reason', callback)
		expect(callback).not.toHaveBeenCalled()
	})

	it('returns true if the condition is truthy', () => {
		expect(check('test', '', () => {})).toBeTruthy()
	})

	it('returns false if the condition is falsy', () => {
		expect(check(null, '', () => {})).toBeFalsy()
	})
})

describe('setRoomToInProgress', () => {
	function init() {
		const { room } = createRoomForTesting().value!
		state.addUserToRoom(room.id, mockUser({ socketId: 'userB' }))

		return { room }
	}

	it('sets the room state to in-progress in the state', async () => {
		const { room } = init()

		await setRoomToInProgress(room)

		expect(state.getRoom(room.id)!.state).toBe('in-progress')
	})

	it('emits a change room event with the in-progress state, new test, and race ID to all users in the room', async () => {
		const { room } = init()
		const { inSpy, emitSpy } = ioSpies()

		await setRoomToInProgress(room)

		expect(inSpy).toHaveBeenCalledWith(room.id)
		expect(emitSpy).toHaveBeenCalledWith('change-room-data', {
			state: 'in-progress',
			test: expect.any(String),
			// @ts-expect-error doesn't need an argument since this is mocked
			raceId: (await createRace()).data.id
		})
	})

	it('sets all user scores to 0 and states to in-progress in the state', async () => {
		const { room } = init()

		await setRoomToInProgress(room)

		const allUsersSetCorrectly = state
			.getRoom(room.id)!
			.users.every(
				(u) =>
					u.state === 'in-progress' &&
					u.score?.cursorPosition.letter === 0 &&
					u.score.cursorPosition.word === 0 &&
					u.score.netWPM === 0
			)
		expect(allUsersSetCorrectly).toBeTruthy()
	})

	it('emits a change all users event with the new state and score to all users in the room', async () => {
		const { room } = init()
		const emitSpy = jest.fn()
		const inSpy = jest.spyOn(io, 'in').mockReturnValue({ emit: emitSpy } as any)

		await setRoomToInProgress(room)

		expect(inSpy).toHaveBeenCalledWith(room.id)
		expect(emitSpy).toHaveBeenCalledWith('change-all-user-data', {
			state: 'in-progress',
			score: INITIAL_USER_SCORE
		})
	})

	it('creates a race in the database', async () => {
		const { room } = init()
		await setRoomToInProgress(room)
		expect(createRace).toHaveBeenCalledWith(
			expect.objectContaining({
				...room.settings
			})
		)
	})
})
