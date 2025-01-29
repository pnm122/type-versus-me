import { User } from '../../User'
import { Return } from '../../Return'

type Payload = Pick<User, 'socketId' | 'username'>

type Callback = (
	value: Return<
		Pick<User, 'username'>,
		| 'missing-argument'
		| 'invalid-user-id'
		| 'invalid-username'
		| 'username-taken'
		| 'user-not-in-room'
	>
) => void

export type { Payload as ChangeUsernamePayload, Callback as ChangeUsernameCallback }
