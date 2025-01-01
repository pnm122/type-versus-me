import debug, { DEBUG_COLORS } from './debug'
import fs from 'node:fs'
import path from 'node:path'
import util from 'node:util'

/**
 * Read all lines from a file
 */
export async function readAllLines(...pathToFile: string[]) {
	const readFile = util.promisify(fs.readFile)
	const pathToTopWords = path.join(...pathToFile)

	try {
		const data = await readFile(pathToTopWords, 'utf-8')
		return data.split(/[\n\r]+/)
	} catch (e) {
		debug(`${DEBUG_COLORS.RED}ERROR READING FILE ${pathToTopWords}:${DEBUG_COLORS.WHITE}`, e)
		return []
	}
}

/**
 * Read some data from a file.
 * @param start byte to start reading from
 * @param end byte to end reading at
 */
export async function readSome(start: number, end: number, ...pathToFile: string[]) {
	const stream = fs.createReadStream(path.join(...pathToFile), {
		encoding: 'utf-8',
		start,
		end
	})

	let resolve: () => void
	const promise = new Promise<void>((res) => (resolve = res))
	let data = ''

	stream.on('data', async (chunk) => {
		data += chunk
	})

	stream.on('end', () => {
		resolve()
	})

	await promise
	stream.close()
	return data
}

/** Get the size of a file in bytes. */
export async function getFileSize(...pathToFile: string[]) {
	const stat = util.promisify(fs.stat)
	const pathToFileString = path.join(...pathToFile)

	try {
		const file = await stat(pathToFileString)
		return file.size
	} catch (e) {
		debug(
			`${DEBUG_COLORS.RED}ERROR GETTING FILE SIZE OF ${pathToFileString}:${DEBUG_COLORS.WHITE}`,
			e
		)
		return -1
	}
}

/** Get the names of all files in a given directory. */
export async function getAllFilesIn(...pathToDirectory: string[]) {
	const readdir = util.promisify(fs.readdir)
	const pathToDirectoryString = path.join(...pathToDirectory)

	try {
		return await readdir(pathToDirectoryString)
	} catch (e) {
		debug(
			`${DEBUG_COLORS.RED}ERROR GETTING ALL FILES IN ${pathToDirectoryString}:${DEBUG_COLORS.WHITE}`,
			e
		)
		return []
	}
}
