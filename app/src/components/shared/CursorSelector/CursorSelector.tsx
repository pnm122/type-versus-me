import { CursorColor } from '$shared/types/Cursor'
import CursorColors from '$shared/utils/CursorColors'
import CursorPreview from '@/components/shared/CursorPreview/CursorPreview'
import styles from './style.module.scss'

interface Props {
	selected?: CursorColor
	disabled?: CursorColor[] | readonly CursorColor[]
	onChange: (c: CursorColor) => void
	/** Change the styling for when the component is on a surface. */
	isOnSurface?: boolean
}

export default function CursorSelector({ selected, onChange, disabled, isOnSurface }: Props) {
	function isDisabled(color: CursorColor) {
		return disabled?.includes(color) ?? false
	}

	function getBackground(color: CursorColor) {
		if (selected === color && !isDisabled(color)) {
			return `var(--cursor-${color}-light)`
		} else if (isDisabled(color)) {
			return 'var(--disabled)'
		} else if (isOnSurface) {
			return 'var(--gray-20)'
		} else {
			return 'var(--surface)'
		}
	}

	function getBorder(color: CursorColor) {
		if (selected === color && !isDisabled(color)) {
			return `var(--cursor-${color})`
		} else if (isDisabled(color)) {
			return 'var(--disabled)'
		} else if (isOnSurface) {
			return 'var(--gray-20)'
		} else {
			return 'var(--surface)'
		}
	}

	return (
		<div className={styles['selector']}>
			{CursorColors.map((c) => (
				<button
					key={c}
					type="button"
					disabled={isDisabled(c)}
					className={styles['selector__item']}
					style={
						{
							'--selector-background': getBackground(c),
							'--selector-border': getBorder(c)
						} as React.CSSProperties
					}
					onClick={() => onChange(c)}
				>
					<CursorPreview color={c} disabled={isDisabled(c)} />
				</button>
			))}
		</div>
	)
}
