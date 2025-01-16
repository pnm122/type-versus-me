import { User as UserType } from '$shared/types/User'
import CursorPreview from '@/components/shared/CursorPreview/CursorPreview'
import styles from './style.module.scss'
import { useGlobalState } from '@/context/GlobalState'
import UserState from './UserState'
import IconButton from '@/components/base/Button/IconButton'
import PixelarticonsEdit from '~icons/pixelarticons/edit'
import { useRef, useState } from 'react'
import UserSettings from './UserSettings'
import { CursorColor } from '$shared/types/Cursor'
import { updateUser } from '@/utils/user'
import { useSocket } from '@/context/Socket'
import { useNotification } from '@/context/Notification'
import { Return } from '$shared/types/Return'
import RiVipCrownFill from '~icons/ri/vip-crown-fill'

interface Props {
	user: UserType
}

export default function User({ user: { id, username, color, score, state } }: Props) {
	const [settingsOpen, setSettingsOpen] = useState(false)
	const [settingsUsername, setSettingsUsername] = useState('')
	const [settingsColor, setSettingsColor] = useState<CursorColor>('red')
	const settingsToggleButton = useRef<HTMLElement>(null)
	const globalState = useGlobalState()
	const socket = useSocket()
	const notifs = useNotification()
	const { user, room } = globalState

	function toggleSettings() {
		if (settingsOpen) return setSettingsOpen(false)
		setSettingsOpen(true)
		setSettingsUsername(user?.username ?? '')
		setSettingsColor(user?.color ?? 'red')
	}

	async function saveSettings() {
		const promises: Promise<Return>[] = []

		if (settingsUsername !== user?.username) {
			promises.push(updateUser('username', settingsUsername, { socket, notifs, globalState }))
		}

		if (settingsColor !== user?.color) {
			promises.push(updateUser('color', settingsColor, { socket, notifs, globalState }))
		}

		const success = (await Promise.all(promises)).every((res) => !res.error)
		if (success) setSettingsOpen(false)
	}

	return (
		<li className={styles['user']}>
			<div className={styles['user__name']}>
				<CursorPreview size="small" color={color} />
				<p className={styles['username']}>
					<span className={styles['username__main']}>
						{username}
						{room?.admin === id && (
							<RiVipCrownFill aria-label="Admin" className={styles['admin-icon']} />
						)}
					</span>
					{id === user!.id && <span className={styles['username__you']}> (you)</span>}
				</p>
				{id === user?.id && (
					<IconButton
						ref={settingsToggleButton}
						aria-label="User settings"
						icon={<PixelarticonsEdit />}
						style="tertiary"
						onClick={toggleSettings}
						aria-controls="settings"
					/>
				)}
				<UserSettings
					onSave={saveSettings}
					username={settingsUsername}
					color={settingsColor}
					onUsernameChange={setSettingsUsername}
					onColorChange={setSettingsColor}
					id="settings"
					open={settingsOpen}
					onClose={() => setSettingsOpen(false)}
					toggleButton={settingsToggleButton}
				/>
			</div>
			<div className={styles['user__info']}>
				<UserState score={score} state={state} />
			</div>
		</li>
	)
}
