import { User as UserType } from '$shared/types/User'
import CursorPreview from '@/components/CursorPreview/CursorPreview'
import styles from './style.module.scss'
import { useGlobalState } from '@/context/GlobalState'
import UserState from './UserState'
import IconButton from '@/components/Button/IconButton'
import PixelarticonsEdit from '~icons/pixelarticons/edit'
import { useState } from 'react'
import UserSettings from './UserSettings'
import { CursorColor } from '$shared/types/Cursor'

interface Props {
	user: UserType
}

export default function User({ user: { id, username, color, score, state } }: Props) {
	const [settingsOpen, setSettingsOpen] = useState(false)
	const [settingsUsername, setSettingsUsername] = useState('')
	const [settingsColor, setSettingsColor] = useState<CursorColor>('red')
	const { user } = useGlobalState()

	function openSettings() {
		setSettingsOpen(true)
		setSettingsUsername(user?.username ?? '')
		setSettingsColor(user?.color ?? 'red')
	}

	function saveSettings() {}

	return (
		<li className={styles['user']}>
			<div className={styles['user__name']}>
				<CursorPreview size="small" color={color} />
				<p className={styles['username']}>
					{username}
					{id === user!.id && <span className={styles['username__you']}> (you)</span>}
				</p>
				{id === user?.id && (
					<IconButton
						ariaLabel="User settings"
						icon={<PixelarticonsEdit />}
						style="tertiary"
						onClick={openSettings}
					/>
				)}
				<UserSettings
					open={settingsOpen}
					onClose={() => setSettingsOpen(false)}
					onSave={saveSettings}
					username={settingsUsername}
					color={settingsColor}
					onUsernameChange={setSettingsUsername}
					onColorChange={setSettingsColor}
				/>
			</div>
			<div className={styles['user__info']}>
				<UserState score={score} state={state} />
			</div>
		</li>
	)
}
