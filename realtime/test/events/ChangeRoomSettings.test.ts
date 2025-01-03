import ChangeRoomSettings from '@/events/ChangeRoomSettings'
import { createRoomForTesting, mockSocket } from '../test-utils'

describe('ChangeRoomSettings', () => {
	it('runs without failing if callback not provided', () => {
		const { user, room } = createRoomForTesting().value!

		ChangeRoomSettings(
			mockSocket(),
			{ userId: user.id, roomId: room.id, settings: room.settings },
			// @ts-expect-error missing parameters on purpose
			null
		)
		expect(true).toBe(true)
	})

	describe('errors', () => {
		it.todo('gives the correct error if no payload is given')

		it.todo('gives the correct error if no userId is given')

		it.todo('gives the correct error if no roomId is given')

		it.todo('gives the correct error if no settings are given')

		it.todo('gives the correct error if the user ID does not match the session ID')

		it.todo('gives the correct error if the category is invalid')

		it.todo('gives the correct error if the numWords is invalid')

		it.todo('gives the correct error if the timeLimit is invalid')

		it.todo('gives the correct error if the user is not the admin')

		it.todo('gives the correct error if the room has a game in progress')
	})

	it.todo('updates the room settings in the state')

	it.todo('emits a change room data event to all users in the room')
})
