import { createRoomForTesting, ioSpies, mockSocket, mockUser } from '../test-utils'
import RequestColor from '@/events/RequestColor'
import state from '@/global/state'

const socket = mockSocket()

describe('RequestColor', () => {
	it('runs without failing if callback not provided', () => {
		// @ts-expect-error missing parameters on purpose
		RequestColor(socket, null, null)
		expect(true).toBe(true)
	})

	describe('errors', () => {
		it('gives the correct error if the user ID does not match the session ID', () => {
			const callback = jest.fn()
			const { user } = createRoomForTesting(mockUser()).value!

			RequestColor(mockSocket('INVALID_ID'), { socketId: user.socketId, color: 'red' }, callback)

			expect(callback).toHaveBeenCalledWith({
				value: null,
				error: {
					reason: 'invalid-user-id'
				}
			})
		})

		it('gives the correct error if the user is not in a room', () => {
			const callback = jest.fn()
			RequestColor(socket, { socketId: 'test', color: 'red' }, callback)

			expect(callback).toHaveBeenCalledWith({
				value: null,
				error: {
					reason: 'user-not-in-room'
				}
			})
		})

		it('gives the correct error if the provided color is invalid', () => {
			const callback = jest.fn()
			const { user } = createRoomForTesting(mockUser()).value!
			// @ts-expect-error missing parameters on purpose
			RequestColor(socket, { socketId: user.socketId, color: 'INVALID_COLOR' }, callback)

			expect(callback).toHaveBeenCalledWith({
				value: null,
				error: {
					reason: 'invalid-color'
				}
			})
		})
	})

	it('calls the callback with the provided color', () => {
		const callback = jest.fn()
		const { user } = createRoomForTesting(mockUser({ color: 'red' })).value!

		RequestColor(socket, { socketId: user.socketId, color: 'blue' }, callback)

		expect(callback).toHaveBeenCalledWith({
			value: {
				color: 'blue'
			},
			error: null
		})
	})

	it('tells all other users in the room that the color has changed', () => {
		const { inSpy, emitSpy } = ioSpies()
		const socket = mockSocket()
		const { user, room } = createRoomForTesting(mockUser({ color: 'red' })).value!

		RequestColor(socket, { socketId: user.socketId, color: 'blue' }, () => {})

		expect(inSpy).toHaveBeenCalledWith(room.id)
		expect(emitSpy).toHaveBeenCalledWith('change-user-data', {
			socketId: user.socketId,
			color: 'blue'
		})
	})

	it('allows multiple users to have the same color', () => {
		const callback = jest.fn()
		const { user, room } = createRoomForTesting(mockUser({ color: 'red' })).value!
		state.addUserToRoom(room.id, mockUser({ socketId: 'userB', color: 'green' }))

		RequestColor(socket, { socketId: user.socketId, color: 'red' }, callback)

		expect(callback).toHaveBeenCalledWith(
			expect.objectContaining({
				error: null
			})
		)
	})
})
