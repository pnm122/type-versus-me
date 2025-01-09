import UsernameAndColorInput from '@/components/UsernameAndColorInput/UsernameAndColorInput'
import styles from './style.module.scss'
import Button from '@/components/Button/Button'
import ButtonIcon from '@/components/Button/ButtonIcon'
import PixelarticonsSave from '~icons/pixelarticons/save'
import PixelarticonsClose from '~icons/pixelarticons/close'
import { useRef } from 'react'
import { CursorColor } from '$shared/types/Cursor'
import { useGlobalState } from '@/context/GlobalState'
import TyperPreview from '@/components/TyperPreview/TyperPreview'
import Dropdown from '@/components/Dropdown/Dropdown'

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
	const { room, user } = useGlobalState()
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
				disabledColors={room?.users.filter((u) => u.id !== user?.id).map((u) => u.color)}
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
