import JoinRoom from "@/events/JoinRoom";
import { createRoomForTesting, mockSocket, mockUser } from "../test-utils";
import state from "@/global/state";
import { INITIAL_USER_SCORE, INITIAL_USER_STATE, MAX_USERS_PER_ROOM } from "@/constants";

/** Create a room and return the user, room, and socket */
function initRoom(userId = 'abcdef') {
  const socket = mockSocket(userId)
  const { value } = createRoomForTesting(
    mockUser({ id: userId }),
    socket
  )
  expect(value).not.toBeNull()
  return { ...value!, socket }
}

const secondUser = () => mockUser({ id: 'userB', username: 'secondUser' })
const secondUserSocket = () => mockSocket('userB')

describe('JoinRoom', () => {
  it('runs without failing if callback not provided', () => {
    // @ts-ignore
    JoinRoom(mockSocket(), null, null)
    expect(true).toBe(true)
  })

  describe('errors', () => {
    it('gives the correct error if the user ID does not match the session ID', () => {
      const { room: { id: roomId } } = createRoomForTesting(mockUser()).value!
      
      const callback = jest.fn()
      JoinRoom(mockSocket('INCORRECT_ID'), { roomId, user: secondUser() }, callback)

      expect(callback).toHaveBeenCalledWith({
        value: null,
        error: {
          reason: 'invalid-user-id'
        }
      })
    })
    
    it('gives the correct error when no roomId is provided', () => {
      initRoom()
      const callback = jest.fn()
      // @ts-ignore
      JoinRoom(secondUserSocket(), { user: secondUser() }, callback)

      expect(callback).toHaveBeenCalledWith({
        value: null,
        error: {
          reason: 'missing-argument'
        }
      })
    })

    it('gives the correct error when no user is provided', () => {
      const callback = jest.fn()
      const { room: { id: roomId } } = initRoom()
      
      // @ts-ignore
      JoinRoom(secondUserSocket(), { roomId }, callback)

      expect(callback).toHaveBeenCalledWith({
        value: null,
        error: {
          reason: 'missing-argument'
        }
      })
    })

    it('gives the correct error when the user is in a room already', () => {
      const callback = jest.fn()
      const { room: { id: roomId }, user, socket } = initRoom()
      
      JoinRoom(socket, { roomId, user }, callback)

      expect(callback).toHaveBeenCalledWith({
        value: null,
        error: {
          reason: 'user-in-room-already'
        }
      })
    })

    it('gives the correct error when the wrong room ID is provided', () => {
      initRoom()
      const callback = jest.fn()
      
      JoinRoom(secondUserSocket(), { roomId: 'INVALID_ID', user: secondUser() }, callback)

      expect(callback).toHaveBeenCalledWith({
        value: null,
        error: {
          reason: 'room-does-not-exist'
        }
      })
    })

    it('gives the correct error when the room game is in progress', () => {
      const callback = jest.fn()
      const { room: { id: roomId } } = initRoom()
      state.updateRoom(roomId, { state: 'in-progress' })
      
      JoinRoom(secondUserSocket(), { roomId, user: secondUser() }, callback)

      expect(callback).toHaveBeenCalledWith({
        value: null,
        error: {
          reason: 'game-in-progress'
        }
      })
    })

    it('gives the correct error when the room is full', () => {
      const callback = jest.fn()
      const { room: { id: roomId } } = initRoom()
      // Already one user in the room
      Array(MAX_USERS_PER_ROOM - 1).fill(null).forEach((_, index) => {
        state.addUserToRoom(
          roomId,
          mockUser({ id: `user${index}`, username: `user${index}` })
        )
      })
      
      JoinRoom(secondUserSocket(), { roomId, user: secondUser()}, callback)

      expect(callback).toHaveBeenCalledWith({
        value: null,
        error: {
          reason: 'room-is-full'
        }
      })
    })

    it('gives the correct error when the username is taken', () => {
      const callback = jest.fn()
      const { room: { id: roomId }, user, socket } = initRoom()
      
      JoinRoom(
        mockSocket('userB'),
        {
          roomId,
          user: { id: 'userB', username: user.username, color: 'orange' }
        },
        callback
      )

      expect(callback).toHaveBeenCalledWith({
        value: null,
        error: {
          reason: 'username-taken'
        }
      })
    })
  })

  it('adds the user to the correct room', () => {
    initRoom('another one')
    const { room: { id: roomId } } = initRoom()

    JoinRoom(secondUserSocket(), { roomId, user: secondUser()}, () => {})

    expect(state.getRoom(roomId)!.users[1]).toMatchObject({
      id: secondUser().id
    })
  })

  it('adds the socket to the correct room', () => {
    initRoom('another one')
    const { room: { id: roomId } } = initRoom()

    const socket = secondUserSocket()
    JoinRoom(socket, { roomId, user: secondUser() }, () => {})

    expect(socket.join).toHaveBeenCalledWith(roomId)
  })

  it('adds the socket to the correct room', () => {
    initRoom('another one')
    const { room: { id: roomId } } = initRoom()

    const socket = secondUserSocket()
    JoinRoom(socket, { roomId, user: secondUser() }, () => {})

    expect(socket.join).toHaveBeenCalledWith(roomId)
  })

  it('calls callback with the correct data', () => {
    const { room: { id: roomId } } = initRoom()

    const callback = jest.fn()
    JoinRoom(secondUserSocket(), { roomId, user: secondUser() }, callback)

    expect(callback.mock.lastCall[0].value).toMatchObject({
      user: {
        id: secondUser().id,
        username: secondUser().username,
        score: INITIAL_USER_SCORE,
        state: INITIAL_USER_STATE
      },
      room: {
        id: roomId
      }
    })
  })

  it('emits the correct event with the user', () => {
    const { room: { id: roomId } } = initRoom()

    const socket = secondUserSocket()
    const callback = jest.fn()
    JoinRoom(socket, { roomId, user: secondUser() }, callback)

    expect(socket.broadcast.to).toHaveBeenCalledWith(roomId)
    expect(socket.broadcast.to(roomId).emit).toHaveBeenCalledWith(
      'join-room',
      callback.mock.lastCall[0].value.user
    )
  })

  it('gives the user a color that is not taken', () => {
    const { room, user } = initRoom('userA')

    const callback = jest.fn()

    JoinRoom(secondUserSocket(), { roomId: room.id, user: secondUser() }, callback)

    expect(callback.mock.lastCall[0]).toMatchObject({
      value: {
        user: {
          id: 'userB'
        }
      }
    })
    expect(callback.mock.lastCall[0]).not.toMatchObject({
      value: {
        user: {
          color: user.color
        }
      }
    })
  })
})