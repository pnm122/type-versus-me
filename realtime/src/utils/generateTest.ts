import { RoomSettings } from '$shared/types/Room'
import { getAllFilesIn, getFileSize, readAllLines, readSome } from './files'

export default async function generateTest({
	category,
	numWords
}: Pick<RoomSettings, 'category' | 'numWords'>) {
	if (category === 'quote') return generateQuoteTest(numWords)

	const words = (await readAllLines(__dirname, '..', '..', 'static', 'top-words.txt')).filter(
		(l) => !l.startsWith('#')
	)

	return Array(numWords)
		.fill(null)
		.map(() => words[Math.round(Math.random() * (category === 'top-100' ? 99 : words.length - 1))])
		.join(' ')
}

async function generateQuoteTest(numWords: number) {
	const textsDirectory = [__dirname, '..', '..', 'static', 'texts']
	const texts = (await getAllFilesIn(...textsDirectory)).filter((t) => t.endsWith('.txt'))
	console.log(texts)
	if (texts.length === 0) {
		return 'ERROR'
	}
	const randomFile = texts[Math.round(Math.random() * (texts.length - 1))]!
	const fileSize = await getFileSize(...textsDirectory, randomFile)

	// For any kind of reasonable numWords, this will be < fileSize
	// Retrieve more than enough bytes of the text to get words from
	// Assumes that the average length of words will be less than or equal to 16 bytes
	const sizeToRetrieve = Math.min(numWords * 16, fileSize)
	// Latest point in the text where the start could be without overflowing the size of the file
	const maxStart = fileSize - sizeToRetrieve
	const start = Math.round(Math.random() * maxStart)

	const data = await readSome(start, start + sizeToRetrieve, ...textsDirectory, randomFile)
	const invalidCharacters = /[^\x20-\x7F]/g
	// TODO: Preformat texts so this doesn't need to be done here
	const formattedData = data
		// replace unicode single quotes with ASCII single quotes
		.replaceAll(/’/g, "'")
		// replace unicode double quotes with ASCII double quotes
		.replaceAll(/[\u{201C}\u{201D}]/gu, '"')
		// replace a sequence of newlines/tabs with a single space
		.replaceAll(/[\r\n\t]+/g, ' ')
		// replace 2+ consecutive spaces with a single space
		.replaceAll(/[ ]{2,}/g, ' ')
		// remove invalid characters
		.replaceAll(invalidCharacters, '')

	// Remove the first word, since it'll often be part of a word
	return formattedData
		.split(' ')
		.slice(1, 1 + numWords)
		.join(' ')
}
