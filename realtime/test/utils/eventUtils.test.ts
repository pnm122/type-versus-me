import CustomSocket from '@/types/CustomSocket'
import {
	check,
	isValidEventAndPayload,
	saveScoresToDatabase,
	setRoomToInProgress
} from '@/utils/eventUtils'
import { createRoomForTesting, ioSpies, mockSocket, mockUser } from '../test-utils'
import state from '@/global/state'
import { INITIAL_USER_SCORE } from '$shared/constants'
import io from '@/global/server'
import { createRace } from '$shared/utils/database/race'
import * as databaseScoreUtils from '$shared/utils/database/score'

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

describe('saveScoresToDatabase', () => {
	const user1Score = {
		netWPM: 150,
		accuracy: 1,
		failed: true
	}
	const user2Score = {
		netWPM: 120,
		accuracy: 0.95,
		failed: false
	}
	const user3Score = {
		netWPM: 100,
		accuracy: 0.97,
		failed: false
	}
	const user4Score = {
		netWPM: 90,
		accuracy: 0.99,
		failed: false
	}
	const raceId = 1

	function init() {
		const spy = jest.spyOn(databaseScoreUtils, 'createScores').mockImplementation()
		const { room } = createRoomForTesting(
			mockUser({ userId: 'user1', socketId: 'userA' }),
			mockSocket('userA')
		).value!
		state.updateRoom(room.id, { raceId })
		state.updateUser('userA', {
			lastScore: user1Score
		})
		state.addUserToRoom(
			room.id,
			mockUser({
				userId: 'user2',
				socketId: 'userB',
				lastScore: user2Score
			})
		)
		state.addUserToRoom(
			room.id,
			mockUser({
				userId: 'user3',
				socketId: 'userC',
				lastScore: user3Score
			})
		)
		state.addUserToRoom(
			room.id,
			mockUser({
				socketId: 'userD',
				lastScore: user4Score
			})
		)
		return { room, spy }
	}

	it('creates scores with -1 accuracy and WPM, false isWinner, and failed=true for users that failed the test', async () => {
		const { room, spy } = init()
		await saveScoresToDatabase(room.id)

		expect(spy).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					accuracy: -1,
					netWPM: -1,
					failed: true,
					isWinner: false,
					raceId,
					userId: 'user1'
				})
			])
		)
	})

	it('creates scores with the correct data when not failed', async () => {
		const { room, spy } = init()
		await saveScoresToDatabase(room.id)

		expect(spy).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					accuracy: user2Score.accuracy,
					netWPM: user2Score.netWPM,
					failed: false,
					raceId,
					userId: 'user2'
				}),
				expect.objectContaining({
					accuracy: user3Score.accuracy,
					netWPM: user3Score.netWPM,
					failed: false,
					raceId,
					userId: 'user3'
				})
			])
		)
	})

	it('does not create scores for users that do not have a userId', async () => {
		const { room, spy } = init()
		await saveScoresToDatabase(room.id)

		expect(spy).not.toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					userId: 'user4'
				})
			])
		)
	})

	it('sets the correct winner', async () => {
		const { room, spy } = init()
		await saveScoresToDatabase(room.id)

		expect(spy).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					isWinner: true,
					userId: 'user2'
				})
			])
		)
	})

	it('sets isWinner to false if the user fails and is the only use in the room', async () => {
		const spy = jest.spyOn(databaseScoreUtils, 'createScores').mockImplementation()
		const { room } = createRoomForTesting(
			mockUser({ userId: 'user1', socketId: 'userA' }),
			mockSocket('userA')
		).value!

		state.updateRoom(room.id, { raceId })
		state.updateUser('userA', {
			lastScore: user1Score
		})

		await saveScoresToDatabase(room.id)

		expect(spy).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					isWinner: false,
					failed: true,
					userId: 'user1'
				})
			])
		)
	})
})
