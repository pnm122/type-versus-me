import { useGlobalState } from '@/context/GlobalState'
import styles from './style.module.scss'
import Game from '../Game/Game'
import Leaderboard from '../Leaderboard/Leaderboard'

export default function MainRoom() {
	const globalState = useGlobalState()
	const { room } = globalState

	if (!room) return <></>

	const anyResults = room.users.some((u) => u.lastScore)

	return (
		<div className={styles['main']}>
			{room.state === 'in-progress' ? (
				<Game />
			) : (
				<>
					<h1 className={styles['main__waiting-text']}>
						The race will start when all players are ready.
					</h1>
					{anyResults && <Leaderboard />}
				</>
			)}
		</div>
	)
}
