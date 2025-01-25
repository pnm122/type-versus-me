import Popover from '@/components/base/Popover/Popover'
import { useRef } from 'react'
import RoomSettingsForm, {
	RoomSettingsFormProps
} from '@/components/shared/RoomSettingsForm/RoomSettingsForm'

type Props = Pick<RoomSettingsFormProps, 'settings' | 'onChange'> & {
	onSubmit: () => void
	onClose: () => void
	open: boolean
}

export default function RoomSettingsPopover({
	onSubmit,
	onClose,
	open,
	settings,
	onChange
}: Props) {
	const firstFocusableElement = useRef<HTMLButtonElement>(null)

	return (
		<Popover open={open} focusOnOpenRef={firstFocusableElement} onBackdropClicked={() => onClose()}>
			<RoomSettingsForm
				settings={settings}
				onChange={onChange}
				onCancel={onClose}
				onSubmit={onSubmit}
				firstFocusableElement={firstFocusableElement}
				type="save"
			/>
		</Popover>
	)
}
