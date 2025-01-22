'use server'

import { CursorColor } from '$shared/types/Cursor'
import { RoomSettings } from '$shared/types/Room'
import { prisma } from '@/prisma'
import { UserStats } from '@/types/Database'
import { Prisma, User } from '@prisma/client'

export async function getUser(
	id: string
): Promise<{ data: User | null; error: Prisma.PrismaClientKnownRequestError | null }> {
	try {
		const data = await prisma.user.findUnique({
			where: { id }
		})
		return {
			data,
			error: null
		}
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return {
				data: null,
				error
			}
		}
		return {
			data: null,
			error: null
		}
	}
}

export async function getUserStats(
	id: string,
	filter: { category?: RoomSettings['category'][]; minWords?: number; maxWords?: number }
): Promise<{ data: UserStats | null; error: Prisma.PrismaClientKnownRequestError | null }> {
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
			data: {
				wordsTyped,
				maxWPM: _max.netWPM ?? -1,
				avgWPM: _avg.netWPM ?? -1,
				racesPlayed: _count.raceId ?? -1,
				racesWon: _count.isWinner ?? -1
			},
			error: null
		}
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			return {
				data: null,
				error: e
			}
		}
		return {
			data: null,
			error: null
		}
	}
}

export async function getUserScores(
	id: string,
	page: number,
	itemsPerPage: number,
	filter: { category?: RoomSettings['category'][]; minWords?: number; maxWords?: number }
): Promise<{
	data:
		| Prisma.ScoreGetPayload<{
				include: {
					race: {
						include: {
							scores: true
						}
					}
				}
		  }>[]
		| null
	error: Prisma.PrismaClientKnownRequestError | null
}> {
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
		const data = await prisma.score.findMany({
			where,
			skip: page * itemsPerPage,
			take: itemsPerPage,
			orderBy: {
				race: {
					startTime: 'desc'
				}
			},
			include: {
				race: {
					include: {
						scores: true
					}
				}
			}
		})

		return {
			data,
			error: null
		}
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			return {
				data: null,
				error: e
			}
		}

		return {
			data: null,
			error: null
		}
	}
}

export async function updateUser(
	id: string,
	{ username, cursorColor }: { username?: string; cursorColor: CursorColor }
): Promise<{ error: Prisma.PrismaClientKnownRequestError | null }> {
	try {
		await prisma.user.update({
			where: { id },
			data: { username, cursorColor }
		})

		return { error: null }
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return { error }
		}
		return { error: null }
	}
}
