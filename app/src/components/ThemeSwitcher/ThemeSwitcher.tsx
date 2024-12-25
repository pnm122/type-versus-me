import styles from './style.module.scss'
import { useTheme } from '@/context/Theme'
import PixelarticonsSunAlt from '~icons/pixelarticons/sun-alt'
import PixelarticonsMoon from '~icons/pixelarticons/moon'
import createClasses from '@/utils/createClasses'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

export default function ThemeSwitcher() {
	const { theme, setTheme } = useTheme()
	const background = useRef<HTMLDivElement>(null)
	const lightTheme = useRef<HTMLDivElement>(null)
	const darkTheme = useRef<HTMLDivElement>(null)
	const [rendered, setRendered] = useState(false)

	const isLightTheme = theme === 'light'

	useLayoutEffect(() => {
		updateBackgroundPosition()
	}, [theme])

	useEffect(() => {
		// Force setRendered to be called after the width and transform of the background have been set
		// Otherwise, they seem to get batched together, causing the transition to still appear
		requestAnimationFrame(() => setRendered(true))
	}, [])

	function updateBackgroundPosition() {
		if (!background.current || !lightTheme.current || !darkTheme.current) return

		const { offsetLeft, offsetWidth } = isLightTheme ? lightTheme.current : darkTheme.current
		background.current.style.width = `${offsetWidth}px`
		background.current.style.transform = `translate(${offsetLeft}px)`
	}

	return (
		<button
			role="checkbox"
			aria-checked={isLightTheme}
			aria-label="Use light mode"
			className={createClasses({
				[styles['switcher']]: true,
				[styles['switcher--rendered']]: rendered
			})}
			onClick={() => setTheme(isLightTheme ? 'dark' : 'light')}
		>
			<div ref={background} className={styles['switcher__selected-background']} />
			<div
				ref={darkTheme}
				className={createClasses({
					[styles['theme']]: true,
					[styles['theme--selected']]: !isLightTheme
				})}
			>
				<PixelarticonsMoon className={styles['theme__icon']} />
				<p className={styles['theme__text']}>Dark</p>
			</div>
			<div
				ref={lightTheme}
				className={createClasses({
					[styles['theme']]: true,
					[styles['theme--selected']]: isLightTheme
				})}
			>
				<PixelarticonsSunAlt className={styles['theme__icon']} />
				<p className={styles['theme__text']}>Light</p>
			</div>
		</button>
	)
}
