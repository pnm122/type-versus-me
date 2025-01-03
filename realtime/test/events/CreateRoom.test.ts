import { User } from '$shared/types/User'
import { INITIAL_USER_SCORE, INITIAL_USER_STATE, MAX_ROOMS } from '$shared/constants'
import CreateRoom from '@/events/CreateRoom'
import state from '@/global/state'
import { mockSocket, mockUser } from '../test-utils'
import { RoomSettings } from '$shared/types/Room'
import { CreateRoomPayload } from '$shared/types/events/client/CreateRoom'

const socket = mockSocket()

function mockPayload(user?: Partial<User>, settings?: Partial<RoomSettings>): CreateRoomPayload {
	return {
		user: mockUser(user),
		settings: { category: 'top-100', numWords: 40, timeLimit: 120, ...settings }
	}
}

describe('CreateRoom', () => {
	it('runs without failing if callback not provided', () => {
		// @ts-expect-error missing parameters on purpose
		CreateRoom(socket, null, null)
		expect(true).toBe(true)
	})

	describe('errors', () => {
		it('gives the correct error if the user ID does not match the session ID', () => {
			const callback = jest.fn()
			CreateRoom(mockSocket('userA'), mockPayload({ id: 'userB' }), callback)

			expect(callback).toHaveBeenCalledWith({
				value: null,
				error: {
					reason: 'invalid-user-id'
				}
			})
		})

		it('gives the correct error when no value is passed', () => {
			const callback = jest.fn()

			// @ts-expect-error missing parameters on purpose
			CreateRoom(socket, null, callback)

			expect(callback).toHaveBeenCalledWith({
				value: null,
				error: {
					reason: 'missing-argument'
				}
			})
		})

		it('gives the correct error when no user is passed', () => {
			const callback = jest.fn()

			// @ts-expect-error missing parameters on purpose
			CreateRoom(socket, { settings: mockPayload().settings }, callback)

			expect(callback).toHaveBeenCalledWith({
				value: null,
				error: {
					reason: 'missing-argument'
				}
			})
		})

		it('gives the correct error when no settings are passed', () => {
			const callback = jest.fn()

			// @ts-expect-error missing parameters on purpose
			CreateRoom(socket, { user: mockPayload().user }, callback)

			expect(callback).toHaveBeenCalledWith({
				value: null,
				error: {
					reason: 'missing-argument'
				}
			})
		})

		it('gives the correct error when the username is invalid', () => {
			const callback = jest.fn()

			CreateRoom(socket, mockPayload({ username: '' }), callback)

			expect(callback).toHaveBeenCalledWith({
				value: null,
				error: {
					reason: 'invalid-username'
				}
			})
		})

		it('gives the correct error when the color is invalid', () => {
			const callback = jest.fn()

			// @ts-expect-error Invalid color
			CreateRoom(socket, mockPayload({ color: 'invalid' }), callback)

			expect(callback).toHaveBeenCalledWith({
				value: null,
				error: {
					reason: 'invalid-color'
				}
			})
		})

		it('gives the correct error when the user is already in a room', () => {
			const callback = jest.fn()

			state.createRoom(mockPayload().user, mockPayload().settings)

			CreateRoom(socket, mockPayload(), callback)

			expect(callback).toHaveBeenCalledWith({
				value: null,
				error: {
					reason: 'user-in-room-already'
				}
			})
		})

		it('gives the correct error when the maximum number of rooms have been created', () => {
			const callback = jest.fn()

			new Array(MAX_ROOMS).fill(null).forEach((_, index) => {
				state.createRoom(mockPayload({ id: `user${index}` }).user, mockPayload().settings)
			})

			CreateRoom(mockSocket('newUser'), mockPayload({ id: 'newUser' }), callback)

			expect(callback).toHaveBeenCalledWith({
				value: null,
				error: {
					reason: 'max-rooms-created'
				}
			})
		})
	})

	describe('on success', () => {
		it('adds a room to the state with the correct user', () => {
			CreateRoom(socket, mockPayload(), () => {})

			expect(state.getRooms()).toHaveLength(1)
			expect(state.getRooms()[0]!.users[0]).toEqual({
				...mockPayload().user,
				state: INITIAL_USER_STATE,
				score: INITIAL_USER_SCORE
			})
		})

		it('calls callback with the correct user and room', () => {
			const callback = jest.fn()
			CreateRoom(socket, mockPayload(), callback)

			expect(callback).toHaveBeenCalledWith({
				value: {
					room: state.getRooms()[0],
					user: {
						...mockPayload().user,
						state: INITIAL_USER_STATE,
						score: INITIAL_USER_SCORE
					}
				},
				error: null
			})
		})

		it('adds the socket to the correct room', () => {
			const socket = mockSocket()
			CreateRoom(socket, mockPayload(), () => {})

			expect(socket.join).toHaveBeenCalledWith(state.getRooms()[0]!.id)
		})

		it('makes the creator the admin', () => {
			const payload = mockPayload()

			CreateRoom(mockSocket(), payload, () => {})

			expect(state.getRooms()[0]?.admin).toBe(payload.user.id)
		})
	})
})
