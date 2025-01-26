import ProfileInner from '@/components/page/profile/ProfileInner/ProfileInner'
import ProfileLoading from '@/components/page/profile/ProfileLoading/ProfileLoading'
import { Suspense } from 'react'

export default async function Profile(props: {
	searchParams: Promise<Record<string, string | string[]>>
	params: Promise<{ userId: string }>
}) {
	const searchParams = await props.searchParams
	const { userId } = await props.params

	return (
		<Suspense fallback={<ProfileLoading searchParams={searchParams} />}>
			<ProfileInner userId={userId} searchParams={searchParams} />
		</Suspense>
	)
}
