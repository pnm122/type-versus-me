import Disconnect from "@/events/Disconnect"
import { createRoomForTesting, mockSocket } from "../test-utils"
import * as LeaveRoom from "@/events/LeaveRoom"

describe('Disconnect', () => {
  it('calls LeaveRoom if the user was in a room', () => {
    const spy = jest.spyOn(LeaveRoom, 'default')
    const { user } = createRoomForTesting().value!
    Disconnect(mockSocket(user.id))

    expect(spy).toHaveBeenCalled()
  })
})