import UsernameAndColorInput from '@/components/shared/UsernameAndColorInput/UsernameAndColorInput'
import styles from './style.module.scss'
import Button from '@/components/base/Button/Button'
import ButtonIcon from '@/components/base/Button/ButtonIcon'
import PixelarticonsSave from '~icons/pixelarticons/save'
import PixelarticonsClose from '~icons/pixelarticons/close'
import { useRef } from 'react'
import { CursorColor } from '$shared/types/Cursor'
import TyperPreview from '@/components/shared/TyperPreview/TyperPreview'
import Dropdown from '@/components/base/Dropdown/Dropdown'

interface Props {
	open: boolean
	onClose: () => void
	onSave: () => void
	username: string
	color: CursorColor
	onUsernameChange: (u: string) => void
	onColorChange: (c: CursorColor) => void
	id: string
	toggleButton: React.RefObject<HTMLElement>
}

export default function UserSettings({
	open,
	onClose,
	onSave,
	username,
	color,
	onUsernameChange,
	onColorChange,
	id,
	toggleButton
}: Props) {
	const inputRef = useRef<HTMLInputElement>(null)

	function onSubmit(e: React.FormEvent<any>) {
		e.preventDefault()
		onSave()
	}

	return (
		<Dropdown
			open={open}
			id={id}
			onClose={onClose}
			toggleButton={toggleButton}
			focusOnOpenRef={inputRef}
			as="form"
			onSubmit={onSubmit}
			aria-label="User settings"
			className={styles['settings']}
		>
			<UsernameAndColorInput
				{...{ username, color, onUsernameChange, onColorChange }}
				isOnSurface
				inputRef={inputRef}
			/>
			<div className={styles['cursor-preview']}>
				<TyperPreview text="Your cursor will look like this." cursorColor={color} />
			</div>
			<div className={styles['settings__actions']}>
				<Button type="submit">
					<ButtonIcon icon={<PixelarticonsSave />} />
					Save
				</Button>
				<Button style="tertiary" onClick={() => onClose()}>
					<ButtonIcon icon={<PixelarticonsClose />} />
					Cancel
				</Button>
			</div>
		</Dropdown>
	)
}
