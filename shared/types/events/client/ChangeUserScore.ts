import { User } from '../../User'
import { Return } from '../../Return'

type Payload = Pick<Required<User>, 'id' | 'score'>

type Callback = (
	value: Return<
		Pick<Required<User>, 'score'>,
		'missing-argument' | 'invalid-user-id' | 'invalid-room-state' | 'user-not-in-room'
	>
) => void

export type { Payload as ChangeUserScorePayload, Callback as ChangeUserScoreCallback }
