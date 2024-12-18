import CustomSocket from "@/types/CustomSocket"
import { check, isValidEventAndPayload, setRoomToInProgress } from "@/utils/eventUtils"
import { createRoomForTesting, mockSocket, mockUser } from "../test-utils"
import state from "@/global/state"
import { INITIAL_USER_SCORE } from "@/constants"

const socket = {
  id: 'TEST_ID'
} as CustomSocket

describe('isValidEventAndPayload', () => {
  it('returns false if no callback is provided', () => {
    expect(
      // @ts-ignore
      isValidEventAndPayload(socket, undefined, socket.id)
    ).toBeFalsy()
  })

  it('returns false if an expected value is falsy', () => {
    expect(
      isValidEventAndPayload(socket, () => {}, socket.id, 'test', null)
    ).toBeFalsy()
  })

  it('returns false if the socket ID does not match the user ID', () => {
    expect(
      isValidEventAndPayload(socket, () => {}, 'wrong ID', 'test 1', 'test 2')
    ).toBeFalsy()
  })

  it('returns true if socket ID === user ID, callback is valid, and expected values are truthy', () => {
    expect(
      isValidEventAndPayload(socket, () => {}, socket.id, 'test 1', 'test 2')
    ).toBeTruthy()
  })
})

describe('check', () => {
  it('calls callback with the correct format and reason if the condition is truthy', () => {
    const callback = jest.fn()
    check(true, 'reason', callback)
    expect(callback).toHaveBeenLastCalledWith({
      value: null,
      error: {
        reason: 'reason'
      }
    })
  })

  it('does not call callback if the condition is falsy', () => {
    const callback = jest.fn()
    check(false, 'reason', callback)
    expect(callback).not.toHaveBeenCalled()
  })

  it('returns true if the condition is truthy', () => {
    expect(check('test', '', () => {})).toBeTruthy()
  })

  it('returns false if the condition is falsy', () => {
    expect(check(null, '', () => {})).toBeFalsy()
  })
})

describe('setRoomToInProgress', () => {
  function init() {
    const { room } = createRoomForTesting().value!
    state.addUserToRoom(room.id, mockUser({ id: 'userB' }))

    return { room }
  }

  it('sets the room state to in-progress in the state', () => {
    const { room } = init()

    setRoomToInProgress(room.id, mockSocket())

    expect(state.getRoom(room.id)!.state).toBe('in-progress')
  })

  it('emits a change room event with the in-progress state and new test to all users in the room', () => {
    const socket = mockSocket()
    const { room } = init()

    setRoomToInProgress(room.id, socket)

    expect(socket.in).toHaveBeenCalledWith(room.id)
    expect(socket.in(room.id).emit).toHaveBeenCalledWith(
      'change-room-data',
      { state: 'in-progress', test: expect.any(String) }
    )
  })

  it('sets all user scores to 0 and states to in-progress in the state', () => {
    const { room } = init()

    setRoomToInProgress(room.id, mockSocket())

    const allUsersSetCorrectly = state.getRoom(room.id)!.users.every(u => (
      u.state === 'in-progress' &&
      u.score?.cursorPosition.letter === 0 &&
      u.score.cursorPosition.word === 0 &&
      u.score.netWPM === 0
    ))
    expect(allUsersSetCorrectly).toBeTruthy()
  })

  it('emits a change all users event with the new state and score to all users in the room', () => {
    const socket = mockSocket()
    const { room } = init()

    setRoomToInProgress(room.id, socket)

    expect(socket.in).toHaveBeenCalledWith(room.id)
    expect(socket.in(room.id).emit).toHaveBeenCalledWith(
      'change-all-user-data',
      { state: 'in-progress', score: INITIAL_USER_SCORE }
    )
  })
})