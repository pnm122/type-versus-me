import { PropsWithChildren } from 'react'
import styles from './style.module.scss'
import PixelarticonsCheck from '~icons/pixelarticons/check'

type Props = PropsWithChildren<{
	checked: boolean
	onChange?: (value: boolean) => void
}>

export default function Checkbox({ checked, onChange = () => {}, children }: Props) {
	return (
		<button
			className={styles['checkbox']}
			role="checkbox"
			aria-checked={checked}
			onClick={() => onChange(!checked)}
		>
			<div className={styles['checkbox__box']}>
				<PixelarticonsCheck className={styles['check']} />
			</div>
			{children}
		</button>
	)
}
