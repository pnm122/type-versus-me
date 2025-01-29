import createClasses from '@/utils/createClasses'
import styles from './style.module.scss'

interface Props {
	className?: string
	size?: number | string
	color?: string
}

export default function Loader({ className, size = 32, color }: Props) {
	return (
		<svg
			style={
				{
					'--loader-size': typeof size === 'number' ? `${size}px` : size,
					...(color ? { '--loader-color': color } : {})
				} as React.CSSProperties
			}
			className={createClasses({
				[styles['loader']]: true,
				...(className ? { [className]: true } : {})
			})}
			viewBox="0 0 225 225"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle
				className={styles['loader__circle']}
				cx="112.5"
				cy="112.5"
				fill="none"
				r="100"
				strokeWidth="25"
			/>
		</svg>
	)
}
