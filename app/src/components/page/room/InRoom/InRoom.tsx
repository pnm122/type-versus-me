import styles from './style.module.scss'
import MainRoom from '@/components/page/room/MainRoom/MainRoom'
import RoomData from '@/components/page/room/RoomData/RoomData'
import { useRoom } from '@/context/Room'

export default function InRoom() {
	const { room } = useRoom()

	if (!room) {
		return (
			<main className={styles['page']}>
				<p>Room does not exist!</p>
			</main>
		)
	}

	return (
		<main className={styles['page']}>
			<MainRoom />
			<RoomData />
		</main>
	)
}
