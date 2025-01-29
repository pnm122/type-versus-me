import { Room } from '$shared/types/Room'
import { Return } from '../../Return'

type Payload = string

type Callback = (value: Return<Room | null, 'missing-argument'>) => void

export type { Payload as GetRoomPayload, Callback as GetRoomCallback }
