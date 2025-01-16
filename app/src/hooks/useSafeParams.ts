import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation'

/**
 * Retrieve search params and transform them, so they can be exactly what you expect.
 * @param transformer Map of param keys to functions that transform the value from the URL to the value returned from the function.
 * @param afterAll Optional function that runs after all values have been transformed. Useful when you need to know what the other parameters are.
 * @returns `[transformed params, all unmodified search params]`
 */
export default function useSafeParams<T extends { [key: string]: any }>(
	transformer: {
		[key in keyof T]: (value: string[]) => T[key]
	},
	afterAll: (value: T) => T = (value) => value
): [T, ReadonlyURLSearchParams] {
	const searchParams = useSearchParams()

	const params = Object.keys(transformer).map((key) => {
		const values = searchParams.getAll(key)
		return [key, transformer[key](values)]
	})

	return [afterAll(Object.fromEntries(params)), searchParams]
}
