import { auth } from '@/auth'
import ProfileInner from '@/components/profile/ProfileInner/ProfileInner'
import Races from '@/components/profile/Races/Races'
import Stats from '@/components/profile/Stats/Stats'
import { getUser } from '@/utils/database/user'

export default async function Profile() {
	const session = await auth()
	const user = (await getUser(session!.user!.id!))!

	// Can't import server components from client components, so pass them in here instead
	return <ProfileInner user={user} stats={<Stats />} races={<Races />} />
}
