import { User } from '../../User'

type Payload = Partial<Omit<User, 'id' | 'username' | 'color'>>

export type { Payload as ChangeAllUserDataPayload }
