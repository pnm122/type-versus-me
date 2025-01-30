import { User } from '../../User'
import { Return } from '../../Return'

type Payload = Pick<User, 'socketId' | 'color'>

type Callback = (
	value: Return<
		Pick<User, 'color'>,
		'missing-argument' | 'invalid-user-id' | 'invalid-color' | 'user-not-in-room'
	>
) => void

export type { Payload as RequestColorPayload, Callback as RequestColorCallback }
