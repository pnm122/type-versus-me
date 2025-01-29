import { User } from '../../User'

type Payload = Partial<Omit<User, 'socketId' | 'username' | 'color'>>

export type { Payload as ChangeAllUserDataPayload }
