import { prisma } from '@/prisma'
import { Prisma, Score } from '@prisma/client'

export async function createScores(data: Omit<Score, 'id'>[]): Promise<{
	data: Prisma.BatchPayload | null
	error: Prisma.PrismaClientKnownRequestError | null
}> {
	try {
		const res = await prisma.score.createMany({
			data
		})

		return {
			data: res,
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
