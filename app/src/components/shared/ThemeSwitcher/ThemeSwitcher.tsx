'use client'

import styles from './style.module.scss'
import PixelarticonsSunAlt from '~icons/pixelarticons/sun-alt'
import PixelarticonsMoon from '~icons/pixelarticons/moon'
import PixelarticonsDeviceLaptop from '~icons/pixelarticons/device-laptop'
import { useEffect, useId, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import SelectedBox from '@/components/base/SelectedBox/SelectedBox'

export default function ThemeSwitcher({
	ref
}: {
	ref?: React.RefObject<HTMLFieldSetElement | null>
}) {
	const { theme, setTheme } = useTheme()
	const id = useId()
	const lightRef = useRef<HTMLLabelElement>(null)
	const darkRef = useRef<HTMLLabelElement>(null)
	const systemRef = useRef<HTMLLabelElement>(null)
	// Set to true after the initial render
	// Suppresses hydration warning caused by next-themes
	const [mounted, setMounted] = useState(false)

	const selectedRef = theme === 'system' ? systemRef : theme === 'light' ? lightRef : darkRef

	useEffect(() => {
		setMounted(true)
	}, [])

	return (
		<fieldset ref={ref} className={styles['switcher']} aria-label="Switch themes">
			<div className={styles['themes']}>
				<SelectedBox
					className={styles['themes__selected-box']}
					selected={mounted ? selectedRef : undefined}
				/>
				<label
					ref={systemRef}
					className={styles['theme']}
					htmlFor={`theme-system-${id}`}
					aria-label="System"
				>
					<PixelarticonsDeviceLaptop className={styles['theme__icon']} />
					<input
						name={`theme-switcher-${id}`}
						id={`theme-system-${id}`}
						type="radio"
						checked={theme === 'system'}
						onChange={() => setTheme('system')}
						className={styles['theme__radio']}
					/>
				</label>
				<label
					ref={darkRef}
					className={styles['theme']}
					htmlFor={`theme-dark-${id}`}
					aria-label="Dark"
				>
					<PixelarticonsMoon className={styles['theme__icon']} />
					<input
						name={`theme-switcher-${id}`}
						id={`theme-dark-${id}`}
						type="radio"
						checked={theme === 'dark'}
						onChange={() => setTheme('dark')}
						className={styles['theme__radio']}
					/>
				</label>
				<label
					ref={lightRef}
					className={styles['theme']}
					htmlFor={`theme-light-${id}`}
					aria-label="Light"
				>
					<PixelarticonsSunAlt className={styles['theme__icon']} />
					{/* <span className={styles['theme__text']}>Light</span> */}
					<input
						name={`theme-switcher-${id}`}
						id={`theme-light-${id}`}
						type="radio"
						checked={theme === 'light'}
						onChange={() => setTheme('light')}
						className={styles['theme__radio']}
					/>
				</label>
			</div>
		</fieldset>
	)
}
