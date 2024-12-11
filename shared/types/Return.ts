export type Return<Value = any, E extends ErrorReason = ErrorReason, ErrorDetails = any> = {
  value: Value, error: null
} | {
  value: null, error: Error<E, ErrorDetails>
}

export type Error<R extends ErrorReason, Details = any> = {
  reason: R
  details?: Details
}

// Provide some shared reasons to try and use the same names for the same things,
// But allow any string
export type ErrorReason =
  | 'missing-argument'
  | 'invalid-user-id'
  | 'invalid-username'
  | 'invalid-color'
  | 'user-in-room-already'
  | 'user-not-in-room'
  | 'max-rooms-created'
  | string & {}