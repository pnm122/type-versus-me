'use client'

import { useLayoutEffect, useRef } from 'react'
// import styles from './style.module.scss'
import { Canvas } from './utils'

export interface Point {
	x: number
	y: number
}

export interface Line {
	label: string
	points: Point[]
	color?: string
}

interface Props {
	lines: Line[]
	width?: string | number
	height?: string | number
}

export default function LineChart({ lines, width, height }: Props) {
	const canvas = useRef<HTMLCanvasElement>(null)

	useLayoutEffect(() => {
		if (!canvas.current) return

		const c = new Canvas(canvas.current, [
			{
				name: 'test',
				from: { x: 0.5, y: 0.5, percent: true },
				to: { x: 1, y: 1, percent: true }
			}
		])

		c.drawRectInRegion(
			{
				from: { x: 0, y: 0, percent: true },
				to: { x: 1, y: 1, percent: true }
			},
			'test',
			{ stroke: 'red' }
		)
	}, [width, height, lines])

	return (
		<canvas
			ref={canvas}
			width={width}
			height={height}
			style={{ border: '1px solid var(--border)', margin: 12 }}
		></canvas>
	)
}
