import { createRoomForTesting, mockSocket, mockUser } from "../test-utils";
import JoinRoom from "@/events/JoinRoom";
import RequestColor from "@/events/RequestColor";
import state from "@/global/state";

const socket = mockSocket()

describe('RequestColor', () => {
  it('runs without failing if callback not provided', () => {
    // @ts-ignore
    RequestColor(socket, null, null)
    expect(true).toBe(true)
  })

  describe('errors', () => {
    it('gives the correct error if the user is not in a room', () => {
      const callback = jest.fn()
      RequestColor(socket, { id: 'test', color: 'red' }, callback)

      expect(callback).toHaveBeenCalledWith({
        value: null,
        error: {
          reason: 'user-not-in-room'
        }
      })
    })

    it('gives the correct error if the provided color is invalid', () => {
      const callback = jest.fn()
      const { user } = createRoomForTesting(mockUser()).value!
      // @ts-ignore
      RequestColor(socket, { id: user.id, color: 'INVALID_COLOR' }, callback)

      expect(callback).toHaveBeenCalledWith({
        value: null,
        error: {
          reason: 'invalid-color'
        }
      })
    })

    it('gives the correct error if the color is taken', () => {
      const callback = jest.fn()
      const { user, room } = createRoomForTesting(mockUser({ color: 'red' })).value!
      JoinRoom(
        mockSocket('userB'),
        { roomId: room.id, user: mockUser({ id: 'userB', color: 'green' }) },
        () => {}
      )

      RequestColor(socket, { id: user.id, color: 'green' }, callback)

      expect(callback).toHaveBeenCalledWith({
        value: null,
        error: {
          reason: 'color-taken'
        }
      })
    })
  })

  it('calls the callback with the provided color', () => {
    const callback = jest.fn()
    const { user } = createRoomForTesting(mockUser({ color: 'red' })).value!

    RequestColor(socket, { id: user.id, color: 'blue' }, callback)

    expect(callback).toHaveBeenCalledWith({
      value: {
        color: 'blue'
      },
      error: null
    })
  })

  it('tells all other users in the room that the color has changed', () => {
    const socket = mockSocket()
    const { user, room } = createRoomForTesting(mockUser({ color: 'red' })).value!

    RequestColor(socket, { id: user.id, color: 'blue' }, () => {})

    expect(socket.broadcast.to).toHaveBeenCalledWith(room.id)
    expect(socket.broadcast.to(room.id).emit).toHaveBeenCalledWith(
      'change-user-data',
      { id: user.id, color: 'blue' }
    )
  })
})