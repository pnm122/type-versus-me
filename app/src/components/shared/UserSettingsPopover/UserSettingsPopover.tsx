'use client'

import Button from '@/components/base/Button/Button'
import Input from '@/components/base/Input/Input'
import Popover from '@/components/base/Popover/Popover'
import React, { useEffect, useRef, useState, useTransition } from 'react'
import styles from './style.module.scss'
import IconButton from '@/components/base/Button/IconButton'
import PixelarticonsDice from '~icons/pixelarticons/dice'
import { CursorColor } from '$shared/types/Cursor'
import generateUsername from '$shared/utils/generateUsername'
import CursorSelector from '@/components/shared/CursorSelector/CursorSelector'
import ButtonIcon from '@/components/base/Button/ButtonIcon'
import PixelarticonsSave from '~icons/pixelarticons/save'
import { useNotification } from '@/context/Notification'
import { useAuthContext } from '@/context/Auth'
import { useRoom } from '@/context/Room'
import { useSocket } from '@/context/Socket'
import setUserSettings from '@/utils/setUserSettings'

interface Props {
	open: boolean
	onClose: () => void
}

export default function UserSettingsPopover({ open, onClose }: Props) {
	const auth = useAuthContext()
	const [username, setUsername] = useState(auth.user?.username ?? '')
	const [color, setColor] = useState((auth.user?.cursorColor as CursorColor) ?? 'gray')
	const room = useRoom()
	const inputRef = useRef<HTMLInputElement>(null)
	const socket = useSocket()
	const notifs = useNotification()
	const [isPending, startTransition] = useTransition()

	useEffect(() => {
		if (open) {
			setUsername(auth.user?.username ?? '')
			setColor((auth.user?.cursorColor as CursorColor) ?? 'gray')
		}
	}, [open])

	useEffect(() => {
		if (!isPending) {
			onClose()
		}
	}, [isPending])

	return (
		<Popover open={open} focusOnOpenRef={inputRef} onBackdropClicked={onClose}>
			<form
				className={styles['form']}
				action={async () => {
					startTransition(async () => {
						await setUserSettings({ color, username }, { auth, room, socket, notifs })
					})
				}}
			>
				<div className={styles['username']}>
					<Input
						id="username"
						label="Username"
						placeholder="Username"
						text={username}
						onChange={(e) => setUsername(e.target.value)}
						wrapperClassName={styles['username__input']}
						minLength={3}
						maxLength={16}
						ref={inputRef}
						required
					/>
					<IconButton
						icon={<PixelarticonsDice />}
						className={styles['username__generate']}
						style="secondary"
						aria-label="Generate random username"
						onClick={() => setUsername(generateUsername())}
					/>
				</div>
				<div className={styles['color']}>
					<h2 className={styles['color__heading']}>Cursor style</h2>
					<CursorSelector
						selected={color}
						onChange={setColor}
						points={auth.user?.points ?? 0}
						isOnSurface={true}
					/>
				</div>
				<Button loading={isPending} type="submit">
					<ButtonIcon icon={<PixelarticonsSave />} />
					Save
				</Button>
			</form>
		</Popover>
	)
}
