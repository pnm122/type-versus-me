import { User } from '../../User'
import { Return } from '../../Return'

type Payload = Required<Pick<User, 'socketId' | 'state'>>

type Callback = (
	value: Return<
		Required<Pick<User, 'state'>>,
		'missing-argument' | 'invalid-user-id' | 'invalid-state' | 'user-not-in-room' | 'database-error'
	>
) => void

export type { Payload as ChangeUserStatePayload, Callback as ChangeUserStateCallback }
