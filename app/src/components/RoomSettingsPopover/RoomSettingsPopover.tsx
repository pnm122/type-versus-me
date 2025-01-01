import Popover from '../Popover/Popover'
import styles from './style.module.scss'
import Input from '../Input/Input'
import { RoomSettings } from '$shared/types/Room'
import Button from '../Button/Button'
import ButtonIcon from '../Button/ButtonIcon'
import PixelarticonsSave from '~icons/pixelarticons/save'
import PixelarticonsClose from '~icons/pixelarticons/close'
import PixelarticonsPlus from '~icons/pixelarticons/plus'

interface Props {
	onSubmit: () => void
	onClose: () => void
	onChange: <T extends keyof RoomSettings>(key: T, value: RoomSettings[T]) => void
	open: boolean
	settings: RoomSettings
	type: 'save' | 'create-room'
}

export default function RoomSettingsPopover({
	onSubmit,
	onClose,
	onChange,
	open,
	settings,
	type
}: Props) {
	function onFormSubmit(e: React.FormEvent) {
		e.preventDefault()
		onSubmit()
	}

	return (
		<Popover open={open} onBackdropClicked={() => onClose()}>
			<form className={styles['form']} onSubmit={onFormSubmit}>
				<h1 className={styles['form__heading']}>Edit room settings</h1>
				<Input
					id="settings-num-words"
					label="Number of words per race"
					type="number"
					min={10}
					max={150}
					text={settings.numWords.toString()}
					onChange={(e) => onChange('numWords', parseInt(e.target.value))}
					required
				/>
				<Input
					id="settings-time-limit"
					label="Time limit (seconds)"
					type="number"
					min={5}
					max={600}
					text={settings.timeLimit.toString()}
					onChange={(e) => onChange('timeLimit', parseInt(e.target.value))}
					required
				/>
				<div className={styles['form__actions']}>
					<Button type="submit">
						{type === 'save' ? (
							<>
								<ButtonIcon icon={<PixelarticonsSave />} />
								Save
							</>
						) : (
							<>
								<ButtonIcon icon={<PixelarticonsPlus />} />
								Create room
							</>
						)}
					</Button>
					<Button style="tertiary" onClick={() => onClose()}>
						<ButtonIcon icon={<PixelarticonsClose />} />
						Cancel
					</Button>
				</div>
			</form>
		</Popover>
	)
}
