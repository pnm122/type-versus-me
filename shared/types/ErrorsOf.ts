import { Return } from './Return'

type ErrorsOf<Callback extends (value: Return<any, any>) => void> = Parameters<Callback>[0]['error']

export default ErrorsOf