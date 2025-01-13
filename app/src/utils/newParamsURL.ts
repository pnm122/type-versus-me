import { ReadonlyURLSearchParams } from 'next/navigation'

export default function newParamsURL<T extends { [key: string]: string | string[] }>(
	current: ReadonlyURLSearchParams,
	params: T
) {
	const newParams = new URLSearchParams(current.toString())

	Object.keys(params).forEach((key) => {
		newParams.delete(key)
		const value = params[key]

		if (typeof value === 'string') {
			newParams.append(key, value)
		} else {
			value.forEach((v) => newParams.append(key, v))
		}
	})

	return `?${newParams.toString()}`
}
