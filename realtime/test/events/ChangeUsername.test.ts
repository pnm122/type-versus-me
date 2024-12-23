import ChangeUsername from "@/events/ChangeUsername";
import { createRoomForTesting, ioSpies, mockSocket, mockUser } from "../test-utils";
import state from "@/global/state";

const socket = mockSocket()

describe('ChangeUsername', () => {
  it('runs without failing if callback not provided', () => {
    // @ts-expect-error missing parameters on purpose
    ChangeUsername(socket, null, null)
    expect(true).toBe(true)
  })

  describe('errors', () => {
    it('gives the correct error if the user ID does not match the session ID', () => {
      const callback = jest.fn()
      ChangeUsername(mockSocket('userA'), mockUser({ id: 'userB' }), callback)

      expect(callback).toHaveBeenCalledWith({
        value: null,
        error: {
          reason: 'invalid-user-id'
        }
      })
    })

    it('gives the correct error if the username is not provided', () => {
      const callback = jest.fn()
      // @ts-expect-error missing parameters on purpose
      ChangeUsername(mockSocket('test'), { id: 'test' }, callback)

      expect(callback).toHaveBeenCalledWith({
        value: null,
        error: {
          reason: 'missing-argument'
        }
      })
    })

    it('gives the correct error if the user is not in a room', () => {
      const callback = jest.fn()
      ChangeUsername(socket, mockUser(), callback)

      expect(callback).toHaveBeenCalledWith({
        value: null,
        error: {
          reason: 'user-not-in-room'
        }
      })
    })

    it('gives the correct error if the new username is invalid', () => {
      const callback = jest.fn()
      ChangeUsername(socket, mockUser({ username: '' }), callback)

      expect(callback).toHaveBeenCalledWith({
        value: null,
        error: {
          reason: 'invalid-username'
        }
      })
    })

    it('gives the correct error if a user in the same room has the same username', () => {
      const userA = mockUser({ id: 'userA', username: 'Pierce' })
      const socketA = mockSocket('userA')
      const userB = mockUser({ id: 'userB', username: 'John' })
      const socketB = mockSocket('userB')

      const { room: { id: roomId } } = createRoomForTesting(userA, socketA).value!
      state.addUserToRoom(roomId, userB)

      const callback = jest.fn()
      ChangeUsername(socketB, { ...userB, username: 'Pierce' }, callback)

      expect(callback).toHaveBeenCalledWith({
        value: null,
        error: {
          reason: 'username-taken'
        }
      })
    })
  })

  it('changes the username in the state', () => {
    const user = mockUser()
    createRoomForTesting(user)
    ChangeUsername(socket, { ...user, username: 'Pierce' }, () => {})

    expect(state.getRooms()[0].users[0].username).toBe('Pierce')
  })

  it('emits a change username event to all sockets except the sender', () => {
    const user = mockUser()
    const socket = mockSocket()
    const { inSpy, emitSpy } = ioSpies()
    
    const { user: userAfterCreateRoom, room: { id: roomId } } = createRoomForTesting(user).value!
    const userAfterChange = { ...userAfterCreateRoom, username: 'Pierce' }

    ChangeUsername(socket, { id: user.id, username: userAfterChange.username }, () => {})

    expect(inSpy).toHaveBeenCalledWith(roomId)
    expect(emitSpy).toHaveBeenCalledWith(
      'change-user-data',
      userAfterChange
    )
  })

  it('calls the callback with only the new username', () => {
    const user = mockUser()
    const callback = jest.fn()
    const userAfterChange = { ...user, username: 'Pierce' }

    createRoomForTesting(user)
    ChangeUsername(socket, userAfterChange, callback)

    expect(callback.mock.lastCall[0].value).toEqual({ username: 'Pierce' })
  })
})