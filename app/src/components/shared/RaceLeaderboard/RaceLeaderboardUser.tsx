import { LastTestScore, User } from '$shared/types/User'
import styles from './style.module.scss'
import Pill from '@/components/base/Pill/Pill'
import PixelarticonsClose from '~icons/pixelarticons/close'
import createClasses from '@/utils/createClasses'

interface Props {
	score: LastTestScore & {
		user: Pick<User, 'username' | 'color'> & { id: string }
	}
	isCurrentUser: boolean
	winnerWPM: number
}

export default function RaceLeaderboardUser({ score, isCurrentUser, winnerWPM }: Props) {
	const ratioToHighestWPM = score.netWPM / winnerWPM
	const nameInsideBar = !score.failed && ratioToHighestWPM > 0.5
	const statInsideBar = !score.failed && ratioToHighestWPM > 0.5

	const username = (
		<h2 className={styles['username']}>
			<span className={styles['username__text']}>{score.user.username}</span>
			{isCurrentUser && <span className={styles['username__you']}> (you)</span>}
		</h2>
	)

	const stat = score.failed ? (
		<Pill
			backgroundColor="var(--negative)"
			foregroundColor="var(--background)"
			text="Failed"
			icon={<PixelarticonsClose />}
		/>
	) : (
		<div className={styles['wpm']}>{Math.round(score.netWPM)}wpm</div>
	)

	return (
		<li className={styles['user']}>
			<div
				style={
					{
						'--leaderboard-user-width': score.failed ? '12px' : `${ratioToHighestWPM * 100}%`,
						'--leaderboard-user-background': `var(--cursor-${score.user.color}-horizontal)`
					} as React.CSSProperties
				}
				className={createClasses({
					[styles['user__bar']]: true,
					[styles['user__bar--failed']]: score.failed
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
