import UsernameAndColorInput from '@/components/UsernameAndColorInput/UsernameAndColorInput'
import styles from './style.module.scss'
import Button from '@/components/Button/Button'
import createClasses from '@/utils/createClasses'
import ButtonIcon from '@/components/Button/ButtonIcon'
import PixelarticonsSave from '~icons/pixelarticons/save'
import PixelarticonsClose from '~icons/pixelarticons/close'
import { useEffect } from 'react'
import { CursorColor } from '$shared/types/Cursor'
import { useGlobalState } from '@/context/GlobalState'
import TyperPreview from '@/components/TyperPreview/TyperPreview'

interface Props {
	open: boolean
	onClose: () => void
	onSave: () => void
	username: string
	color: CursorColor
	onUsernameChange: (u: string) => void
	onColorChange: (c: CursorColor) => void
}

export default function UserSettings({
	open,
	onClose,
	onSave,
	username,
	color,
	onUsernameChange,
	onColorChange
}: Props) {
	const { room, user } = useGlobalState()

	function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		onSave()
	}

	useEffect(() => {
		if (open) {
			// Add the event listener after the settings popup has opened, so that the click to open it doesn't close it immediately
			requestAnimationFrame(() => {
				window.addEventListener('click', handleClick)
			})
		}

		return () => {
			window.removeEventListener('click', handleClick)
		}
	}, [open])

	function handleClick(e: MouseEvent) {
		// if mouse click is outside of the settings popup, close it
		if (!(e.target as HTMLElement).closest(`.${styles['settings']}`)) {
			onClose()
		}
	}

	return (
		<form
			className={createClasses({
				[styles['settings']]: true,
				[styles['settings--open']]: open
			})}
			onSubmit={onSubmit}
		>
			<UsernameAndColorInput
				{...{ username, color, onUsernameChange, onColorChange }}
				disabledColors={room?.users.filter((u) => u.id !== user?.id).map((u) => u.color)}
				isOnSurface
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
		</form>
	)
}
