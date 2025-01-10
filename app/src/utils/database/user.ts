import { prisma } from '@/prisma'

export async function getUser(id: string) {
	return await prisma.user.findUnique({
		where: { id }
	})
}
