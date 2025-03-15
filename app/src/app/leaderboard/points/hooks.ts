'use client'

import newParamsURL from '@/utils/newParamsURL'
import { useRouter, useSearchParams } from 'next/navigation'
import { LeaderboardPointsParams } from './params'

export function useUpdateParams() {
	const searchParams = useSearchParams()
	const router = useRouter()

	function update({
		page,
		itemsPerPage
	}: Partial<{
		[key in LeaderboardPointsParams]: number
	}>) {
		router.push(newParamsURL(searchParams, { page, itemsPerPage }))
	}

	return update
}
