'use client'

import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import styles from './style.module.scss'
import createClasses from '@/utils/createClasses'
import Input from '../Input/Input'

interface Props {
	min: number
	max: number
	lowSelected: number
	highSelected: number
	onLowChange(n: number): void
	onHighChange(n: number): void
	/**
	 * Distance between valid values
	 * @default 1
	 **/
	step?: number
	ariaLabel: string
	/**
	 * Whether to hide inputs below the slider
	 * @default false
	 */
	hideInputs?: boolean
	/** Optional units to show on inputs */
	units?: string
}

export default function RangeSlider({
	min,
	max,
	lowSelected,
	highSelected,
	onLowChange,
	onHighChange,
	step = 1,
	ariaLabel,
	hideInputs = false
}: Props) {
	const lowRef = useRef<HTMLButtonElement>(null)
	const highRef = useRef<HTMLButtonElement>(null)
	const slider = useRef<HTMLDivElement>(null)

	interface DragState {
		active: boolean
		/** Whether the drag was initiated by touch. If false, it was initiated by the mouse */
		touch: boolean
		start: { mouse: number; button: number }
	}

	const [highDrag, setHighDrag] = useState<DragState>({
		active: false,
		touch: false,
		start: {
			mouse: -1,
			button: -1
		}
	})

	const [lowDrag, setLowDrag] = useState<DragState>({
		active: false,
		touch: false,
		start: {
			mouse: -1,
			button: -1
		}
	})

	const [lowInput, setLowInput] = useState(lowSelected.toString())
	const [highInput, setHighInput] = useState(highSelected.toString())

	const id = useId()

	function toClosestStep(n: number) {
		if (n < min) return min
		if (n > max) return max

		const val = n + step / 2 - ((n + step / 2 - min) % step)
		// clamp value within allowed range in the case that the closest step goes outside this range
		return Math.min(Math.max(val, min), max)
	}

	function numberToPercent(n: number) {
		if (n < min) return 0
		if (n > max) return 100

		return (100 * (toClosestStep(n) - min)) / (max - min)
	}

	/** Convert a percent (0 - 1) within the slider to a value within the range */
	function percentToNumber(p: number) {
		if (p <= 0) return min
		if (p >= 1) return max

		return toClosestStep(min + p * (max - min))
	}

	function isValidValue(value: number, handle: 'high' | 'low') {
		const isStep = value === toClosestStep(value)
		const isWithinRange = value >= min && value <= max
		const isValidRelativeToSelections =
			handle === 'high' ? value >= lowSelected : value <= highSelected

		return isStep && isWithinRange && isValidRelativeToSelections
	}

	function onMouseDown(e: React.MouseEvent, handle: 'high' | 'low') {
		const buttonRect = (handle === 'high' ? highRef : lowRef).current!.getBoundingClientRect()

		const setState = handle === 'high' ? setHighDrag : setLowDrag

		setState({
			active: true,
			touch: false,
			start: { mouse: e.pageX, button: buttonRect.left + buttonRect.width / 2 }
		})
	}

	function onTouchDown(e: React.TouchEvent<HTMLElement>, handle: 'high' | 'low') {
		const setState = handle === 'high' ? setHighDrag : setLowDrag

		setState({
			active: true,
			touch: true,
			start: { mouse: e.touches[0].pageX, button: e.touches[0].pageX }
		})
	}

	function onMouseDrag(e: MouseEvent, handle: 'high' | 'low') {
		onDrag(e.pageX, handle)
	}

	function onTouchDrag(e: TouchEvent, handle: 'high' | 'low') {
		onDrag(e.touches[0].pageX, handle)
	}

	function onDrag(x: number, handle: 'high' | 'low') {
		const dragState = handle === 'high' ? highDrag : lowDrag
		const sliderRect = slider.current!.getBoundingClientRect()
		// Position within the slider
		const pos = x - (dragState.start.mouse - dragState.start.button) - sliderRect.left
		const posPct = pos / sliderRect.width
		const newValue = percentToNumber(posPct)

		if (isValidValue(newValue, handle)) {
			const onChange = handle === 'high' ? onHighChange : onLowChange
			onChange(newValue)
		}
	}

	function onDragEnd(handle: 'high' | 'low') {
		const setState = handle === 'high' ? setHighDrag : setLowDrag
		setState({ active: false, touch: false, start: { mouse: -1, button: -1 } })
	}

	function onKeyDown(e: React.KeyboardEvent, handle: 'low' | 'high') {
		const onChange = handle === 'high' ? onHighChange : onLowChange
		const value = handle === 'high' ? highSelected : lowSelected

		if (['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
			e.preventDefault()
		}

		const newValue = (() => {
			switch (e.key) {
				case 'ArrowRight':
				case 'ArrowUp':
					return toClosestStep(value + step)
				case 'ArrowLeft':
				case 'ArrowDown':
					return toClosestStep(value - step)
				case 'Home':
					return handle === 'low' ? min : lowSelected
				case 'End':
					return handle === 'low' ? highSelected : max
				default:
					return value
			}
		})()

		if (newValue !== value && isValidValue(newValue, handle)) {
			onChange(newValue)
		}
	}

	function updateInput(e: React.ChangeEvent<HTMLInputElement>, handle: 'low' | 'high') {
		const setState = handle === 'low' ? setLowInput : setHighInput
		const onChange = handle === 'low' ? onLowChange : onHighChange

		setState(e.target.value)
		if (isValidValue(parseInt(e.target.value), handle)) {
			onChange(parseInt(e.target.value))
		}
	}

	useEffect(() => {
		function _onMouseMove(e: MouseEvent) {
			onMouseDrag(e, 'high')
		}

		function _onMouseUp() {
			onDragEnd('high')
		}

		function _onTouchMove(e: TouchEvent) {
			onTouchDrag(e, 'high')
		}

		function _onTouchEnd() {
			onDragEnd('high')
		}

		if (highDrag.active && !highDrag.touch) {
			window.addEventListener('mousemove', _onMouseMove)
			window.addEventListener('mouseup', _onMouseUp)
		}

		if (highDrag.active && highDrag.touch) {
			window.addEventListener('touchmove', _onTouchMove)
			window.addEventListener('touchend', _onTouchEnd)
		}

		return () => {
			window.removeEventListener('mousemove', _onMouseMove)
			window.removeEventListener('mouseup', _onMouseUp)
			window.removeEventListener('touchmove', _onTouchMove)
			window.removeEventListener('touchend', _onTouchEnd)
		}
	}, [highDrag])

	useEffect(() => {
		function _onMouseMove(e: MouseEvent) {
			onMouseDrag(e, 'low')
		}

		function _onMouseUp() {
			onDragEnd('low')
		}

		function _onTouchMove(e: TouchEvent) {
			onTouchDrag(e, 'low')
		}

		function _onTouchEnd() {
			onDragEnd('low')
		}

		if (lowDrag.active && !lowDrag.touch) {
			window.addEventListener('mousemove', _onMouseMove)
			window.addEventListener('mouseup', _onMouseUp)
		}

		if (lowDrag.active && lowDrag.touch) {
			window.addEventListener('touchmove', _onTouchMove)
			window.addEventListener('touchend', _onTouchEnd)
		}

		return () => {
			window.removeEventListener('mousemove', _onMouseMove)
			window.removeEventListener('mouseup', _onMouseUp)
			window.removeEventListener('touchmove', _onTouchMove)
			window.removeEventListener('touchend', _onTouchEnd)
		}
	}, [lowDrag])

	useEffect(() => {
		// only update if not already matching, to stop unnecessary rerenders
		if (lowInput !== lowSelected.toString()) {
			setLowInput(lowSelected.toString())
		}
	}, [lowSelected])

	useEffect(() => {
		// only update if not already matching, to stop unnecessary rerenders
		if (highInput !== highSelected.toString()) {
			setHighInput(highSelected.toString())
		}
	}, [highSelected])

	useLayoutEffect(() => {
		if (!slider.current) return

		slider.current.style.setProperty('--range-low-position', `${numberToPercent(lowSelected)}%`)
		slider.current.style.setProperty('--range-high-position', `${numberToPercent(highSelected)}%`)
	}, [min, max, lowSelected, highSelected, step])

	return (
		<div className={styles['container']}>
			<div
				role="slider"
				aria-valuemin={min}
				aria-valuemax={max}
				// No aria-valuenow since it doesn't make sense with this setup
				// Maybe a better way to do this?
				aria-valuetext={`${lowSelected} to ${highSelected}`}
				aria-label={ariaLabel}
				className={styles['slider']}
				ref={slider}
			>
				<button
					type="button"
					aria-labelledby={`${id}-low`}
					className={createClasses({
						[styles['handle']]: true,
						[styles['handle--low']]: true,
						[styles['handle--dragging']]: lowDrag.active
					})}
					// Need both mouse and touch handlers to do essentially the same thing
					// Mouse is for devices with mice, Touch is for devices with touchscreen
					onMouseDown={(e) => onMouseDown(e, 'low')}
					onTouchStart={(e) => onTouchDown(e, 'low')}
					onKeyDown={(e) => onKeyDown(e, 'low')}
					ref={lowRef}
				>
					<span id={`${id}-low`} className={styles['handle__label']}>
						{lowSelected}
					</span>
				</button>
				<button
					type="button"
					aria-labelledby={`${id}-high`}
					className={createClasses({
						[styles['handle']]: true,
						[styles['handle--high']]: true,
						[styles['handle--dragging']]: highDrag.active
					})}
					onMouseDown={(e) => onMouseDown(e, 'high')}
					onTouchStart={(e) => onTouchDown(e, 'high')}
					onKeyDown={(e) => onKeyDown(e, 'high')}
					ref={highRef}
				>
					<span id={`${id}-high`} className={styles['handle__label']}>
						{highSelected}
					</span>
				</button>
				<div className={styles['line']} />
				<div className={styles['selected-line']} />
			</div>
			{!hideInputs && (
				<div className={styles['inputs']}>
					<Input
						id={`${id}-low-input`}
						wrapperClassName={styles['input-wrapper']}
						inputClassName={styles['input-wrapper__input']}
						type="number"
						text={lowInput}
						onChange={(e) => updateInput(e, 'low')}
						onBlur={() => setLowInput(lowSelected.toString())}
						units="words"
						min={min}
						max={max}
						step={step}
					/>
					<div className={styles['inputs__separator']} />
					<Input
						id={`${id}-high-input`}
						wrapperClassName={styles['input-wrapper']}
						inputClassName={styles['input-wrapper__input']}
						type="number"
						text={highInput}
						onChange={(e) => updateInput(e, 'high')}
						onBlur={() => setHighInput(highSelected.toString())}
						units="words"
						min={min}
						max={max}
						step={step}
					/>
				</div>
			)}
		</div>
	)
}
