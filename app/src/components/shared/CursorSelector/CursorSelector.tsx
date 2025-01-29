import { CursorColor } from '$shared/types/Cursor'
import CursorColors from '$shared/utils/CursorColors'
import { getUnlocks, UNLOCKS } from '@/utils/unlocks'
import CursorPreview from '../CursorPreview/CursorPreview'
import styles from './style.module.scss'
import { getLevel } from '@/utils/level'
import PixelarticonsLock from '~icons/pixelarticons/lock'
import SimpleTooltip from '@/components/base/SimpleTooltip/SimpleTooltip'
import { useId } from 'react'

interface Props {
	selected?: CursorColor
	onChange: (c: CursorColor) => void
	/** Change the styling for when the component is on a surface. */
	isOnSurface?: boolean
	/** Points earned by the user, which is used to show which cursors are locked/unlocked */
	points: number
}

export default function CursorSelector({ selected, onChange, points, isOnSurface }: Props) {
	const id = useId()

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
					aria-label={isLocked(c) ? undefined : `${c} cursor`}
					aria-labelledby={isLocked(c) ? `${id}-${c}` : undefined}
				>
					{isLocked(c) ? (
						<>
							<PixelarticonsLock className={styles['lock']} />
							<SimpleTooltip className={styles['tooltip']} id={`${id}-${c}`}>
								Unlocks at level {Object.entries(UNLOCKS).find((u) => u[1]?.value === c)?.[0]}
							</SimpleTooltip>
						</>
					) : (
						<CursorPreview size="large" color={c} />
					)}
				</button>
			))}
		</div>
	)
}
