import Register from "@/events/Register"
import { mockSocket } from "../test-utils"

const socket = mockSocket()

describe('Register', () => {
  it('runs without failing if callback not provided', () => {
    // @ts-expect-error missing parameters on purpose
    Register(socket, null, null)
    expect(true).toBe(true)
  })

  it('calls callback with a user object containing the username and color passed when valid', () => {
    const callback = jest.fn()
    const user = {
      username: 'Test',
      color: 'green'
    } as const

    Register(socket, user, callback)

    expect(callback).toHaveBeenCalledWith({
      value: {
        id: socket.id,
        ...user
      },
      error: null
    })
  })

  it('creates a username if a username is not provided', () => {
    const callback = jest.fn()
    const user = {
      color: 'green'
    } as const

    Register(socket, user, callback)

    expect(callback.mock.lastCall[0].value.username).toBeDefined()
  })

  it('creates a username if an invalid username is provided', () => {
    const callback = jest.fn()
    const user = {
      username: ''
    } as const

    Register(socket, user, callback)

    expect(callback.mock.lastCall[0].value.username).not.toBe('')
  })

  it('creates a color if a color is not provided', () => {
    const callback = jest.fn()
    const user = {
      username: 'Test'
    } as const

    Register(socket, user, callback)

    expect(callback.mock.lastCall[0].value.color).toBeDefined()
  })

  it('creates a color if an invalid color is provided', () => {
    const callback = jest.fn()
    const user = {
      color: ''
    } as const

    // @ts-expect-error invalid parameter on purpose
    Register(socket, user, callback)

    expect(callback.mock.lastCall[0].value.color).not.toBe('')
  })
})