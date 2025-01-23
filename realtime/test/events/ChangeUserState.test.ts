import ChangeUserState from '@/events/ChangeUserState'
import { createRoomForTesting, ioSpies, mockSocket, mockUser } from '../test-utils'
import { UserState } from '$shared/types/User'
import { RoomState } from '$shared/types/Room'
import state from '@/global/state'
import { INITIAL_USER_SCORE } from '$shared/constants'
import * as eventUtils from '@/utils/eventUtils'

describe('ChangeUserState', () => {
	it('runs without failing if callback not provided', async () => {
		const socket = mockSocket()
		// @ts-expect-error missing parameters on purpose
		await ChangeUserState(socket, null, null)
		expect(true).toBe(true)
	})

	describe('errors', () => {
		it('gives the correct error if the user ID does not match the session ID', async () => {
			const callback = jest.fn()
			const { user } = createRoomForTesting().value!

			await ChangeUserState(
				mockSocket('userA'),
				mockUser({ id: user.id, state: 'in-progress' }),
				callback
			)

			expect(callback).toHaveBeenCalledWith({
				value: null,
				error: {
					reason: 'invalid-user-id'
				}
			})
		})

		it('gives the correct error if the state is not provided', async () => {
			const callback = jest.fn()
			// @ts-expect-error missing parameters on purpose
			await ChangeUserState(mockSocket('test'), { id: 'test' }, callback)

			expect(callback).toHaveBeenCalledWith({
				value: null,
				error: {
					reason: 'missing-argument'
				}
			})
		})

		it('gives the correct error if the user is not in a room', async () => {
			const callback = jest.fn()
			await ChangeUserState(mockSocket('test'), { id: 'test', state: 'ready' }, callback)

			expect(callback).toHaveBeenCalledWith({
				value: null,
				error: {
					reason: 'user-not-in-room'
				}
			})
		})

		describe('requested state is not possible given the room state', () => {
			const invalidStates: { [key in RoomState]: UserState[] } = {
				complete: ['in-progress', 'complete', 'failed'],
				'in-progress': ['not-ready', 'ready'],
				waiting: ['in-progress', 'complete', 'failed']
			}

			Object.keys(invalidStates).forEach((roomState) => {
				invalidStates[roomState as RoomState].forEach((userState) => {
					it(`gives the correct error when requesting ${userState} and the room state is ${roomState}`, async () => {
						const { user, room } = createRoomForTesting().value!
						state.updateRoom(room.id, { state: roomState as RoomState })

						const callback = jest.fn()
						await ChangeUserState(mockSocket(user.id), { id: user.id, state: userState }, callback)

						expect(callback).toHaveBeenCalledWith({
							value: null,
							error: {
								reason: 'invalid-state'
							}
						})
					})
				})
			})
		})
	})

	it('changes the user state in the state', async () => {
		const { user, room } = createRoomForTesting().value!
		// Make sure that not all users will be in the ready state
		state.addUserToRoom(room.id, mockUser({ id: 'ADDITIONAL_USER' }))

		await ChangeUserState(mockSocket(user.id), { id: user.id, state: 'ready' }, async () => {})

		expect(state.getRoom(room.id)!.users[0]!.state).toBe('ready')
	})

	it('emits an event to all other users in the room to change the user state', async () => {
		const { inSpy, emitSpy } = ioSpies()
		const { user, room } = createRoomForTesting().value!
		const socket = mockSocket()

		await ChangeUserState(socket, { id: user.id, state: 'ready' }, async () => {})

		expect(inSpy).toHaveBeenCalledWith(room.id)
		expect(emitSpy).toHaveBeenCalledWith('change-user-data', { id: user.id, state: 'ready' })
	})

	it('sets the room to in progress if all users will be in the ready state', async () => {
		const spy = jest.spyOn(eventUtils, 'setRoomToInProgress')
		const { room, user } = createRoomForTesting().value!
		const socket = mockSocket(user.id)

		await ChangeUserState(socket, { id: user.id, state: 'ready' }, async () => {})

		expect(spy).toHaveBeenCalledWith(room)
	})

	describe('the user is changing state to complete or failed', () => {
		async function init(failed = false) {
			const score = { netWPM: 85, accuracy: 0.95, cursorPosition: { word: 50, letter: 5 } }
			const { room, user } = createRoomForTesting(
				mockUser({ id: 'userA' }),
				mockSocket('userA')
			).value!
			state.updateRoom(room.id, { state: 'in-progress' })
			state.updateUser(user.id, { state: 'in-progress', score: score })
			await ChangeUserState(
				mockSocket('userA'),
				{ id: 'userA', state: failed ? 'failed' : 'complete' },
				async () => {}
			)
			return { score, room, user }
		}

		it('updates the user last score to their last recorded score in the state when changing to complete', async () => {
			const { score, room, user } = await init()
			expect(state.getUserInRoom(room.id, user.id)).toMatchObject({
				lastScore: {
					netWPM: score.netWPM,
					accuracy: score.accuracy,
					failed: false
				}
			})
		})

		it('emits their last recorded score in the state to all users when changing to complete', async () => {
			const { inSpy, emitSpy } = ioSpies()
			const { score, room } = await init()
			expect(inSpy).toHaveBeenCalledWith(room.id)

			// One of the calls should have change-user-data w/ an object matching the lastScore provided below
			const hasMatchingCall = emitSpy.mock.calls.some(
				(call) =>
					call[0] === 'change-user-data' &&
					expect
						.objectContaining({
							lastScore: {
								netWPM: score.netWPM,
								accuracy: score.accuracy,
								failed: false
							}
						})
						.asymmetricMatch(call[1])
			)

			expect(hasMatchingCall).toBeTruthy()
		})

		it('updates the user last score to their last recorded score in the state when changing to failed', async () => {
			const { score, room, user } = await init(true)
			expect(state.getUserInRoom(room.id, user.id)).toMatchObject({
				lastScore: {
					netWPM: score.netWPM,
					accuracy: score.accuracy,
					failed: true
				}
			})
		})
	})

	describe('all users will be in the complete or failed state and the room state is in-progress', () => {
		async function init(socket = mockSocket('userB')) {
			const { room, user } = createRoomForTesting(
				mockUser({ id: 'userA' }),
				mockSocket('userA')
			).value!
			state.updateRoom(room.id, { state: 'in-progress' })
			state.updateUser(user.id, { state: 'failed', score: INITIAL_USER_SCORE })
			state.addUserToRoom(
				room.id,
				mockUser({ id: socket.id, state: 'in-progress', score: INITIAL_USER_SCORE })
			)

			await ChangeUserState(socket, { id: socket.id, state: 'complete' }, async () => {})

			return { room }
		}

		it('sets the room state to complete', async () => {
			const { room } = await init()

			expect(state.getRoom(room.id)!.state).toBe('complete')
		})

		it('emits a change room event with the complete state to all users in the room', async () => {
			const socket = mockSocket('userB')
			const { inSpy, emitSpy } = ioSpies()
			const { room } = await init(socket)

			expect(inSpy).toHaveBeenCalledWith(room.id)
			expect(emitSpy).toHaveBeenCalledWith('change-room-data', { state: 'complete' })
		})

		it('updates all user scores and states in the state', async () => {
			const { room } = await init()

			state.getRoom(room.id)!.users.forEach((u) => {
				expect(u.score).toBe(INITIAL_USER_SCORE)
				expect(u.state).toBe('not-ready')
			})
		})

		it('emits a change all user data event with the not-ready state and initial score to all users in the room', async () => {
			const socket = mockSocket('userB')
			const { inSpy, emitSpy } = ioSpies()
			const { room } = await init(socket)

			expect(inSpy).toHaveBeenCalledWith(room.id)
			expect(emitSpy).toHaveBeenCalledWith('change-all-user-data', {
				state: 'not-ready',
				score: INITIAL_USER_SCORE
			})
		})
	})

	it('calls the callback with the new state', async () => {
		const callback = jest.fn()
		const socket = mockSocket()

		const { user } = createRoomForTesting().value!
		await ChangeUserState(socket, { id: user.id, state: 'ready' }, callback)

		expect(callback).toHaveBeenLastCalledWith({
			value: { state: 'ready' },
			error: null
		})
	})
})
