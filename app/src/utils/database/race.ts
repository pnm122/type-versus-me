import { prisma } from '@/prisma'
import { Prisma, Race } from '@prisma/client'

export async function createRace(
	data: Omit<Race, 'id'>
): Promise<{ data: Race | null; error: Prisma.PrismaClientKnownRequestError | null }> {
	try {
		const res = await prisma.race.create({
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
