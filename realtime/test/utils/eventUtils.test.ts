import CustomSocket from "@/types/CustomSocket"
import { check, isValidEventAndPayload } from "@/utils/eventUtils"

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