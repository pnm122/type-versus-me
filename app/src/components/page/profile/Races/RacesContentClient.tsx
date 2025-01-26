'use client'

import { useTransition } from 'react'
import CategoryFilter from '@/components/page/profile/Filter/CategoryFilter'
import styles from './style.module.scss'
import NumWordsFilter from '@/components/page/profile/Filter/NumWordsFilter'
import Table, { TableRowsFrom } from '@/components/base/Table/Table'
import { roomCategoryDisplayNames } from '@/utils/displayNameMappings'
import Pagination from '@/components/base/Pagination/Pagination'
import { racesTableColumns, RacesTableData } from '@/components/page/profile/Races/table'
import { useRouter } from 'next/navigation'
import newParamsURL from '@/utils/newParamsURL'
import useSafeParams from '@/hooks/useSafeParams'
import {
	getPlacement,
	ITEMS_PER_PAGE_PARAM_KEY,
	MAX_ITEMS_PER_PAGE,
	MAX_WORDS_PARAM_KEY,
	MIN_ITEMS_PER_PAGE,
	MIN_WORDS_PARAM_KEY,
	PAGE_PARAM_KEY,
	ScoreAndRace,
	transformItemsPerPageParam,
	transformPageParam
} from './utils'
import { RoomSettings } from '$shared/types/Room'
import { useAuthContext } from '@/context/Auth'
import WordsPerMinute from './Table/WordsPerMinute'
import Accuracy from './Table/Accuracy'
import Placement from './Table/Placement'
import StartTime from './Table/StartTime'

interface Props {
	data: { scores: ScoreAndRace[]; totalCount: number } | null
}

export default function RacesContentClient({ data }: Props) {
	interface Params {
		[PAGE_PARAM_KEY]: number
		[ITEMS_PER_PAGE_PARAM_KEY]: number
	}

	const { user } = useAuthContext()
	const [isPending, startTransition] = useTransition()
	const router = useRouter()
	const [safeParams, searchParams] = useSafeParams<Params>({
		[PAGE_PARAM_KEY]: transformPageParam,
		[ITEMS_PER_PAGE_PARAM_KEY]: transformItemsPerPageParam
	})

	// Shouldn't ever happen but just in case
	if (!user) return <></>

	const rows: TableRowsFrom<RacesTableData> =
		data?.scores.map((s) => ({
			startTime: s.race.startTime,
			netWPM: s.netWPM,
			accuracy: s.accuracy,
			placement: getPlacement(user.id, s.race.scores),
			category: s.race.category,
			numWords: s.race.numWords,
			key: s.id
		})) ?? []

	function onPaginationChange(newPage: number, newItemsPerPage: number) {
		startTransition(() => {
			router.push(
				newParamsURL(searchParams, {
					[PAGE_PARAM_KEY]: newPage.toString(),
					[ITEMS_PER_PAGE_PARAM_KEY]: newItemsPerPage.toString()
				})
			)
		})
	}

	return (
		<section className={styles['races']}>
			<div className={styles['header']}>
				<div className={styles['header__main']}>
					<h2 className={styles['heading']}>Your races</h2>
					<div className={styles['filters']}>
						<CategoryFilter paramKey="races-category" transition={[isPending, startTransition]} />
						<NumWordsFilter
							minWordsParamKey={MIN_WORDS_PARAM_KEY}
							maxWordsParamKey={MAX_WORDS_PARAM_KEY}
							transition={[isPending, startTransition]}
						/>
					</div>
				</div>
				<Pagination
					numItems={data?.totalCount ?? 0}
					itemsPerPage={safeParams[ITEMS_PER_PAGE_PARAM_KEY]}
					page={safeParams[PAGE_PARAM_KEY]}
					onChange={onPaginationChange}
					minItemsPerPage={MIN_ITEMS_PER_PAGE}
					maxItemsPerPage={MAX_ITEMS_PER_PAGE}
					loading={isPending}
					style="detached"
					hideItemsPerPage
					hideItemCount
				/>
			</div>
			<div className={styles['table']}>
				<Table
					loading={isPending ? 'show-data' : undefined}
					maxWidth="100%"
					columns={racesTableColumns}
					rows={rows.slice(0, safeParams[ITEMS_PER_PAGE_PARAM_KEY])}
					render={{
						startTime(value) {
							return <StartTime startTime={value} />
						},
						netWPM(value) {
							return <WordsPerMinute netWPM={value} />
						},
						accuracy(value) {
							return <Accuracy accuracy={value} />
						},
						placement(value) {
							return <Placement placement={value} />
						},
						category(value) {
							return (
								<span className={styles['table-data']}>
									{roomCategoryDisplayNames[value as RoomSettings['category']]}
								</span>
							)
						},
						numWords(value) {
							return <span className={styles['table-data']}>{value}</span>
						}
					}}
					expandRender={Object.fromEntries(
						data?.scores.map((s) => [s.id, () => `Expanded content`]) ?? []
					)}
					noData="You haven't played any races yet."
				/>
				<Pagination
					numItems={data?.totalCount ?? 0}
					itemsPerPage={safeParams[ITEMS_PER_PAGE_PARAM_KEY]}
					page={safeParams[PAGE_PARAM_KEY]}
					onChange={onPaginationChange}
					minItemsPerPage={MIN_ITEMS_PER_PAGE}
					maxItemsPerPage={MAX_ITEMS_PER_PAGE}
					loading={isPending}
				/>
			</div>
		</section>
	)
}
