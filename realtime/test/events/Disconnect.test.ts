import Disconnect from '@/events/Disconnect'
import { createRoomForTesting, mockSocket } from '../test-utils'
import * as LeaveRoom from '@/events/LeaveRoom'
import io from '@/global/server'

describe('Disconnect', () => {
	it('emits an event that the number of users has changed', () => {
		const spy = jest.spyOn(io, 'emit')
		// Not initialized when used here, but we just want to make sure that the event is emitted so it's fine
		io.engine = { clientsCount: 0 } as any
		const { user } = createRoomForTesting().value!
		Disconnect(mockSocket(user.id))

		expect(spy).toHaveBeenCalledWith('change-user-count', 0)
	})

	it('calls LeaveRoom if the user was in a room', () => {
		const spy = jest.spyOn(LeaveRoom, 'default')
		const { user } = createRoomForTesting().value!
		Disconnect(mockSocket(user.id))

		expect(spy).toHaveBeenCalled()
	})
})
