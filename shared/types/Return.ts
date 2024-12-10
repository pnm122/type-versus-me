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
  | 'invalid-user-id'
  | 'username-not-provided'
  | 'color-not-provided'
  | 'user-in-room-already'
  | 'user-not-in-room'
  | string & {}