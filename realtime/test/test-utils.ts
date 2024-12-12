import { CreateRoomCallback } from "$shared/types/events/client/CreateRoom";
import { User } from "$shared/types/User";
import CreateRoom from "@/events/CreateRoom";
import CustomSocket from "@/types/CustomSocket";

export function mockSocket(id = 'test') {
  // separate this out so that in().emit is always captured by the same mocked function
  const inEmit = jest.fn() as CustomSocket['emit']
  const socketIn = jest.fn((room: string | string[]) => ({
    emit: inEmit
  } as any)) as CustomSocket['in']

  return {
    id,
    join: jest.fn() as CustomSocket['join'],
    emit: jest.fn() as CustomSocket['emit'],
    in: socketIn
  } as CustomSocket
}

export function mockUser(u?: Partial<User>): User {
  return {
    id: 'test',
    username: 'Test',
    color: 'blue',
    ...u
  }
}

export function createRoomForTesting(user: User, socket = mockSocket()) {
  let res: Parameters<CreateRoomCallback>[0]
  
  CreateRoom(socket, user, (arg: typeof res) => { res = arg })

  return res!
}