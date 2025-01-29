import { MAX_TEST_WORDS, MIN_TEST_WORDS } from '$shared/constants'
import useSafeParams from './useSafeParams'

export default function useNumWordsParams<T extends string, K extends string>(
	minWordsKey: T,
	maxWordsKey: K
) {
	function isNumWordsValid(value: string[], def: number) {
		const min = parseInt(value[0])
		if (Number.isNaN(min) || min < MIN_TEST_WORDS || min > MAX_TEST_WORDS) return def
		return min
	}

	return useSafeParams(
		{
			[minWordsKey]: (value) => isNumWordsValid(value, MIN_TEST_WORDS),
			[maxWordsKey]: (value) => isNumWordsValid(value, MAX_TEST_WORDS)
		},
		(value) => ({
			...value,
			[minWordsKey]:
				value[minWordsKey] > value[maxWordsKey] ? value[maxWordsKey] : value[minWordsKey]
		})
	)
}
