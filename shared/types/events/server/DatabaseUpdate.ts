import { User as DatabaseUser } from '@prisma/client'

type Payload = DatabaseUser

export type { Payload as DatabaseUpdatePayload }
