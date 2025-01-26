import { getUserStats } from '$shared/utils/database/user'
import StatsContentClient from './StatsContentClient'
import { RoomSettings } from '$shared/types/Room'

interface Props {
	filters: {
		category: RoomSettings['category'][]
		minWords: number
		maxWords: number
	}
	userId: string
}

export default async function StatsContentServer({ filters, userId }: Props) {
	const { data: stats } = await getUserStats(userId, filters)

	return <StatsContentClient stats={stats} />
}
