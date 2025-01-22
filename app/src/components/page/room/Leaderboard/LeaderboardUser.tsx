import { User } from '$shared/types/User'
import { useGlobalState } from '@/context/GlobalState'
import styles from './style.module.scss'
import Pill from '@/components/base/Pill/Pill'
import PixelarticonsClose from '~icons/pixelarticons/close'
import sortUsersByScore from '@/utils/sortUsersByScore'
import createClasses from '@/utils/createClasses'

export default function LeaderboardUser({ user }: { user: User }) {
	const { room, user: currentUser } = useGlobalState()

	if (!room || !user.lastScore || !currentUser) return <></>

	const winnerWPM = sortUsersByScore(room.users).at(0)!.lastScore!.netWPM
	const ratioToHighestWPM = user.lastScore.netWPM / winnerWPM
	const nameInsideBar = !user.lastScore.failed && ratioToHighestWPM > 0.5
	const statInsideBar = !user.lastScore.failed && ratioToHighestWPM > 0.5

	const username = (
		<h2 className={styles['username']}>
			<span className={styles['username__text']}>{user.username}</span>
			{currentUser.id === user.id && <span className={styles['username__you']}> (you)</span>}
		</h2>
	)

	const stat = user.lastScore.failed ? (
		<Pill
			backgroundColor="var(--negative)"
			foregroundColor="var(--background)"
			text="Failed"
			icon={<PixelarticonsClose />}
		/>
	) : (
		<div className={styles['wpm']}>{Math.round(user.lastScore.netWPM)}wpm</div>
	)

	return (
		<li className={styles['user']}>
			<div
				style={
					{
						'--leaderboard-user-width': user.lastScore.failed ? 12 : `${ratioToHighestWPM * 100}%`,
						'--leaderboard-user-background': `var(--cursor-${user.color}-horizontal)`
					} as React.CSSProperties
				}
				className={createClasses({
					[styles['user__bar']]: true,
					[styles['user__bar--failed']]: user.lastScore.failed
				})}
			>
				{nameInsideBar && username}
				{statInsideBar && stat}
			</div>
			{!(nameInsideBar && statInsideBar) && (
				<div
					style={{
						flex: 1
					}}
					className={styles['user__outside']}
				>
					{!nameInsideBar && username}
					{!statInsideBar && stat}
				</div>
			)}
		</li>
	)
}
