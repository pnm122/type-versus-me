import { User } from '../../User'

type Payload = Partial<Omit<User, 'id'>>

export type {
  Payload as ChangeAllUserDataPayload
}