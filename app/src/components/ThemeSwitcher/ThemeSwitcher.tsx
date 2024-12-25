import styles from './style.module.scss'
import PixelarticonsSunAlt from '~icons/pixelarticons/sun-alt'
import PixelarticonsMoon from '~icons/pixelarticons/moon'
import createClasses from '@/utils/createClasses'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

export default function ThemeSwitcher() {
	const { theme, setTheme } = useTheme()
	const background = useRef<HTMLDivElement>(null)
	const lightTheme = useRef<HTMLDivElement>(null)
	const darkTheme = useRef<HTMLDivElement>(null)
	// Set to true after the initial render
	// Suppresses hydration warning caused by next-themes
	const [mounted, setMounted] = useState(false)

	const isLightTheme = theme === 'light'

	useLayoutEffect(() => {
		updateBackgroundPosition()
	}, [theme, mounted])

	useEffect(() => {
		setMounted(true)
	}, [])

	function updateBackgroundPosition() {
		if (!background.current || !lightTheme.current || !darkTheme.current) return

		const { offsetLeft, offsetWidth } = isLightTheme ? lightTheme.current : darkTheme.current
		background.current.style.width = `${offsetWidth}px`
		background.current.style.transform = `translate(${offsetLeft}px)`
		// Add transition class AFTER render so the transition doesn't happen on the first render
		requestAnimationFrame(() => {
			background.current?.classList.add(styles['switcher__selected-background--transition'])
		})
	}

	return (
		<button
			role="checkbox"
			// Only set properties relying on the theme state after mounting to avoid hydration errors
			aria-checked={mounted && isLightTheme}
			aria-label="Use light mode"
			className={styles['switcher']}
			onClick={() => setTheme(isLightTheme ? 'dark' : 'light')}
		>
			<div ref={background} className={styles['switcher__selected-background']} />
			<div
				ref={darkTheme}
				className={createClasses({
					[styles['theme']]: true,
					[styles['theme--selected']]: mounted && !isLightTheme
				})}
			>
				<PixelarticonsMoon className={styles['theme__icon']} />
				<p className={styles['theme__text']}>Dark</p>
			</div>
			<div
				ref={lightTheme}
				className={createClasses({
					[styles['theme']]: true,
					[styles['theme--selected']]: mounted && isLightTheme
				})}
			>
				<PixelarticonsSunAlt className={styles['theme__icon']} />
				<p className={styles['theme__text']}>Light</p>
			</div>
		</button>
	)
}
