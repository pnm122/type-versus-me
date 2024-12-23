type Data<T, K = string> =
	| {
			state: 'loading'
			value: null
			error: null
	  }
	| {
			state: 'valid'
			value: T
			error: null
	  }
	| {
			state: 'error'
			value: null
			error: K
	  }

export default Data
