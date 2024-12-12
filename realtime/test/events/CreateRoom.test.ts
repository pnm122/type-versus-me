import { User } from "$shared/types/User"
import { INITIAL_USER_SCORE, INITIAL_USER_STATE, MAX_ROOMS } from "@/constants"
import CreateRoom from "@/events/CreateRoom"
import state from "@/global/state"
import { mockSocket } from "../test-utils"

const socket = mockSocket()

const validUser = {
  id: 'test',
  username: 'TestUser',
  color: 'blue'
} as const

const validUserAfterCall = {
  ...validUser,
  state: INITIAL_USER_STATE,
  score: INITIAL_USER_SCORE
} as const

describe('CreateRoom', () => {
  it('runs without failing if callback not provided', () => {
    // @ts-ignore
    CreateRoom(socket, null, null)
    expect(true).toBe(true)
  })

  describe('errors', () => {
    it('gives the correct error when no value is passed', () => {
      const callback = jest.fn()

      // @ts-ignore
      CreateRoom(socket, null, callback)
  
      expect(callback).toHaveBeenCalledWith({
        value: null,
        error: {
          reason: 'missing-argument'
        }
      })
    })

    it('gives the correct error when the username is invalid', () => {
      const callback = jest.fn()
      const user = {
        ...validUser,
        username: ''
      } as const
  
      CreateRoom(socket, user, callback)
  
      expect(callback).toHaveBeenCalledWith({
        value: null,
        error: {
          reason: 'invalid-username'
        }
      })
    })

    it('gives the correct error when the color is invalid', () => {
      const callback = jest.fn()
      const user = {
        ...validUser,
        color: 'invalid'
      }
  
      CreateRoom(socket, user as User, callback)
  
      expect(callback).toHaveBeenCalledWith({
        value: null,
        error: {
          reason: 'invalid-color'
        }
      })
    })

    it('gives the correct error when the user is already in a room', () => {
      const callback = jest.fn()

      const room = state.createRoom()
      state.addUserToRoom(room.id, validUser)

      CreateRoom(socket, validUser, callback)

      expect(callback).toHaveBeenCalledWith({
        value: null,
        error: {
          reason: 'user-in-room-already'
        }
      })
    })

    it('gives the correct error when the maximum number of rooms have been created', () => {
      const callback = jest.fn()
      
      new Array(MAX_ROOMS).fill(null).forEach(() => {
        state.createRoom()
      })

      CreateRoom(socket, validUser, callback)

      expect(callback).toHaveBeenCalledWith({
        value: null,
        error: {
          reason: 'max-rooms-created'
        }
      })
    })
  })

  describe('on success', () => {
    it('adds a room to the state with the correct user', () => {
      CreateRoom(socket, validUser, () => {})
  
      expect(state.getRooms()).toHaveLength(1)
      expect(state.getRooms()[0].users[0]).toEqual(validUserAfterCall)
    })

    it('calls callback with the correct user and room', () => {
      const callback = jest.fn()
      CreateRoom(socket, validUser, callback)
  
      expect(callback).toHaveBeenCalledWith({
        value: {
          room: state.getRooms()[0],
          user: validUserAfterCall
        },
        error: null
      })
    })

    it('adds the socket to the correct room', () => {
      const socket = mockSocket()
      CreateRoom(socket, validUser, () => {})

      expect(socket.join).toHaveBeenCalledWith(
        state.getRooms()[0].id
      )
    })
  })
})