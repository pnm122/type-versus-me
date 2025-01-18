import { auth } from '@/auth'
import ProfileInner from '@/components/page/profile/ProfileInner/ProfileInner'
import Races from '@/components/page/profile/Races/Races'
import Stats from '@/components/page/profile/Stats/Stats'
import { getUser } from '@/utils/database/user'

export default async function Profile({
	searchParams: params
}: {
	searchParams: Promise<Record<string, string | string[]>>
}) {
	const searchParams = await params
	const session = await auth()
	const user = (await getUser(session!.user!.id!))!

	// Can't import server components from client components, so pass them in here instead
	return (
		<ProfileInner
			user={user}
			stats={<Stats searchParams={searchParams} user={user} />}
			races={<Races searchParams={searchParams} user={user} />}
		/>
	)
}
