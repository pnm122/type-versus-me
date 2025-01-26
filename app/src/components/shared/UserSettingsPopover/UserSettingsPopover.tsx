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
import { updateUser as updateUserInDatabase } from '$shared/utils/database/user'
import { User } from '@prisma/client'
import { useNotification } from '@/context/Notification'
import { useAuthContext } from '@/context/Auth'
import { useRoom } from '@/context/Room'
import { updateUser as updateUserInSocket } from '@/utils/realtime/user'
import { useSocket } from '@/context/Socket'

interface Props {
	open: boolean
	onClose: () => void
	user: User
}

export default function UserSettingsPopover({ open, onClose, user }: Props) {
	const [username, setUsername] = useState(user.username)
	const [color, setColor] = useState(user.cursorColor as CursorColor)
	const { reload } = useAuthContext()
	const { room, user: socketUser } = useRoom()
	const inputRef = useRef<HTMLInputElement>(null)
	const socket = useSocket()
	const notifs = useNotification()
	const [isPending, startTransition] = useTransition()

	useEffect(() => {
		if (open) {
			setUsername(user.username)
			setColor(user.cursorColor as CursorColor)
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
						const { error } = await updateUserInDatabase(user.id, { username, cursorColor: color })

						if (error) {
							notifs.push({
								style: 'error',
								text: `There was an error updating your settings. Please refresh and try again. (Error code: "${error.code}")`
							})
						} else {
							// Reload user data so it's synced across the app
							const newUser = await reload()
							// Update settings in room if applicable
							if (room && socketUser && newUser) {
								if (newUser.cursorColor !== socketUser.color) {
									await updateUserInSocket(
										'color',
										newUser.cursorColor as CursorColor,
										{ user: socketUser },
										{ socket, notifs }
									)
								}
								if (newUser.username !== socketUser.username) {
									await updateUserInSocket(
										'username',
										newUser.username,
										{ user: socketUser },
										{ socket, notifs }
									)
								}
							}
						}
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
						points={user.points}
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
