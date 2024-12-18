import DoesRoomExist from "@/events/DoesRoomExist"
import { createRoomForTesting } from "../test-utils"

describe('DoesRoomExist', () => {
  it('runs without failing if callback not provided', () => {
    // @ts-ignore
    DoesRoomExist(null, null)
    expect(true).toBe(true)
  })

  it('gives the correct error if no room ID was provided', () => {
    const callback = jest.fn()
    // @ts-ignore
    DoesRoomExist(null, callback)

    expect(callback).toHaveBeenCalledWith({
      value: null,
      error: {
        reason: 'missing-argument'
      }
    })
  })

  it('gives true if the room exists', () => {
    const { room } = createRoomForTesting().value!
    const callback = jest.fn()

    DoesRoomExist(room.id, callback)

    expect(callback).toHaveBeenCalledWith({
      value: true,
      error: null
    })
  })

  it('gives false if the room does not', () => {
    createRoomForTesting()
    const callback = jest.fn()

    DoesRoomExist('INVALID_ID', callback)

    expect(callback).toHaveBeenCalledWith({
      value: false,
      error: null
    })
  })
})