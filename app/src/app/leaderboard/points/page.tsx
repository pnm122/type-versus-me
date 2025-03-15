import LeaderboardPointsPage from '@/components/page/leaderboard/LeaderboardPointsPage/LeaderboardPointsPage'
import { LeaderboardPointsParams, transformItemsPerPageParam, transformPageParam } from './params'
import { getTopUsersByPoints } from '$shared/utils/database/user'
import { Prisma } from '@prisma/client'
import { Suspense } from 'react'

export default async function LeaderboardPoints({
	searchParams: _searchParams
}: {
	searchParams: Promise<Record<LeaderboardPointsParams, string | string[]>>
}) {
	const searchParams = await _searchParams

	return (
		<Suspense fallback={<LeaderboardPointsLoading />}>
			<LeaderboardPointsInner searchParams={searchParams} />
		</Suspense>
	)
}

async function LeaderboardPointsInner({
	searchParams
}: {
	searchParams: Record<LeaderboardPointsParams, string | string[]>
}) {
	const page = transformPageParam(searchParams.page)
	const itemsPerPage = transformItemsPerPageParam(searchParams.itemsPerPage)
	const { data, error } = await getTopUsersByPoints(page, itemsPerPage)

	if (error || !data) {
		return <LeaderboardPointsError error={error} />
	}

	return (
		<LeaderboardPointsPage
			leaderboard={data.users}
			totalUserCount={data.totalCount}
			page={page}
			itemsPerPage={itemsPerPage}
		/>
	)
}

function LeaderboardPointsLoading() {
	return <p>Loading...</p>
}

function LeaderboardPointsError({
	// eslint-disable-next-line
	error
}: {
	error: Prisma.PrismaClientKnownRequestError | null
}) {
	return <div>error</div>
}
