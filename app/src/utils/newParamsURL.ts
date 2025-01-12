import { ReadonlyURLSearchParams } from 'next/navigation'

export default function newParamsURL<T extends string>(
	current: ReadonlyURLSearchParams,
	key: string,
	value: T | T[]
) {
	const params = new URLSearchParams(current.toString())
	params.delete(key)
	if (typeof value === 'string') {
		params.append(key, value)
	} else {
		value.forEach((v) => params.append(key, v))
	}

	return `?${params.toString()}`
}
