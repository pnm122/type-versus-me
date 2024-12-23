type ErrorsOf<F> = F extends (value: infer R) => void
	? R extends { error: { reason: infer E } }
		? E
		: never
	: never

export default ErrorsOf
