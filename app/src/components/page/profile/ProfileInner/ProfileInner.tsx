import Races from '@/components/page/profile/Races/Races'
import Stats from '@/components/page/profile/Stats/Stats'
import UserInfo from '@/components/page/profile/UserInfo/UserInfo'
import styles from './style.module.scss'
import NoProfile from '@/components/page/profile/NoProfile/NoProfile'
import { Prisma, User } from '@prisma/client'
import ErrorPage from '@/components/shared/ErrorPage/ErrorPage'

interface Props {
	user: User | null
	error: Prisma.PrismaClientKnownRequestError | null
	searchParams: Record<string, string | string[]>
}

export default async function ProfileInner({ user, error, searchParams }: Props) {
	if (error) {
		return <ErrorPage error={error} text="There was an error loading your profile." />
	}

	if (!user) {
		return <NoProfile />
	}

	return (
		<main className={styles['page']}>
			<section className={styles['page__top']}>
				<UserInfo user={user} />
				<Stats searchParams={searchParams} userId={user.id} />
			</section>
			<Races searchParams={searchParams} userId={user.id} />
		</main>
	)
}
