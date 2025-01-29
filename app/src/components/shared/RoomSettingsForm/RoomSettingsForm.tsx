import { RoomSettings } from '$shared/types/Room'
import Input from '@/components/base/Input/Input'
import styles from './style.module.scss'
import { MAX_TEST_TIME, MAX_TEST_WORDS, MIN_TEST_TIME, MIN_TEST_WORDS } from '$shared/constants'
import Button from '@/components/base/Button/Button'
import ButtonIcon from '@/components/base/Button/ButtonIcon'
import PixelarticonsSave from '~icons/pixelarticons/save'
import PixelarticonsClose from '~icons/pixelarticons/close'
import PixelarticonsPlus from '~icons/pixelarticons/plus'
import PixelarticonsArrowLeft from '~icons/pixelarticons/arrow-left'

export interface RoomSettingsFormProps {
	settings: RoomSettings
	onChange<T extends keyof RoomSettings>(key: T, value: RoomSettings[T]): void
	onSubmit(): void
	/** Callback for clicking the cancel button. Only applies for when `type` is "save" */
	onCancel?(): void
	type: 'save' | 'create-room'
	firstFocusableElement?: React.Ref<HTMLButtonElement | null>
	loading?: boolean
}

export default function RoomSettingsForm({
	settings,
	onChange,
	onSubmit,
	onCancel,
	type,
	firstFocusableElement,
	loading
}: RoomSettingsFormProps) {
	function onFormSubmit(e: React.FormEvent) {
		e.preventDefault()
		onSubmit()
	}

	return (
		<form className={styles['form']} onSubmit={onFormSubmit}>
			<h1 className={styles['form__heading']}>
				{type === 'save' ? 'Room settings' : 'Create room'}
			</h1>
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
							ref={firstFocusableElement}
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
				<Button type="submit" loading={loading}>
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
				<Button
					href={type === 'save' ? undefined : '/'}
					style="tertiary"
					onClick={() => (type === 'save' ? onCancel?.() : undefined)}
				>
					{type === 'save' ? (
						<>
							<ButtonIcon icon={<PixelarticonsClose />} />
							Cancel
						</>
					) : (
						<>
							<ButtonIcon icon={<PixelarticonsArrowLeft />} />
							Go to homepage
						</>
					)}
				</Button>
			</div>
		</form>
	)
}
