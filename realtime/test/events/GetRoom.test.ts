import GetRoom from '@/events/GetRoom'
import { createRoomForTesting } from '../test-utils'

describe('GetRoom', () => {
	it('runs without failing if callback not provided', () => {
		// @ts-expect-error missing parameters on purpose
		GetRoom(null, null)
		expect(true).toBe(true)
	})

	it('gives the correct error if no room ID was provided', () => {
		const callback = jest.fn()
		// @ts-expect-error missing parameters on purpose
		GetRoom(null, callback)

		expect(callback).toHaveBeenCalledWith({
			value: null,
			error: {
				reason: 'missing-argument'
			}
		})
	})

	it('calls callback with the room if the room exists', () => {
		const { room } = createRoomForTesting().value!
		const callback = jest.fn()

		GetRoom(room.id, callback)

		expect(callback).toHaveBeenCalledWith({
			value: room,
			error: null
		})
	})

	it('calls callback with null if the room does not exist', () => {
		createRoomForTesting()
		const callback = jest.fn()

		GetRoom('INVALID_ID', callback)

		expect(callback).toHaveBeenCalledWith({
			value: null,
			error: null
		})
	})
})
