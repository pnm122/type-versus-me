import { Room, RoomMetadata } from "$shared/types/Room";
import { User } from "$shared/types/User";
import generateTest from "@/utils/generateTest";

class State {
  private static instance: State
  private rooms: Room[]

  private constructor() {
    this.rooms = []
  }

  static getInstance() {
    if(!State.instance) {
      State.instance = new State()
    }

    return State.instance
  }

  private generateRoomId() {
    return Array(5).fill(null).map(() => (
      String.fromCharCode(
        (Math.random() * ('Z'.charCodeAt(0) - 'A'.charCodeAt(0))) + 'A'.charCodeAt(0)
      )
    )).join('')
  }

  getRooms() {
    return this.rooms
  }

  getRoom(id: Room['id']) {
    return this.rooms.find(r => r.id === id)
  }

  createRoom() {
    const newRoom: Room = {
      id: this.generateRoomId(),
      test: generateTest(50),
      state: 'waiting',
      users: []
    }

    this.rooms.push(newRoom)

    return newRoom
  }

  removeRoom(id: Room['id']) {
    const room = this.rooms.find(r => r.id === id)
    this.rooms = this.rooms.filter(r => r.id !== id)

    return room
  }

  updateRoom(id: Room['id'], data: Partial<Omit<RoomMetadata, 'id'>>) {
    this.rooms = this.rooms.map(r => (
      r.id === id ? {
        ...r,
        ...data
      } : r
    ))
  }

  addUserToRoom(id: Room['id'], user: User) {
    this.rooms = this.rooms.map(r => (
      r.id === id ? {
        ...r,
        users: [
          ...r.users,
          user
        ]
      } : r
    ))
    return this.getRoom(id)
  }

  removeUserFromRoom(roomId: Room['id'], userId: User['id']) {
    this.rooms = this.rooms.map(r => (
      r.id === roomId ? {
        ...r,
        users: r.users.filter(u => u.id !== userId)
      } : r
    ))
  }

  getUserInRoom(roomId: Room['id'], userId: User['id']) {
    return this.rooms.reduce<User | undefined>((acc, r) => 
      acc ? acc : r.users.find(u => u.id === userId),
      undefined
    )
  }

  getRoomFromUser(userId: User['id']) {
    return this.rooms.find(r => (
      !!r.users.find(u => u.id === userId)
    ))
  }
}

const state = State.getInstance()
export default state