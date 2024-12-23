import styles from './style.module.scss'

interface Props {
	icon: React.ReactNode
}

export default function ButtonIcon({ icon }: Props) {
	return <div className={styles['button__icon']}>{icon}</div>
}
