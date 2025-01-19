import { RoomSettings } from '$shared/types/Room'
import { prisma } from '@/prisma'
import { UserStats } from '@/types/Database'
import { Prisma } from '@prisma/client'

export async function getUser(id: string) {
	try {
		return await prisma.user.findUnique({
			where: { id }
		})
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`${e.code}:`, e.message)
		}
		console.error(e)
		return null
	}
}

export async function getUserStats(
	id: string,
	filter: { category?: RoomSettings['category'][]; minWords?: number; maxWords?: number }
): Promise<UserStats | null> {
	const where = {
		userId: id,
		race: {
			category: { in: filter.category },
			numWords: {
				gte: filter.minWords,
				lte: filter.maxWords
			}
		}
	}

	try {
		const { _avg, _max, _count } = await prisma.score.aggregate({
			where,
			_avg: {
				netWPM: true
			},
			_max: {
				netWPM: true
			},
			_count: {
				raceId: true,
				isWinner: true
			}
		})

		const wordsTyped = (
			await prisma.score.findMany({
				where,
				select: {
					race: {
						select: {
							numWords: true
						}
					}
				}
			})
		).reduce((sum, curr) => sum + curr.race.numWords, 0)

		return {
			wordsTyped,
			maxWPM: _max.netWPM ?? -1,
			avgWPM: _avg.netWPM ?? -1,
			racesPlayed: _count.raceId ?? -1,
			racesWon: _count.isWinner ?? -1
		}
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`${e.code}:`, e.message)
		}
		console.error(e)
		return null
	}
}

export async function getUserScores(
	id: string,
	page: number,
	itemsPerPage: number,
	filter: { category?: RoomSettings['category'][]; minWords?: number; maxWords?: number }
) {
	const where = {
		userId: id,
		race: {
			category: { in: filter.category },
			numWords: {
				gte: filter.minWords,
				lte: filter.maxWords
			}
		}
	}

	try {
		return await prisma.score.findMany({
			where,
			skip: page * itemsPerPage,
			take: itemsPerPage,
			orderBy: {
				race: {
					startTime: 'desc'
				}
			},
			include: {
				race: true
			}
		})
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`${e.code}:`, e.message)
		}
		console.error(e)
		return null
	}
}
