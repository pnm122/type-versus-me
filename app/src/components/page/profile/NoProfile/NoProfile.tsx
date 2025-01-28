'use client'

import Button from '@/components/base/Button/Button'
import styles from './style.module.scss'
import PixelarticonsUserX from '~icons/pixelarticons/user-x'
import PixelarticonsHome from '~icons/pixelarticons/home'
import ButtonIcon from '@/components/base/Button/ButtonIcon'
import { useAuthContext } from '@/context/Auth'
import PixelarticonsUser from '~icons/pixelarticons/user'
import SimpleTooltip from '@/components/base/SimpleTooltip/SimpleTooltip'

export default function NoProfile() {
	const { session } = useAuthContext()

	return (
		<main className={styles['page']}>
			<div className={styles['main']}>
				<PixelarticonsUserX className={styles['main__icon']} />
				<p className={styles['main__text']}>This user doesn&#39;t exist.</p>
				<div className={styles['buttons']}>
					<Button href="/">
						<ButtonIcon icon={<PixelarticonsHome />} />
						Go back home
					</Button>
					<Button
						style="tertiary"
						href={`/profile/${session?.user?.id}`}
						disabled={!session || !session.user}
						className={styles['profile']}
						aria-labelledby="profile-tooltip"
					>
						<ButtonIcon icon={<PixelarticonsUser />} />
						Your profile
						{(!session || !session.user) && (
							<SimpleTooltip id="profile-tooltip" className={styles['profile__tooltip']}>
								Create an account to view your profile
							</SimpleTooltip>
						)}
					</Button>
				</div>
			</div>
		</main>
	)
}
