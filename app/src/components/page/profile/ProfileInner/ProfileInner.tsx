import { getUser } from '$shared/utils/database/user'
import ProfileError from '@/components/page/profile/ProfileError/ProfileError'
import Races from '@/components/page/profile/Races/Races'
import Stats from '@/components/page/profile/Stats/Stats'
import UserInfo from '@/components/page/profile/UserInfo/UserInfo'
import styles from './style.module.scss'
import NoProfile from '@/components/page/profile/NoProfile/NoProfile'

interface Props {
	userId: string
	searchParams: Record<string, string | string[]>
}

export default async function ProfileInner({ userId, searchParams }: Props) {
	const { data: user, error } = await getUser(userId)

	if (error) {
		return <ProfileError error={error} />
	}

	if (!user) {
		return <NoProfile />
	}

	return (
		<main className={styles['page']}>
			<section className={styles['page__top']}>
				<UserInfo user={user} />
				<Stats searchParams={searchParams} userId={userId} />
			</section>
			<Races searchParams={searchParams} userId={userId} />
		</main>
	)
}
