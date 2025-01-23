import { User } from '../../User'

type Payload = Partial<User> & Pick<User, 'socketId'>

export type { Payload as ChangeUserDataPayload }
