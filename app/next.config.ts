import type { NextConfig } from 'next'
import UnpluginIcons from 'unplugin-icons/webpack'

const nextConfig: NextConfig = {
	webpack(config) {
		config.plugins.push(
			UnpluginIcons({
				compiler: 'jsx',
				jsx: 'react',
				autoInstall: true
			})
		)

		return config
	},
	sassOptions: {
		silenceDeprecations: ['legacy-js-api']
	},
	async redirects() {
		return [
			{
				source: '/leaderboard',
				destination: '/leaderboard/points',
				permanent: true
			}
		]
	}
}

export default nextConfig
