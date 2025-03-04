import { Room, RoomMetadata, RoomSettings } from '$shared/types/Room'
import { User } from '$shared/types/User'

class State {
	private static instance: State
	private rooms: Room[]

	private constructor() {
		this.rooms = []
	}

	static getInstance() {
		if (!State.instance) {
			State.instance = new State()
		}

		return State.instance
	}

	private generateRoomId() {
		return Array(5)
			.fill(null)
			.map(() =>
				String.fromCharCode(
					Math.random() * ('Z'.charCodeAt(0) - 'A'.charCodeAt(0)) + 'A'.charCodeAt(0)
				)
			)
			.join('')
	}

	getRooms(): readonly Room[] {
		return this.rooms
	}

	getRoom(id: Room['id']): Readonly<Room | undefined> {
		return this.rooms.find((r) => r.id === id)
	}

	createRoom(admin: User, settings: RoomSettings): Readonly<Room> {
		const newRoom: Room = {
			id: this.generateRoomId(),
			state: 'waiting',
			users: [admin],
			admin: admin.socketId,
			settings
		}

		this.rooms.push(newRoom)

		return newRoom
	}

	removeRoom(id: Room['id']): Readonly<Room | undefined> {
		const room = this.rooms.find((r) => r.id === id)
		this.rooms = this.rooms.filter((r) => r.id !== id)

		return room
	}

	updateRoom(id: Room['id'], data: Partial<Omit<RoomMetadata, 'id'>>): Readonly<Room | undefined> {
		this.rooms = this.rooms.map((r) =>
			r.id === id
				? {
						...r,
						...data
					}
				: r
		)
		return this.getRoom(id)
	}

	addUserToRoom(id: Room['id'], user: User): Readonly<Room | undefined> {
		this.rooms = this.rooms.map((r) =>
			r.id === id
				? {
						...r,
						users: [...r.users, user]
					}
				: r
		)
		return this.getRoom(id)
	}

	removeUserFromRoom(roomId: Room['id'], socketId: User['socketId']): Readonly<Room | undefined> {
		this.rooms = this.rooms.map((r) =>
			r.id === roomId
				? {
						...r,
						users: r.users.filter((u) => u.socketId !== socketId)
					}
				: r
		)
		return this.getRoom(roomId)
	}

	getUserInRoom(roomId: Room['id'], userId: User['socketId']): Readonly<User | undefined> {
		return this.rooms.reduce<User | undefined>(
			(acc, r) => (acc || r.id !== roomId ? acc : r.users.find((u) => u.socketId === userId)),
			undefined
		)
	}

	getRoomFromUser(socketId: User['socketId']): Readonly<Room | undefined> {
		return this.rooms.find((r) => !!r.users.find((u) => u.socketId === socketId))
	}

	updateUser(
		socketId: User['socketId'],
		user: Partial<Omit<User, 'id'>>
	): Readonly<User | undefined> {
		this.rooms = this.rooms.map((r) => ({
			...r,
			users: r.users.map((u) => (u.socketId === socketId ? { ...u, ...user } : u))
		}))
		const roomId = this.getRoomFromUser(socketId)?.id
		return roomId ? this.getUserInRoom(roomId, socketId) : undefined
	}

	reset() {
		this.rooms = []
	}
}

const state = State.getInstance()
export default state
