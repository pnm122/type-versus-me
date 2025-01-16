import Popover from '@/components/base/Popover/Popover'
import styles from './style.module.scss'
import Input from '@/components/base/Input/Input'
import { RoomSettings } from '$shared/types/Room'
import Button from '@/components/base/Button/Button'
import ButtonIcon from '@/components/base/Button/ButtonIcon'
import PixelarticonsSave from '~icons/pixelarticons/save'
import PixelarticonsClose from '~icons/pixelarticons/close'
import PixelarticonsPlus from '~icons/pixelarticons/plus'
import { useEffect, useRef } from 'react'
import { MAX_TEST_TIME, MAX_TEST_WORDS, MIN_TEST_TIME, MIN_TEST_WORDS } from '$shared/constants'

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
	const firstButton = useRef<HTMLButtonElement>(null)

	function onFormSubmit(e: React.FormEvent) {
		e.preventDefault()
		onSubmit()
	}

	useEffect(() => {
		if (!open) return

		setTimeout(() => {
			firstButton.current?.focus()
		}, 25)
	}, [open])

	return (
		<Popover open={open} onBackdropClicked={() => onClose()}>
			<form className={styles['form']} onSubmit={onFormSubmit}>
				<h1 className={styles['form__heading']}>Room settings</h1>
				<div className={styles['category-selector']}>
					<label id="category-selector__label" className={styles['category-selector__label']}>
						Category
					</label>
					<ul
						aria-labelledby="category-selector__label"
						aria-activedescendant={settings.category}
						role="radiogroup"
						className={styles['categories']}
					>
						<li className={styles['categories__option']}>
							<button
								ref={firstButton}
								type="button"
								id="top-100"
								role="radio"
								aria-checked={settings.category === 'top-100'}
								className={styles['button']}
								onClick={() => onChange('category', 'top-100')}
							>
								Top 100 common words
							</button>
						</li>
						<li className={styles['categories__option']}>
							<button
								type="button"
								id="top-1000"
								role="radio"
								aria-checked={settings.category === 'top-1000'}
								className={styles['button']}
								onClick={() => onChange('category', 'top-1000')}
							>
								Top 1000 common words
							</button>
						</li>
						<li className={styles['categories__option']}>
							<button
								type="button"
								id="quote"
								role="radio"
								aria-checked={settings.category === 'quote'}
								className={styles['button']}
								onClick={() => onChange('category', 'quote')}
							>
								Quotes
							</button>
						</li>
					</ul>
				</div>
				<Input
					id="settings-num-words"
					label="Number of words per race"
					type="number"
					min={MIN_TEST_WORDS}
					max={MAX_TEST_WORDS}
					text={settings.numWords.toString()}
					onChange={(e) => onChange('numWords', parseInt(e.target.value))}
					required
				/>
				<Input
					id="settings-time-limit"
					label="Time limit (seconds)"
					type="number"
					min={MIN_TEST_TIME}
					max={MAX_TEST_TIME}
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
