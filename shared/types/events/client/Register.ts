import { Return } from '../../Return'
import { User } from '../../User'

type Payload = Partial<Pick<User, 'username' | 'color'>>

type Callback = (value: Return<User, 'invalid-username' | 'invalid-color'>) => void

export type { Payload as RegisterPayload, Callback as RegisterCallback }
