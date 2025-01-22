import { getUserStats } from '@/utils/database/user'
import StatsContentClient from './StatsContentClient'
import { RoomSettings } from '$shared/types/Room'
import { User } from 'next-auth'

interface Props {
	filters: {
		category: RoomSettings['category'][]
		minWords: number
		maxWords: number
	}
	user: User
}

export default async function StatsContentServer({ filters, user }: Props) {
	const { data: stats } = await getUserStats(user.id!, filters)

	return <StatsContentClient stats={stats} />
}
