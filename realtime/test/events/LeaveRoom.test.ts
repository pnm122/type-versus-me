import LeaveRoom from '@/events/LeaveRoom'
import { createRoomForTesting, ioSpies, mockSocket, mockUser } from '../test-utils'
import * as eventUtils from '@/utils/eventUtils'
import state from '@/global/state'
import { Room } from '$shared/types/Room'
import { User } from '$shared/types/User'

function init(twoUsers: false): { room: Room; user: User }
function init(twoUsers?: true): { room: Room; user: User; secondUser: User }

function init(twoUsers = true) {
	const { room, user } = createRoomForTesting().value!
	if (twoUsers) {
		const secondUser = mockUser({ socketId: 'userB', username: 'Pierce' })
		state.addUserToRoom(room.id, secondUser)
		return { room, user, secondUser }
	}

	return { room, user }
}

describe('LeaveRoom', () => {
	it('runs without failing if callback not provided', async () => {
		// @ts-expect-error missing parameters on purpose
		await LeaveRoom(mockSocket(), null, null)
		expect(true).toBe(true)
	})

	it('gives the correct error if the user is not in a room', async () => {
		const callback = jest.fn()
		await LeaveRoom(mockSocket(), callback)

		expect(callback).toHaveBeenCalledWith({
			value: null,
			error: {
				reason: 'user-not-in-room'
			}
		})
	})

	it('removes the user from the state', async () => {
		const { room, user } = init()
		await LeaveRoom(mockSocket(user.socketId), () => {})

		expect(state.getRoom(room!.id)?.users.length).toBe(1)
	})

	it('removes the socket from the room', async () => {
		const { room, user } = init()
		const socket = mockSocket(user.socketId)

		await LeaveRoom(socket, () => {})

		expect(socket.leave).toHaveBeenCalledWith(room.id)
	})

	it('emits a leave room event to all users left in the room', async () => {
		const { room, user } = init()
		const socket = mockSocket(user.socketId)
		const { inSpy, emitSpy } = ioSpies()

		await LeaveRoom(socket, () => {})

		expect(inSpy).toHaveBeenCalledWith(room.id)
		expect(emitSpy).toHaveBeenCalledWith(
			'leave-room',
			expect.objectContaining({
				userSocketId: socket.id,
				room: expect.objectContaining({
					id: room.id
				})
			})
		)
	})

	it('removes the room if there are no users left in the room', async () => {
		const { room, user } = init(false)

		await LeaveRoom(mockSocket(user.socketId), () => {})

		expect(state.getRoom(room.id)).toBeUndefined()
	})

	it('sets the room to in progress if all other users are ready', async () => {
		const spy = jest.spyOn(eventUtils, 'setRoomToInProgress')
		const { user, secondUser } = init()
		const socket = mockSocket(user.socketId)
		state.updateUser(secondUser!.socketId, { state: 'ready' })

		await LeaveRoom(socket, () => {})

		expect(spy).toHaveBeenCalled()
	})

	it('sets the room to complete in the state if all users are completed or failed', async () => {
		const { room, user, secondUser } = init()
		const socket = mockSocket(user.socketId)
		state.updateUser(secondUser!.socketId, { state: 'complete' })
		state.addUserToRoom(
			room.id,
			mockUser({ socketId: 'userC', username: 'AnotherOne', state: 'failed' })
		)

		await LeaveRoom(socket, () => {})

		expect(state.getRoom(room.id)!.state).toBe('complete')
	})

	it('emits a room data change event with the complete state if all users are completed or failed', async () => {
		const { room, user, secondUser } = init()
		const socket = mockSocket(user.socketId)
		const { inSpy, emitSpy } = ioSpies()
		state.updateUser(secondUser!.socketId, { state: 'complete' })
		state.addUserToRoom(
			room.id,
			mockUser({ socketId: 'userC', username: 'AnotherOne', state: 'failed' })
		)

		await LeaveRoom(socket, () => {})

		expect(inSpy).toHaveBeenCalledWith(room.id)
		expect(emitSpy).toHaveBeenCalledWith('change-room-data', { state: 'complete' })
	})

	it('changes the room admin in the state if the admin leaves', async () => {
		const { user, room, secondUser } = init()

		expect(state.getRoom(room.id)!.admin).toBe(user.socketId)

		await LeaveRoom(mockSocket(user.socketId), () => {})

		expect(state.getRoom(room.id)!.admin).toBe(secondUser.socketId)
	})

	it('emits a room change event with the new admin if the admin leaves', async () => {
		const { user, room, secondUser } = init()
		const { inSpy, emitSpy } = ioSpies()

		await LeaveRoom(mockSocket(user.socketId), () => {})

		expect(inSpy).toHaveBeenCalledWith(room.id)
		expect(emitSpy).toHaveBeenCalledWith('change-room-data', { admin: secondUser.socketId })
	})

	it('calls the callback with the correct values', async () => {
		const { user } = init()
		const socket = mockSocket(user.socketId)
		const callback = jest.fn()

		await LeaveRoom(socket, callback)

		expect(callback).toHaveBeenCalledWith({
			value: null,
			error: null
		})
	})
})
