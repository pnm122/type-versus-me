import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation'

export default function useSafeParams<T extends { [key: string]: any }>(
	validators: {
		[key in keyof T]: (value: string[]) => T[key]
	},
	afterAll: (value: T) => T = (value) => value
): [T, ReadonlyURLSearchParams] {
	const searchParams = useSearchParams()

	const params = Object.keys(validators).map((key) => {
		const values = searchParams.getAll(key)
		return [key, validators[key](values)]
	})

	return [afterAll(Object.fromEntries(params)), searchParams]
}
