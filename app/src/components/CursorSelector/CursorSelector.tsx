import { CursorColor } from '$shared/types/Cursor'
import CursorColors from '$shared/utils/CursorColors'
import CursorPreview from '../CursorPreview/CursorPreview'
import styles from './style.module.scss'

interface Props {
	selected?: CursorColor
	disabled?: CursorColor[] | readonly CursorColor[]
	onChange: (c: CursorColor) => void
}

export default function CursorSelector({ selected, onChange, disabled }: Props) {
	function isDisabled(color: CursorColor) {
		return disabled?.includes(color) ?? false
	}

	return (
		<div className={styles['selector']}>
			{CursorColors.map((c) => (
				<button
					key={c}
					type="button"
					disabled={isDisabled(c)}
					className={styles['selector__item']}
					style={{
						backgroundColor:
							selected === c && !isDisabled(c) ? `var(--cursor-${c}-light)` : undefined,
						borderColor: selected === c && !isDisabled(c) ? `var(--cursor-${c})` : undefined
					}}
					onClick={() => onChange(c)}
				>
					<CursorPreview color={c} disabled={isDisabled(c)} />
				</button>
			))}
		</div>
	)
}
