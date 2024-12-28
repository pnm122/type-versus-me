import UsernameAndColorInput from '@/components/UsernameAndColorInput/UsernameAndColorInput'
import styles from './style.module.scss'
import Button from '@/components/Button/Button'
import createClasses from '@/utils/createClasses'
import ButtonIcon from '@/components/Button/ButtonIcon'
import PixelarticonsSave from '~icons/pixelarticons/save'
import PixelarticonsClose from '~icons/pixelarticons/close'
import { useEffect, useRef } from 'react'
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
	id: string
}

export default function UserSettings({
	open,
	onClose,
	onSave,
	username,
	color,
	onUsernameChange,
	onColorChange,
	id
}: Props) {
	const { room, user } = useGlobalState()
	const inputRef = useRef<HTMLInputElement>(null)
	const settings = useRef<HTMLFormElement>(null)

	function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		onSave()
	}

	useEffect(() => {
		if (open) {
			// Need a small delay presumably because the input is technically not visible yet
			setTimeout(() => inputRef.current?.focus(), 25)
			// Add the event listener after the settings popup has opened, so that the click to open it doesn't close it immediately
			requestAnimationFrame(() => {
				settings.current?.addEventListener('focusout', handleFocusOut)
			})
		}

		return () => {
			settings.current?.removeEventListener('focusout', handleFocusOut)
		}
	}, [open])

	function handleFocusOut(e: FocusEvent) {
		// if focus is outside of the settings popup, close it
		if (!(e.relatedTarget && settings.current?.contains(e.relatedTarget as HTMLElement))) {
			onClose()
		}
	}

	return (
		<form
			tabIndex={0}
			role="dialog"
			aria-label="User settings"
			id={id}
			className={createClasses({
				[styles['settings']]: true,
				[styles['settings--open']]: open
			})}
			onSubmit={onSubmit}
			ref={settings}
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
		</form>
	)
}
