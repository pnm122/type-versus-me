import state from '@/global/state'
import { mockUser } from '../test-utils'
import { User } from '$shared/types/User'
import { RoomSettings } from '$shared/types/Room'

function createRoom(admin?: Partial<User>, settings?: Partial<RoomSettings>) {
	return state.createRoom(mockUser(admin), {
		category: 'top-100',
		numWords: 40,
		timeLimit: 120,
		...settings
	})
}

describe('state', () => {
	describe('createRoom', () => {
		it('adds a room to the room list', () => {
			createRoom()
			expect(state.getRooms().length).toEqual(1)
		})

		it('returns the room that it creates', () => {
			const room = createRoom()
			expect(state.getRooms()[0]).toEqual(room)
		})
	})

	describe('removeRoom', () => {
		it('removes the correct room from the room list', () => {
			createRoom({ id: 'a' })
			const room = createRoom({ id: 'b' })
			createRoom({ id: 'c' })

			state.removeRoom(room.id)

			expect(state.getRooms()).toHaveLength(2)
			expect(state.getRooms().find((r) => r.id === room.id)).toBeFalsy()
		})

		it('returns the room that was removed', () => {
			createRoom({ id: 'a' })
			const room = createRoom({ id: 'b' })
			createRoom({ id: 'c' })
			const removedRoom = state.removeRoom(room.id)
			expect(room).toEqual(removedRoom)
		})

		it('changes nothing if an invalid ID is passed', () => {
			createRoom({ id: 'a' })
			createRoom({ id: 'b' })
			createRoom({ id: 'c' })

			const before = state.getRooms()
			state.removeRoom('INVALID_ID')
			const after = state.getRooms()

			expect(before).toEqual(after)
		})
	})

	describe('getRoom', () => {
		it('returns the correct room', () => {
			createRoom({ id: 'a' })
			const room = createRoom({ id: 'b' })
			createRoom({ id: 'c' })
			const roomFromGetRoom = state.getRoom(room.id)
			expect(room).toEqual(roomFromGetRoom)
		})

		it('returns nothing if an invalid ID is passed', () => {
			createRoom({ id: 'a' })
			createRoom({ id: 'b' })
			createRoom({ id: 'c' })

			const res = state.getRoom('INVALID_ID')
			expect(res).toBeUndefined()
		})
	})

	describe('updateRoom', () => {
		const update = { state: 'in-progress', test: 'test' } as const
		it('updates only the fields specified', () => {
			const room = createRoom()
			const expected = {
				...room,
				...update
			}
			state.updateRoom(room.id, update)
			expect(state.getRoom(room.id)).toEqual(expected)
		})

		it('returns the updated room', () => {
			const room = createRoom()
			const expected = {
				...room,
				...update
			}
			const returned = state.updateRoom(room.id, update)
			expect(returned).toEqual(expected)
		})

		it('changes nothing if an invalid ID is passed', () => {
			createRoom({ id: 'a' })
			createRoom({ id: 'b' })
			createRoom({ id: 'c' })

			const before = state.getRooms()
			state.updateRoom('INVALID_ID', update)
			const after = state.getRooms()

			expect(before).toEqual(after)
		})
	})

	describe('addUserToRoom', () => {
		const newUser = {
			id: 'test',
			username: 'Test',
			color: 'blue'
		} as const

		it('adds the user to the correct room', () => {
			const roomA = createRoom({ id: 'a' })
			const roomB = createRoom({ id: 'b' })
			const roomC = createRoom({ id: 'c' })

			state.addUserToRoom(roomB.id, newUser)

			expect(state.getRoom(roomA.id)!.users).toHaveLength(1)
			expect(state.getRoom(roomB.id)!.users).toHaveLength(2)
			expect(state.getRoom(roomC.id)!.users).toHaveLength(1)
			expect(state.getRoom(roomB.id)!.users[1]).toEqual(newUser)
		})

		it('returns the updated room', () => {
			const room = createRoom()
			const updatedRoom = state.addUserToRoom(room.id, newUser)

			expect(updatedRoom!.users[1]).toEqual(newUser)
		})

		it('changes nothing if an invalid ID is passed', () => {
			createRoom({ id: 'a' })
			createRoom({ id: 'b' })
			createRoom({ id: 'c' })

			const before = state.getRooms()
			state.addUserToRoom('INVALID_ID', newUser)
			const after = state.getRooms()

			expect(before).toEqual(after)
		})
	})

	describe('removeUserFromRoom', () => {
		function newUser(id: string) {
			return {
				id,
				username: '',
				color: 'blue'
			} as const
		}

		it('removes the user from the correct room', () => {
			const roomA = createRoom({ id: 'a' })
			const roomB = createRoom({ id: 'b' })
			const roomC = createRoom({ id: 'c' })

			state.removeUserFromRoom(roomB.id, 'b')

			expect(state.getRoom(roomA.id)!.users).toHaveLength(1)
			expect(state.getRoom(roomB.id)!.users).toHaveLength(0)
			expect(state.getRoom(roomC.id)!.users).toHaveLength(1)
		})

		it('returns the updated room', () => {
			const room = createRoom()
			state.addUserToRoom(room.id, newUser('test'))
			const updatedRoom = state.removeUserFromRoom(room.id, 'test')

			expect(updatedRoom!.users).toHaveLength(0)
		})

		it('changes nothing if an invalid room ID is passed', () => {
			const roomA = createRoom({ id: 'a' })
			const roomB = createRoom({ id: 'b' })
			const roomC = createRoom({ id: 'c' })

			state.addUserToRoom(roomA.id, newUser('test'))

			state.addUserToRoom(roomB.id, newUser('test'))

			state.addUserToRoom(roomC.id, newUser('test'))

			const before = state.getRooms()
			state.removeUserFromRoom('INVALID_ID', 'test')
			const after = state.getRooms()

			expect(before).toEqual(after)
		})

		it('changes nothing if an invalid user ID is passed', () => {
			const roomA = createRoom({ id: 'a' })
			const roomB = createRoom({ id: 'b' })
			const roomC = createRoom({ id: 'c' })

			state.addUserToRoom(roomA.id, newUser('test'))

			state.addUserToRoom(roomB.id, newUser('test'))

			state.addUserToRoom(roomC.id, newUser('test'))

			const before = state.getRooms()
			state.removeUserFromRoom(roomB.id, 'INVALID_ID')
			const after = state.getRooms()

			expect(before).toEqual(after)
		})
	})

	describe('getUserInRoom', () => {
		function createRooms() {
			const roomA = createRoom({ id: 'a' })
			const roomB = createRoom({ id: 'b' })
			const roomC = createRoom({ id: 'c' })

			state.addUserToRoom(roomA.id, {
				id: 'test',
				username: 'User Room A',
				color: 'blue'
			})

			state.addUserToRoom(roomB.id, {
				id: 'test',
				username: 'User Room B',
				color: 'blue'
			})

			state.addUserToRoom(roomC.id, {
				id: 'test',
				username: 'User Room C',
				color: 'blue'
			})

			return roomB.id
		}

		it('gets the user from the correct room', () => {
			const roomBId = createRooms()
			const user = state.getUserInRoom(roomBId, 'test')
			expect(user?.username).toBe('User Room B')
		})

		it('returns nothing if the user ID is incorrect', () => {
			const roomBId = createRooms()
			const user = state.getUserInRoom(roomBId, 'INVALID_ID')
			expect(user).toBeUndefined()
		})
	})

	describe('getRoomFromUser', () => {
		function createRooms() {
			const roomA = createRoom({ id: 'a' })
			const roomB = createRoom({ id: 'b' })
			const roomC = createRoom({ id: 'c' })

			state.addUserToRoom(roomA.id, {
				id: 'userA',
				username: 'User Room A',
				color: 'blue'
			})

			state.addUserToRoom(roomB.id, {
				id: 'userB',
				username: 'User Room B',
				color: 'blue'
			})

			state.addUserToRoom(roomC.id, {
				id: 'userC',
				username: 'User Room C',
				color: 'blue'
			})

			return state.getRoom(roomB.id)
		}

		it('returns the correct room', () => {
			const roomB = createRooms()
			const roomFromUser = state.getRoomFromUser('userB')

			expect(roomFromUser).toEqual(roomB)
		})

		it('returns nothing if the user is not in a room', () => {
			createRooms()
			const roomFromUser = state.getRoomFromUser('INVALID_ID')

			expect(roomFromUser).toBeUndefined()
		})
	})

	describe('updateUser', () => {
		it('updates the user correctly', () => {
			const initialUser = mockUser()
			const room = createRoom()
			state.addUserToRoom(room.id, initialUser)
			state.updateUser(initialUser.id, { username: 'Pierce' })
			expect(state.getUserInRoom(room.id, initialUser.id)).toEqual({
				...initialUser,
				username: 'Pierce'
			})
		})

		it('returns the updated user', () => {
			const initialUser = mockUser()
			const room = createRoom()
			state.addUserToRoom(room.id, initialUser)
			const newUser = state.updateUser(initialUser.id, { username: 'Pierce' })
			expect(newUser).toEqual({ ...initialUser, username: 'Pierce' })
		})

		it('returns nothing if the user is not in a room', () => {
			const user = mockUser()
			const room = createRoom()
			state.addUserToRoom(room.id, user)
			const newUser = state.updateUser('INVALID_ID', { username: 'Pierce' })
			expect(newUser).toBeUndefined()
		})
	})
})
