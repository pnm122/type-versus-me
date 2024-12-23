import { Word, WordRegion, WordRegionType } from '@/types/Typer'

export function getCursorPosition(typed: string) {
	return {
		word: Math.max(words(typed).length - 1, 0),
		letter: typed === '' ? 0 : words(typed).at(-1)!.length
	}
}

/**
 * Split a piece of text into words
 */
export function words(str: string) {
	return str.split(' ')
}

export function getTextRegions(text: string, typed: string) {
	return words(text).reduce<Word[]>((acc, word, index, arr) => {
		const typedWords = words(typed)
		const isNotLastWordAndCorrect = index < typedWords.length - 1 && word === typedWords[index]
		const isLastWordAndCorrect = index === arr.length - 1 && word === typedWords[index]
		return [
			...acc,
			{
				correct: isNotLastWordAndCorrect || isLastWordAndCorrect,
				regions: getWordRegions(word, typedWords[index]),
				// Add one to account for spaces between words
				start: acc.reduce((a, curr) => a + getWordLength(curr) + 1, 0),
				distanceToCurrent: typedWords.length - 1 - index
			}
		]
	}, [])
}

function getWordRegions(word: string, compare: string | undefined): WordRegion[] {
	if (!compare) {
		return [
			{
				type: 'untyped',
				text: word
			}
		]
	}

	return Array(Math.max(word.length, compare.length))
		.fill(null)
		.reduce<WordRegion[]>((acc, _, index) => {
			const wordChar = word[index]
			const compareChar = compare[index]

			const charType = getCharacterType(wordChar, compareChar)

			// Add to the last region if this character is the same type of region
			if (acc.at(-1)?.type === charType) {
				return [
					...acc.slice(0, -1),
					{
						type: acc.at(-1)!.type,
						text: `${acc.at(-1)!.text}${charType === 'extra' ? compareChar : wordChar}`
					}
				]
			}

			return [
				...acc,
				{
					type: charType,
					text: charType === 'extra' ? compareChar : wordChar
				}
			]
		}, [])
}

function getWordLength(word: Word) {
	return word.regions.reduce((acc, region) => acc + region.text.length, 0)
}

function getCharacterType(
	original: string | undefined,
	compare: string | undefined
): WordRegionType {
	if (!original) {
		return 'extra'
	} else if (!compare) {
		return 'untyped'
	} else if (original === compare) {
		return 'correct'
	} else {
		return 'incorrect'
	}
}
