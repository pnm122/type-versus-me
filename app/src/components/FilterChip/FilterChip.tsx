import styles from './style.module.scss'
import PixelarticonsCheck from '~icons/pixelarticons/check'

interface Props {
	label: string
	selected: boolean
	onClick: () => void
}

export default function FilterChip({ label, selected, onClick }: Props) {
	return (
		<button role="checkbox" aria-checked={selected} onClick={onClick} className={styles['chip']}>
			<PixelarticonsCheck className={styles['chip__check']} />
			<span className={styles['chip__label']}>{label}</span>
		</button>
	)
}
