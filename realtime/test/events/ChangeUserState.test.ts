import ChangeUserState from "@/events/ChangeUserState"
import { createRoomForTesting, ioSpies, mockSocket, mockUser } from "../test-utils"
import { UserState } from "$shared/types/User"
import { Room, RoomState } from "$shared/types/Room"
import state from "@/global/state"
import { INITIAL_USER_SCORE } from "$shared/constants"
import * as eventUtils from "@/utils/eventUtils"

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
    const { inSpy, emitSpy } = ioSpies()
    const { user, room } = createRoomForTesting().value!
    const socket = mockSocket()

    ChangeUserState(socket, { id: user.id, state: 'ready' }, () => {})

    expect(inSpy).toHaveBeenCalledWith(room.id)
    expect(emitSpy).toHaveBeenCalledWith(
      'change-user-data',
      { id: user.id, state: 'ready' }
    )
  })

  it('sets the room to in progress if all users will be in the ready state', () => {
    const spy = jest.spyOn(eventUtils, 'setRoomToInProgress')
    const { room, user } = createRoomForTesting().value!
    const socket = mockSocket(user.id)

    ChangeUserState(socket, { id: user.id, state: 'ready' }, () => {})

    expect(spy).toHaveBeenCalledWith(
      room.id
    )
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
      const { inSpy, emitSpy } = ioSpies()
      const { room } = init(socket)

      expect(inSpy).toHaveBeenCalledWith(room.id)
      expect(emitSpy).toHaveBeenCalledWith(
        'change-room-data',
        { state: 'complete' }
      )
    })

    it('emits a change all user data event with the not-ready state to all users in the room', () => {
      const socket = mockSocket('userB')
      const { inSpy, emitSpy } = ioSpies()
      const { room } = init(socket)

      expect(inSpy).toHaveBeenCalledWith(room.id)
      expect(emitSpy).toHaveBeenCalledWith(
        'change-all-user-data',
        { state: 'not-ready' }
      )
    })
  })

  it('calls the callback with the new state', () => {
    const callback = jest.fn()
    const socket = mockSocket()

    const { user } = createRoomForTesting().value!
    ChangeUserState(socket, { id: user.id, state: 'ready' }, callback)

    expect(callback).toHaveBeenLastCalledWith({
      value: { state: 'ready' },
      error: null
    })
  })
})