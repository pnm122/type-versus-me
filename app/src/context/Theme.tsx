'use client'

import * as storage from '@/utils/localStorage'
import { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

export interface ThemeContext {
	/** Theme of the application */
	theme: Theme
	/** Update the theme of the application */
	setTheme: React.Dispatch<React.SetStateAction<Theme>>
}

const ThemeContext = createContext<ThemeContext>({
	theme: 'light',
	setTheme: () => {}
})

export function ThemeProvider({ children }: React.PropsWithChildren) {
	const [theme, setTheme] = useState<Theme>('light')

	useEffect(() => {
		// Can't use browser APIs in the server, so this is the earliest this can be done
		// Can cause a flash of the wrong theme, how can this possibly be the best solution??
		setTheme(
			storage.get<Theme>(
				'theme',
				window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
			)
		)
	}, [])

	useEffect(() => {
		storage.set('theme', theme)
	}, [theme])

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			<div data-theme={theme}>{children}</div>
		</ThemeContext.Provider>
	)
}

export const useTheme = () => useContext(ThemeContext)
