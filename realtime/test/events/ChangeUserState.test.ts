import ChangeUserState from "@/events/ChangeUserState"
import { createRoomForTesting, mockSocket, mockUser } from "../test-utils"
import { UserState } from "$shared/types/User"
import { Room, RoomState } from "$shared/types/Room"
import state from "@/global/state"

const socket = mockSocket()

describe('RequestColor', () => {
  it('runs without failing if callback not provided', () => {
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

  it.todo('changes the user state in the state')

  it.todo('emits an event to all other users in the room to change the user state')

  describe('all users will be in the ready state', () => {
    it.todo('sets the room state to in-progress in the state')

    it.todo('emits a change room event with the in-progress state to all users in the room')

    it.todo('sets all user scores to 0 and states to in-progress in the state')

    it.todo('emits a change user event with the new state and score to all users in the room')
  })

  describe('all users will be in the complete or failed state', () => {
    it.todo('sets the room state to complete')

    it.todo('emits a change room event with the complete state to all users in the room')
  })

  describe('all users are in the complete or failed state and the new state is not-ready', () => {
    it.todo('generates a new test in the state')

    it.todo('changes the room state to waiting in the state')

    it.todo('emits a change room event with the waiting state and new test to all users in the room')
  })

  it.todo('calls the callback with the new state')
})