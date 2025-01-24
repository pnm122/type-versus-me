'use client'

import styles from './style.module.scss'
import PixelarticonsSunAlt from '~icons/pixelarticons/sun-alt'
import PixelarticonsMoon from '~icons/pixelarticons/moon'
import createClasses from '@/utils/createClasses'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import SelectedBox from '@/components/base/SelectedBox/SelectedBox'

export default function ThemeSwitcher({
	ref
}: {
	ref?: React.RefObject<HTMLButtonElement | null>
}) {
	const { theme, setTheme } = useTheme()
	const lightTheme = useRef<HTMLDivElement>(null)
	const darkTheme = useRef<HTMLDivElement>(null)
	// Set to true after the initial render
	// Suppresses hydration warning caused by next-themes
	const [mounted, setMounted] = useState(false)

	const isLightTheme = theme === 'light'

	useEffect(() => {
		setMounted(true)
	}, [])

	return (
		<button
			ref={ref}
			role="checkbox"
			// Only set properties relying on the theme state after mounting to avoid hydration errors
			aria-checked={mounted && isLightTheme}
			aria-label="Use light mode"
			className={styles['switcher']}
			onClick={() => setTheme(isLightTheme ? 'dark' : 'light')}
		>
			<SelectedBox selected={mounted ? (isLightTheme ? lightTheme : darkTheme) : undefined} />
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
