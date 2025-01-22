import { CursorColor } from '$shared/types/Cursor'
import CursorColors from '$shared/utils/CursorColors'
import { getUnlocks } from '@/utils/unlocks'
import CursorPreview from '../CursorPreview/CursorPreview'
import styles from './style.module.scss'
import { getLevel } from '@/utils/level'
import PixelarticonsLock from '~icons/pixelarticons/lock'

interface Props {
	selected?: CursorColor
	onChange: (c: CursorColor) => void
	/** Change the styling for when the component is on a surface. */
	isOnSurface?: boolean
	/** Points earned by the user, which is used to show which cursors are locked/unlocked */
	points: number
}

export default function CursorSelector({ selected, onChange, points, isOnSurface }: Props) {
	const level = getLevel(points)
	const unlocks = getUnlocks(level)

	function isLocked(color: CursorColor) {
		return !Object.entries(unlocks).some((u) => u[1]?.value === color)
	}

	function getBackground(color: CursorColor) {
		if (selected === color && !isLocked(color)) {
			return `var(--cursor-${color}-light)`
		} else if (isLocked(color)) {
			return 'var(--disabled)'
		} else if (isOnSurface) {
			return 'var(--gray-20)'
		} else {
			return 'var(--surface)'
		}
	}

	function getBorder(color: CursorColor) {
		if (selected === color && !isLocked(color)) {
			return `var(--cursor-${color})`
		} else if (isLocked(color)) {
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
					disabled={isLocked(c)}
					className={styles['selector__item']}
					style={
						{
							'--selector-background': getBackground(c),
							'--selector-border': getBorder(c)
						} as React.CSSProperties
					}
					onClick={() => onChange(c)}
				>
					{isLocked(c) ? (
						<PixelarticonsLock className={styles['lock']} />
					) : (
						<CursorPreview size="large" color={c} />
					)}
				</button>
			))}
		</div>
	)
}
