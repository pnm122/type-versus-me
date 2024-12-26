import styles from './style.module.scss'
import User from '../User/User'
import Button from '@/components/Button/Button'
import PixelarticonsLogout from '~icons/pixelarticons/logout'
import ButtonIcon from '@/components/Button/ButtonIcon'
import PixelarticonsCopy from '~icons/pixelarticons/copy'

import { MAX_USERS_PER_ROOM } from '$shared/constants'
import { useNotification } from '@/context/Notification'
import Checkbox from '@/components/Checkbox/Checkbox'
import { useState } from 'react'
import { User as UserType } from '$shared/types/User'
import { useGlobalState } from '@/context/GlobalState'
import { updateUser } from '@/utils/user'
import { useSocket } from '@/context/Socket'
import { leaveRoom } from '@/utils/room'
import { useRouter } from 'next/navigation'

export default function RoomData() {
	const globalState = useGlobalState()
	const notifs = useNotification()
	const socket = useSocket()
	const router = useRouter()
	// 'Predict' what state the user will be in before waiting for server
	// This way, the state changes can feel instantaneous, but still be verified by the server
	const [predictedUserState, setPredictedUserState] = useState<UserType['state'] | null>(null)

	const { room, user } = globalState
	if (!room || !user) return <></>

	function onInviteClicked() {
		window.navigator.clipboard.writeText(room!.id)
		notifs.push({
			style: 'success',
			text: 'Copied room code to clipboard!'
		})
	}

	async function onCheckboxChange(ready: boolean) {
		setPredictedUserState(ready ? 'ready' : 'not-ready')
		await updateUser('state', ready ? 'ready' : 'not-ready', {
			globalState,
			notifs,
			socket
		})
		setPredictedUserState(null)
	}

	function handleLeaveRoom() {
		router.push('/')
		leaveRoom({ globalState, socket, notifs })
	}

	return (
		<div className={styles['data']}>
			<div className={styles['user-info']}>
				<ul className={styles['user-info__users']}>
					{room.users.map((u) => (
						<User key={u.id} user={u} />
					))}
				</ul>
				<h3 className={styles['user-info__num-players']}>
					{room.users.length}/{MAX_USERS_PER_ROOM} players
				</h3>
				<div className={styles['checkbox']}>
					<Checkbox
						checked={
							predictedUserState
								? predictedUserState === 'ready'
								: user.state === 'ready' || room.state === 'in-progress'
						}
						onChange={onCheckboxChange}
						disabled={room.state === 'in-progress'}
						className={styles['checkbox__button']}
					>
						{"I'm ready"}
					</Checkbox>
				</div>
			</div>
			<hr></hr>
			<div className={styles['data__room']}>
				<button
					title="Copy room code to clipboard"
					onClick={onInviteClicked}
					className={styles['invite']}
				>
					<span className={styles['invite__text']}>Room code: {room.id}</span>
					<div className={styles['invite__icon']}>
						<PixelarticonsCopy />
					</div>
				</button>
				<Button className={styles['leave']} style="tertiary" onClick={handleLeaveRoom}>
					<ButtonIcon icon={<PixelarticonsLogout />} />
					Leave room
				</Button>
			</div>
		</div>
	)
}
