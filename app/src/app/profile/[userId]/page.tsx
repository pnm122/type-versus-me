import { getUser } from '$shared/utils/database/user'
import ProfileInner from '@/components/page/profile/ProfileInner/ProfileInner'
import ProfileLoading from '@/components/page/profile/ProfileLoading/ProfileLoading'
import { Metadata } from 'next'
import { cache, Suspense } from 'react'

interface Props {
	searchParams: Promise<Record<string, string | string[]>>
	params: Promise<{ userId: string }>
}

// For reuse in metadata + page
// TODO: Redefine all database functions with cache
// Only cached in the same request
const getUserCached = cache(async (userId: string) => {
	return await getUser(userId)
})

export async function generateMetadata(props: Props): Promise<Metadata> {
	const { userId } = await props.params
	const { data: user, error } = await getUserCached(userId)

	if (error) {
		return {
			title: 'Error getting data'
		}
	}

	if (!user) {
		return {
			title: 'User not found'
		}
	}

	return {
		title: `${user.username}'s profile`
	}
}

export default async function Profile(props: Props) {
	const searchParams = await props.searchParams
	const { userId } = await props.params
	const { data: user, error } = await getUserCached(userId)

	return (
		<Suspense fallback={<ProfileLoading searchParams={searchParams} />}>
			<ProfileInner user={user} error={error} searchParams={searchParams} />
		</Suspense>
	)
}
