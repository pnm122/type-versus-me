type Data<T, K = string> = {
  state: 'loading'
  data: null
  error: null
} | {
  state: 'valid'
  data: T
  error: null
} | {
  state: 'error'
  data: null
  error: K
}

export default Data