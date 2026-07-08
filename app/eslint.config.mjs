import { defineConfig } from 'eslint/config'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

export default defineConfig([
	{
		extends: [...nextCoreWebVitals, ...nextTypescript],
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'no-console': [
				'error',
				{
					allow: ['error']
				}
			],
			'react-hooks/exhaustive-deps': 'off',
			'react-hooks/set-state-in-effect': 'warn'
		},
		settings: {
			react: { version: '19' } // Avoids auto-detection crash (see https://github.com/vercel/next.js/issues/89764)
		}
	}
])
