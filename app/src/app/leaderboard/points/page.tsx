import LeaderboardPointsPage from '@/components/page/leaderboard/LeaderboardPointsPage/LeaderboardPointsPage'
import { LeaderboardPointsParams, transformItemsPerPageParam, transformPageParam } from './params'
import { getTopUsersByPoints } from '$shared/utils/database/user'
import { Suspense } from 'react'
import pageStyles from '@/components/page/leaderboard/LeaderboardPointsPage/style.module.scss'
import Pagination from '@/components/base/Pagination/Pagination'
import Table from '@/components/base/Table/Table'
import { columns } from '@/components/page/leaderboard/LeaderboardPointsPage/utils'
import ErrorPage from '@/components/shared/ErrorPage/ErrorPage'

export default async function LeaderboardPoints({
	searchParams: _searchParams
}: {
	searchParams: Promise<Record<LeaderboardPointsParams, string | string[]>>
}) {
	const searchParams = await _searchParams
	const page = transformPageParam(searchParams.page)
	const itemsPerPage = transformItemsPerPageParam(searchParams.itemsPerPage)

	return (
		<Suspense fallback={<LeaderboardPointsLoading page={page} itemsPerPage={itemsPerPage} />}>
			<LeaderboardPointsInner page={page} itemsPerPage={itemsPerPage} />
		</Suspense>
	)
}

async function LeaderboardPointsInner({
	page,
	itemsPerPage
}: {
	page: number
	itemsPerPage: number
}) {
	const { data, error } = await getTopUsersByPoints(page, itemsPerPage)

	if (error || !data) {
		return <ErrorPage error={error} text="There was an error loading the leaderboard." />
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

function LeaderboardPointsLoading({ page, itemsPerPage }: { page: number; itemsPerPage: number }) {
	return (
		<div className={pageStyles['page']}>
			<div className={pageStyles['page__heading']}>
				<h1 className={pageStyles['title']}>Leaderboard</h1>
				<Pagination
					page={page}
					itemsPerPage={itemsPerPage}
					numItems={0}
					loading
					style="detached"
					hideItemsPerPage
					hideItemCount
				/>
			</div>
			<div>
				<Table rows={[]} columns={columns} loading={itemsPerPage} />
				<Pagination page={page} itemsPerPage={itemsPerPage} numItems={0} loading />
			</div>
		</div>
	)
}
