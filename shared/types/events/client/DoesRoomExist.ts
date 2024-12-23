import { Return } from '../../Return'

type Payload = string

type Callback = (value: Return<boolean, 'missing-argument'>) => void

export type { Payload as DoesRoomExistPayload, Callback as DoesRoomExistCallback }
