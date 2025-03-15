import { ReadonlyURLSearchParams } from 'next/navigation'

export default function newParamsURL<
	T extends { [key: string]: string | number | (string | number)[] | undefined }
>(current: ReadonlyURLSearchParams, params: T) {
	const newParams = new URLSearchParams(current.toString())

	Object.keys(params).forEach((key) => {
		const value = params[key]
		if (value === undefined) return

		newParams.delete(key)

		if (typeof value === 'string' || typeof value === 'number') {
			newParams.append(key, value.toString())
		} else {
			value.forEach((v) => newParams.append(key, v.toString()))
		}
	})

	return `?${newParams.toString()}`
}
