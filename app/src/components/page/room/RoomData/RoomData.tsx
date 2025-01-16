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
import { useGlobalState } from '@/context/GlobalState'
import { updateUser } from '@/utils/user'
import { useSocket } from '@/context/Socket'
import { changeRoomSettings, leaveRoom } from '@/utils/room'
import { useRouter } from 'next/navigation'
import Collapsible from '@/components/base/Collapsible/Collapsible'
import IconButton from '@/components/base/Button/IconButton'
import PixelarticonsEdit from '~icons/pixelarticons/edit'
import RoomSettingsPopover from '@/components/shared/RoomSettingsPopover/RoomSettingsPopover'
import { RoomSettings } from '$shared/types/Room'

export default function RoomData() {
	type Settings = RoomSettings & { open: boolean }
	type Action<T extends keyof Settings> = { key: T; value: Settings[T] }

	const globalState = useGlobalState()
	const notifs = useNotification()
	const socket = useSocket()
	const router = useRouter()
	const { room, user } = globalState
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

	function getTimeLimitText() {
		if (!room) return ''

		const { timeLimit } = room.settings
		if (timeLimit < 60) {
			return `${timeLimit}s`
		}

		const minutes = Math.floor(timeLimit / 60)
		const seconds = timeLimit % 60

		if (seconds === 0) {
			return `${minutes}min`
		}

		return `${minutes}min ${seconds}s`
	}

	async function onSubmitRoomSettings() {
		const res = await changeRoomSettings(settings, { globalState, socket, notifs })

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
							<User key={u.id} user={u} />
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
						{getCategoryText()} | {room.settings.numWords} words | {getTimeLimitText()} time limit
					</span>
					{room.admin === user.id && (
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
				type="save"
			/>
		</>
	)
}
