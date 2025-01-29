import React from 'react'
import styles from './style.module.scss'
import createClasses from '@/utils/createClasses'

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
	/** Optional styles to use for the skeleton */
	style?: React.CSSProperties
	/** Optional class(es) to use for the skeleton */
	className?: string
}

export default function Skeleton({
	width = '100%',
	height = '2em',
	backgroundColor = 'var(--gray-20)',
	shimmerColor = 'var(--gray-30)',
	style,
	className
}: Props) {
	return (
		<div
			className={createClasses({
				[styles['skeleton']]: true,
				...(className ? { [className]: true } : {})
			})}
			style={
				{
					width,
					height,
					'--skeleton-background-color': backgroundColor,
					'--skeleton-shimmer-color': shimmerColor,
					...style
				} as React.CSSProperties
			}
		/>
	)
}
