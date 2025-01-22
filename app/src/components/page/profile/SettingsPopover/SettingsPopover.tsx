import Button from '@/components/base/Button/Button'
import Input from '@/components/base/Input/Input'
import Popover from '@/components/base/Popover/Popover'
import React, { useEffect, useRef, useState } from 'react'
import styles from './style.module.scss'
import IconButton from '@/components/base/Button/IconButton'
import PixelarticonsDice from '~icons/pixelarticons/dice'
import { CursorColor } from '$shared/types/Cursor'
import generateUsername from '$shared/utils/generateUsername'
import CursorSelector from '@/components/shared/CursorSelector/CursorSelector'
import ButtonIcon from '@/components/base/Button/ButtonIcon'
import PixelarticonsSave from '~icons/pixelarticons/save'

interface Props {
	open: boolean
	onClose: () => void
	username: string
	color: CursorColor
	points: number
}

export default function SettingsPopover({
	open,
	onClose,
	username: currentUsername,
	color: currentColor,
	points
}: Props) {
	const [username, setUsername] = useState(currentUsername)
	const [color, setColor] = useState(currentColor)
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (open) {
			setUsername(currentUsername)
			setColor(currentColor)
		}
	}, [open])

	function onSave() {
		onClose()
	}

	return (
		<Popover
			open={open}
			focusOnOpenRef={inputRef}
			onBackdropClicked={onClose}
			className={styles['popover']}
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
				<CursorSelector selected={color} onChange={setColor} points={points} isOnSurface={true} />
			</div>
			<Button onClick={onSave}>
				<ButtonIcon icon={<PixelarticonsSave />} />
				Save
			</Button>
		</Popover>
	)
}
