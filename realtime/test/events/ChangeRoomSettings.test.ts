import ChangeRoomSettings from '@/events/ChangeRoomSettings'
import { createRoomForTesting, ioSpies, mockSocket, mockUser } from '../test-utils'
import state from '@/global/state'

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
		it('gives the correct error if no payload is given', () => {
			const callback = jest.fn()
			const { user } = createRoomForTesting().value!

			ChangeRoomSettings(
				mockSocket(user.id),
				// @ts-expect-error missing parameters on purpose
				null,
				callback
			)

			expect(callback).toHaveBeenCalledWith({
				error: { reason: 'missing-argument' },
				value: null
			})
		})

		it('gives the correct error if no userId is given', () => {
			const callback = jest.fn()
			const { user, room } = createRoomForTesting().value!

			ChangeRoomSettings(
				mockSocket(user.id),
				// @ts-expect-error missing parameters on purpose
				{ roomId: room.id, settings: { category: 'quote' } },
				callback
			)

			expect(callback).toHaveBeenCalledWith({
				error: { reason: 'invalid-user-id' },
				value: null
			})
		})

		it('gives the correct error if no roomId is given', () => {
			const callback = jest.fn()
			const { user } = createRoomForTesting().value!

			ChangeRoomSettings(
				mockSocket(user.id),
				// @ts-expect-error missing parameters on purpose
				{ userId: user.id, settings: { category: 'quote' } },
				callback
			)

			expect(callback).toHaveBeenCalledWith({
				error: { reason: 'missing-argument' },
				value: null
			})
		})

		it('gives the correct error if no settings are given', () => {
			const callback = jest.fn()
			const { user, room } = createRoomForTesting().value!

			ChangeRoomSettings(
				mockSocket(user.id),
				// @ts-expect-error missing parameters on purpose
				{ userId: user.id, roomId: room.id },
				callback
			)

			expect(callback).toHaveBeenCalledWith({
				error: { reason: 'missing-argument' },
				value: null
			})
		})

		it('gives the correct error if the user ID does not match the session ID', () => {
			const callback = jest.fn()
			const { user, room } = createRoomForTesting().value!

			ChangeRoomSettings(
				mockSocket(user.id),
				{ userId: 'INVALID_ID', roomId: room.id, settings: { category: 'quote' } },
				callback
			)

			expect(callback).toHaveBeenCalledWith({
				error: { reason: 'invalid-user-id' },
				value: null
			})
		})

		it('gives the correct error if the category is invalid', () => {
			const callback = jest.fn()
			const { user, room } = createRoomForTesting().value!

			ChangeRoomSettings(
				mockSocket(user.id),
				{
					userId: user.id,
					roomId: room.id,
					// @ts-expect-error intentionally invalid category
					settings: { category: 'INVALID_CATEGORY', numWords: 50, timeLimit: 150 }
				},
				callback
			)

			expect(callback).toHaveBeenCalledWith({
				error: { reason: 'invalid-settings' },
				value: null
			})
		})

		it('gives the correct error if the numWords is invalid', () => {
			const callback = jest.fn()
			const { user, room } = createRoomForTesting().value!

			ChangeRoomSettings(
				mockSocket(user.id),
				{
					userId: user.id,
					roomId: room.id,
					settings: { category: 'quote', numWords: -1, timeLimit: 150 }
				},
				callback
			)

			expect(callback).toHaveBeenCalledWith({
				error: { reason: 'invalid-settings' },
				value: null
			})
		})

		it('gives the correct error if the timeLimit is invalid', () => {
			const callback = jest.fn()
			const { user, room } = createRoomForTesting().value!

			ChangeRoomSettings(
				mockSocket(user.id),
				{
					userId: user.id,
					roomId: room.id,
					settings: { category: 'quote', numWords: 50, timeLimit: -1 }
				},
				callback
			)

			expect(callback).toHaveBeenCalledWith({
				error: { reason: 'invalid-settings' },
				value: null
			})
		})

		it('gives the correct error if the room does not exist', () => {
			const callback = jest.fn()
			const { user } = createRoomForTesting().value!

			ChangeRoomSettings(
				mockSocket(user.id),
				{
					userId: user.id,
					roomId: 'INVALID_ID',
					settings: { category: 'quote', numWords: 50, timeLimit: 150 }
				},
				callback
			)

			expect(callback).toHaveBeenCalledWith({
				error: { reason: 'room-does-not-exist' },
				value: null
			})
		})

		it('gives the correct error if the user is not the admin', () => {
			const callback = jest.fn()
			const { room } = createRoomForTesting().value!

			state.addUserToRoom(room.id, mockUser({ id: 'userB' }))

			ChangeRoomSettings(
				mockSocket('userB'),
				{
					userId: 'userB',
					roomId: room.id,
					settings: { category: 'quote', numWords: 50, timeLimit: 150 }
				},
				callback
			)

			expect(callback).toHaveBeenCalledWith({
				error: { reason: 'user-not-admin' },
				value: null
			})
		})

		it('gives the correct error if the room has a game in progress', () => {
			const callback = jest.fn()
			const { user, room } = createRoomForTesting().value!

			state.updateRoom(room.id, { state: 'in-progress' })

			ChangeRoomSettings(
				mockSocket(user.id),
				{
					userId: user.id,
					roomId: room.id,
					settings: { category: 'quote', numWords: 50, timeLimit: 150 }
				},
				callback
			)

			expect(callback).toHaveBeenCalledWith({
				error: { reason: 'game-in-progress' },
				value: null
			})
		})
	})

	it('updates the room settings in the state', () => {
		const { user, room } = createRoomForTesting().value!
		const settingsUpdate = { category: 'quote', numWords: 50 } as const

		ChangeRoomSettings(
			mockSocket(user.id),
			{ userId: user.id, roomId: room.id, settings: settingsUpdate },
			() => {}
		)

		expect(state.getRoom(room.id)?.settings).toEqual({
			...room.settings,
			...settingsUpdate
		})
	})

	it('emits a change room data event to all users in the room', () => {
		const { user, room } = createRoomForTesting().value!
		const settingsUpdate = { category: 'quote', numWords: 50 } as const

		const { inSpy, emitSpy } = ioSpies()

		ChangeRoomSettings(
			mockSocket(user.id),
			{ userId: user.id, roomId: room.id, settings: settingsUpdate },
			() => {}
		)

		expect(inSpy).toHaveBeenCalledWith(room.id)
		expect(emitSpy).toHaveBeenCalledWith('change-room-data', {
			settings: {
				...room.settings,
				...settingsUpdate
			}
		})
	})

	it('calls the callback', () => {
		const callback = jest.fn()
		const { user, room } = createRoomForTesting().value!
		const settingsUpdate = { category: 'quote', numWords: 50 } as const

		ChangeRoomSettings(
			mockSocket(user.id),
			{ userId: user.id, roomId: room.id, settings: settingsUpdate },
			callback
		)

		expect(callback).toHaveBeenCalledWith({
			value: null,
			error: null
		})
	})
})
