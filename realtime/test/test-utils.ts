import { CreateRoomCallback } from '$shared/types/events/client/CreateRoom'
import { User } from '$shared/types/User'
import CreateRoom from '@/events/CreateRoom'
import io from '@/global/server'
import CustomSocket from '@/types/CustomSocket'

export function mockSocket(id = 'test') {
	// separate this out so that in().emit is always captured by the same mocked function
	const inEmit = jest.fn() as CustomSocket['emit']
	const socketIn = jest.fn(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		(_: string | string[]) =>
			({
				emit: inEmit
			}) as any
	) as CustomSocket['in']
	const broadcastToEmit = jest.fn() as CustomSocket['emit']
	const broadcastTo = jest.fn(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		(_: string | string[]) =>
			({
				emit: broadcastToEmit
			}) as any
	) as CustomSocket['broadcast']['to']

	return {
		id,
		join: jest.fn() as CustomSocket['join'],
		emit: jest.fn() as CustomSocket['emit'],
		in: socketIn,
		broadcast: {
			to: broadcastTo
		},
		leave: jest.fn() as CustomSocket['leave']
	} as CustomSocket
}

export function mockUser<T extends Partial<User> = Partial<User>>(u?: T): User & T {
	return {
		socketId: 'test',
		username: 'Test',
		color: 'blue',
		...u
	} as User & T
}

export function createRoomForTesting(
	user = mockUser(),
	socket = mockSocket(),
	settings = { category: 'top-100', numWords: 40, timeLimit: 120 } as const
) {
	let res: Parameters<CreateRoomCallback>[0]

	CreateRoom(socket, { user, settings }, (arg: typeof res) => {
		res = arg
	})

	return res!
}

export function ioSpies() {
	const emitSpy = jest.fn()
	const inSpy = jest.spyOn(io, 'in').mockReturnValue({ emit: emitSpy } as any)
	return { inSpy, emitSpy }
}
