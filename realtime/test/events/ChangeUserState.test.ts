import ChangeUserState from "@/events/ChangeUserState"
import { createRoomForTesting, mockSocket, mockUser } from "../test-utils"
import { UserState } from "$shared/types/User"
import { Room, RoomState } from "$shared/types/Room"
import state from "@/global/state"
import { INITIAL_USER_SCORE } from "@/constants"

describe('ChangeUserState', () => {
  it('runs without failing if callback not provided', () => {
    const socket = mockSocket()
    // @ts-ignore
    ChangeUserState(socket, null, null)
    expect(true).toBe(true)
  })

  describe('errors', () => {
    it('gives the correct error if the user ID does not match the session ID', () => {
      const callback = jest.fn()
      const { user } = createRoomForTesting().value!

      ChangeUserState(mockSocket('userA'), mockUser({ id: user.id, state: 'in-progress' }), callback)

      expect(callback).toHaveBeenCalledWith({
        value: null,
        error: {
          reason: 'invalid-user-id'
        }
      })
    })

    it('gives the correct error if the state is not provided', () => {
      const callback = jest.fn()
      // @ts-ignore
      ChangeUserState(mockSocket('test'), { id: 'test' }, callback)

      expect(callback).toHaveBeenCalledWith({
        value: null,
        error: {
          reason: 'missing-argument'
        }
      })
    })

    it('gives the correct error if the user is not in a room', () => {
      const callback = jest.fn()
      ChangeUserState(mockSocket('test'), { id: 'test', state: 'ready' }, callback)

      expect(callback).toHaveBeenCalledWith({
        value: null,
        error: {
          reason: 'user-not-in-room'
        }
      })
    })

    describe('requested state is not possible given the room state', () => {
      const invalidStates: { [key in RoomState]: UserState[] } = {
        'complete': ['failed', 'in-progress'],
        'in-progress': ['not-ready', 'ready'],
        'waiting': ['in-progress', 'complete', 'failed']
      }
      
      Object.keys(invalidStates).forEach(roomState => {
        invalidStates[roomState as RoomState].forEach(userState => {
          it(`gives the correct error when requesting ${userState} and the room state is ${roomState}`, () => {
            const { user, room } = createRoomForTesting().value!
            state.updateRoom(room.id, { state: roomState as RoomState })

            const callback = jest.fn()
            ChangeUserState(mockSocket(user.id), { id: user.id, state: userState }, callback)

            expect(callback).toHaveBeenCalledWith({
              value: null,
              error: {
                reason: 'invalid-state'
              }
            })
          })
        })
      })
    })
  })

  it('changes the user state in the state', () => {
    const { user, room } = createRoomForTesting().value!
    // Make sure that not all users will be in the ready state
    state.addUserToRoom(room.id, mockUser({ id: 'ADDITIONAL_USER' }))

    ChangeUserState(mockSocket(user.id), { id: user.id, state: 'ready' }, () => {})

    expect(state.getRoom(room.id)!.users[0].state).toBe('ready')
  })

  it('emits an event to all other users in the room to change the user state', () => {
    const { user, room } = createRoomForTesting().value!
    const socket = mockSocket()

    ChangeUserState(socket, { id: user.id, state: 'ready' }, () => {})

    expect(socket.broadcast.to).toHaveBeenCalledWith(room.id)
    expect(socket.broadcast.to(room.id).emit).toHaveBeenCalledWith(
      'change-user-data',
      { id: user.id, state: 'ready' }
    )
  })

  describe('all users will be in the ready state', () => {
    function init(socket = mockSocket('userB')) {
      const { room, user } = createRoomForTesting(mockUser({ id: 'userA' }), mockSocket('userA')).value!
      state.updateUser(user.id, { state: 'ready' })
      state.addUserToRoom(room.id, mockUser({ id: socket.id }))

      ChangeUserState(socket, { id: socket.id, state: 'ready' }, () => {})

      return { room }
    }

    it('sets the room state to in-progress in the state', () => {
      const { room } = init()

      expect(state.getRoom(room.id)!.state).toBe('in-progress')
    })

    it('emits a change room event with the in-progress state to all users in the room', () => {
      const socket = mockSocket('userB')
      const { room } = init(socket)

      expect(socket.broadcast.to).toHaveBeenCalledWith(room.id)
      expect(socket.broadcast.to(room.id).emit).toHaveBeenCalledWith(
        'change-room-data',
        { state: 'in-progress' }
      )
    })

    it('sets all user scores to 0 and states to in-progress in the state', () => {
      const { room } = init()

      const allUsersSetCorrectly = state.getRoom(room.id)!.users.every(u => (
        u.state === 'in-progress' &&
        u.score?.cursorPosition.letter === 0 &&
        u.score.cursorPosition.word === 0 &&
        u.score.netWPM === 0
      ))
      expect(allUsersSetCorrectly).toBeTruthy()
    })

    it('emits a change all users event with the new state and score to all users in the room', () => {
      const socket = mockSocket('userB')
      const { room } = init(socket)

      expect(socket.broadcast.to).toHaveBeenCalledWith(room.id)
      expect(socket.broadcast.to(room.id).emit).toHaveBeenCalledWith(
        'change-all-user-data',
        { state: 'in-progress', score: INITIAL_USER_SCORE }
      )
    })
  })

  describe('all users will be in the complete or failed state and the room state is in-progress', () => {
    function init(socket = mockSocket('userB')) {
      const { room, user } = createRoomForTesting(mockUser({ id: 'userA' }), mockSocket('userA')).value!
      state.updateRoom(room.id, { state: 'in-progress' })
      state.updateUser(user.id, { state: 'failed', score: INITIAL_USER_SCORE })
      state.addUserToRoom(room.id, mockUser({ id: socket.id, state: 'in-progress', score: INITIAL_USER_SCORE }))

      ChangeUserState(socket, { id: socket.id, state: 'complete' }, () => {})

      return { room }
    }

    it('sets the room state to complete', () => {
      const { room } = init()

      expect(state.getRoom(room.id)!.state).toBe('complete')
    })

    it('emits a change room event with the complete state to all users in the room', () => {
      const socket = mockSocket('userB')
      const { room } = init(socket)

      expect(socket.broadcast.to).toHaveBeenCalledWith(room.id)
      expect(socket.broadcast.to(room.id).emit).toHaveBeenCalledWith(
        'change-room-data',
        { state: 'complete' }
      )
    })
  })

  describe('all users are in the complete or failed state and the new state is not-ready', () => {
    function init(socket = mockSocket('userB')) {
      const { room, user } = createRoomForTesting(mockUser({ id: 'userA' }), mockSocket('userA')).value!
      state.updateRoom(room.id, { state: 'complete' })
      state.updateUser(user.id, { state: 'failed', score: INITIAL_USER_SCORE })
      state.addUserToRoom(room.id, mockUser({ id: socket.id, state: 'complete', score: INITIAL_USER_SCORE }))

      ChangeUserState(socket, { id: socket.id, state: 'not-ready' }, () => {})

      return { room }
    }

    it('generates a new test in the state', () => {
      const { room } = init()

      expect(room.test).not.toBe(state.getRoom(room.id)!.test)
    })

    it('changes the room state to waiting in the state', () => {
      const { room } = init()

      expect(state.getRoom(room.id)!.state).toBe('waiting')
    })

    it('emits a change room event with the waiting state and new test to all users in the room', () => {
      const socket = mockSocket()
      const { room } = init(socket)

      const { test: updatedTest } = state.getRoom(room.id)!

      expect(socket.broadcast.to).toHaveBeenCalledWith(room.id)
      expect(socket.broadcast.to(room.id).emit).toHaveBeenCalledWith(
        'change-room-data',
        { state: 'waiting', test: updatedTest }
      )
    })
  })

  it('calls the callback with the new state', () => {
    const callback = jest.fn()
    const socket = mockSocket()

    const { room, user } = createRoomForTesting().value!
    ChangeUserState(socket, { id: user.id, state: 'ready' }, callback)

    expect(callback).toHaveBeenLastCalledWith({
      value: { state: 'ready' },
      error: null
    })
  })
})