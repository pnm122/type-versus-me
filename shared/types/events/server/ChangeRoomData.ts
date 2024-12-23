import { RoomMetadata } from '../../Room'

type Payload = Partial<Omit<RoomMetadata, 'id'>>

export type { Payload as ChangeRoomDataPayload }
