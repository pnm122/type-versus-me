import styles from './style.module.scss'
import User from '@/components/page/room/User/User'
import Button from '@/components/base/Button/Button'
import PixelarticonsLogout from '~icons/pixelarticons/logout'
import ButtonIcon from '@/components/base/Button/ButtonIcon'
import PixelarticonsCopy from '~icons/pixelarticons/copy'
import { MAX_USERS_PER_ROOM } from '$shared/constants'
import { useNotification } from '@/context/Notification'
import Checkbox from '@/components/base/Checkbox/Checkbox'
import { useReducer, useState } from 'react'
import { User as UserType } from '$shared/types/User'
import { updateUser } from '@/utils/realtime/user'
import { useSocket } from '@/context/Socket'
import { changeRoomSettings, leaveRoom } from '@/utils/realtime/room'
import { useRouter } from 'next/navigation'
import Collapsible from '@/components/base/Collapsible/Collapsible'
import IconButton from '@/components/base/Button/IconButton'
import PixelarticonsEdit from '~icons/pixelarticons/edit'
import RoomSettingsPopover from '@/components/page/room/RoomSettingsPopover/RoomSettingsPopover'
import { RoomSettings } from '$shared/types/Room'
import { useRoom } from '@/context/Room'
import getTimeLimitText from '@/utils/getTimeLimitText'

export default function RoomData() {
	type Settings = RoomSettings & { open: boolean }
	type Action<T extends keyof Settings> = { key: T; value: Settings[T] }

	const notifs = useNotification()
	const socket = useSocket()
	const router = useRouter()
	const { room, user } = useRoom()
	// 'Predict' what state the user will be in before waiting for server
	// This way, the state changes can feel instantaneous, but still be verified by the server
	const [predictedUserState, setPredictedUserState] = useState<UserType['state'] | null>(null)
	const [settings, settingsDispatch] = useReducer(settingsReducer, {
		category: room!.settings.category,
		numWords: room!.settings.numWords,
		timeLimit: room!.settings.timeLimit,
		open: false
	})

	function settingsReducer<T extends keyof Settings>(state: Settings, { key, value }: Action<T>) {
		// Show current room settings when opening the popup
		if (key === 'open' && value) {
			return {
				category: room!.settings.category,
				numWords: room!.settings.numWords,
				timeLimit: room!.settings.timeLimit,
				open: true
			}
		}

		return {
			...state,
			[key]: value
		}
	}

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
		await updateUser(
			'state',
			ready ? 'ready' : 'not-ready',
			{ user },
			{
				notifs,
				socket
			}
		)
		setPredictedUserState(null)
	}

	function handleLeaveRoom() {
		router.push('/')
		leaveRoom({ socket, notifs })
	}

	function getCategoryText() {
		switch (room?.settings.category) {
			case 'quote':
				return 'Quotes'
			case 'top-100':
				return 'Top 100 common words'
			case 'top-1000':
				return 'Top 1000 common words'
		}
	}

	async function onSubmitRoomSettings() {
		// eslint-disable-next-line
		const { open, ...newSettings } = settings
		const res = await changeRoomSettings(newSettings, { user, room }, { socket, notifs })

		if (!res.error) {
			settingsDispatch({ key: 'open', value: false })
		}
	}

	return (
		<>
			<div className={styles['data']}>
				<div className={styles['user-info']}>
					<ul className={styles['user-info__users']}>
						{room.users.map((u) => (
							<User key={u.socketId} user={u} />
						))}
					</ul>
					<h3 className={styles['user-info__num-players']}>
						{room.users.length}/{MAX_USERS_PER_ROOM} players
					</h3>
					<Collapsible open={room.state !== 'in-progress'} openDirection="down" delay={375}>
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
					</Collapsible>
				</div>
				<hr></hr>
				<p className={styles['room-settings']}>
					<span className={styles['room-settings__text']}>
						{getCategoryText()} | {room.settings.numWords} words |{' '}
						{getTimeLimitText(room.settings.timeLimit)}
					</span>
					{room.admin === user.socketId && (
						<IconButton
							icon={<PixelarticonsEdit />}
							onClick={() => settingsDispatch({ key: 'open', value: true })}
							aria-label="Edit room settings"
							style="tertiary"
						/>
					)}
				</p>
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
			<RoomSettingsPopover
				open={settings.open}
				settings={{
					category: settings.category,
					numWords: settings.numWords,
					timeLimit: settings.timeLimit
				}}
				onClose={() => settingsDispatch({ key: 'open', value: false })}
				onChange={(key, value) => settingsDispatch({ key, value })}
				onSubmit={onSubmitRoomSettings}
			/>
		</>
	)
}
