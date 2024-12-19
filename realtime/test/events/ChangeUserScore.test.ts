import ChangeUserScore from "@/events/ChangeUserScore"
import { createRoomForTesting, mockSocket, mockUser } from "../test-utils"
import { INITIAL_USER_SCORE } from "$shared/constants"
import state from "@/global/state"
import { RoomState } from "$shared/types/Room"

describe('ChangeUserScore', () => {
  it('runs without failing if callback not provided', () => {
    // @ts-ignore
    ChangeUserScore(mockSocket(), null, null)
    expect(true).toBe(true)
  })

  describe('errors', () => {
    it('gives the correct error if the user ID does not match the session ID', () => {
      const callback = jest.fn()
      ChangeUserScore(mockSocket('userA'), { id: 'userB', score: INITIAL_USER_SCORE }, callback)

      expect(callback).toHaveBeenCalledWith({
        value: null,
        error: {
          reason: 'invalid-user-id'
        }
      })
    })

    it('gives the correct error if the score is not provided', () => {
      const callback = jest.fn()
      // @ts-ignore
      ChangeUserScore(mockSocket('test'), { id: 'test' }, callback)

      expect(callback).toHaveBeenCalledWith({
        value: null,
        error: {
          reason: 'missing-argument'
        }
      })
    })

    it('gives the correct error if the user is not in a room', () => {
      const callback = jest.fn()
      const { room } = createRoomForTesting().value!
      state.updateRoom(room.id, { state: 'in-progress' })
      ChangeUserScore(mockSocket('userB'), { id: 'userB', score: INITIAL_USER_SCORE }, callback)

      expect(callback).toHaveBeenCalledWith({
        value: null,
        error: {
          reason: 'user-not-in-room'
        }
      })
    });

    ['waiting', 'complete'].map(roomState => {
      it(`gives the correct error if the room state is ${roomState}`, () => {
        const callback = jest.fn()
        const { room, user } = createRoomForTesting().value!
        state.updateRoom(room.id, { state: roomState as RoomState })
        ChangeUserScore(mockSocket(user.id), { id: user.id, score: { ...INITIAL_USER_SCORE, netWPM: 100 }}, callback)

        expect(callback).toHaveBeenCalledWith({
          value: null,
          error: {
            reason: 'invalid-room-state'
          }
        })
      })
    })
  })

  it('changes the score in the state', () => {
    const { room, user } = createRoomForTesting().value!
    state.updateRoom(room.id, { state: 'in-progress' })
    const newScore = { ...INITIAL_USER_SCORE, netWPM: 100 }
    ChangeUserScore(mockSocket(user.id), { id: user.id, score: newScore }, () => {})

    expect(state.getUserInRoom(room.id, user.id)!.score).toEqual(newScore)
  })

  it('tells all other users in the room that the user score has changed', () => {
    const { room, user } = createRoomForTesting().value!
    const socket = mockSocket(user.id)
    state.updateRoom(room.id, { state: 'in-progress' })
    const newScore = { ...INITIAL_USER_SCORE, netWPM: 100 }
    ChangeUserScore(socket, { id: user.id, score: newScore }, () => {})

    expect(socket.broadcast.to).toHaveBeenLastCalledWith(room.id)
    expect(socket.broadcast.to(room.id).emit).toHaveBeenLastCalledWith(
      'change-user-data',
      { id: user.id, score: newScore }
    )
  })

  it('calls the callback with the new score', () => {
    const callback = jest.fn()
    const { room, user } = createRoomForTesting().value!
    state.updateRoom(room.id, { state: 'in-progress' })
    const newScore = { ...INITIAL_USER_SCORE, netWPM: 100 }
    ChangeUserScore(mockSocket(user.id), { id: user.id, score: newScore }, callback)

    expect(callback).toHaveBeenLastCalledWith({
      value: { score: newScore },
      error: null
    })
  })
})