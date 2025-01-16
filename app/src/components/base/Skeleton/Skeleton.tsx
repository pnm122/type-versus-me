import styles from './style.module.scss'

interface Props {
	/**
	 * Width of the skeleton
	 * @default "100%"
	 **/
	width?: string
	/**
	 * Height of the skeleton
	 * @default "2em"
	 **/
	height?: string
	/**
	 * Background color of the skeleton
	 * @default "var(--gray-20)"
	 **/
	backgroundColor?: string
	/**
	 * Shimmer color of the skeleton
	 * @default "var(--gray-30)"
	 **/
	shimmerColor?: string
}

export default function Skeleton({
	width = '100%',
	height = '2em',
	backgroundColor = 'var(--gray-20)',
	shimmerColor = 'var(--gray-30)'
}: Props) {
	return (
		<div
			className={styles['skeleton']}
			style={
				{
					width,
					height,
					'--skeleton-background-color': backgroundColor,
					'--skeleton-shimmer-color': shimmerColor
				} as React.CSSProperties
			}
		/>
	)
}
