import type { NextConfig } from 'next'
import path from 'path'
import UnpluginIcons from 'unplugin-icons/webpack'

const nextConfig: NextConfig = {
	webpack(config) {
		config.plugins.push(UnpluginIcons({ compiler: 'jsx', jsx: 'react', autoInstall: true }))

		return config
	},
	sassOptions: { silenceDeprecations: ['legacy-js-api'] },
	async redirects() {
		return [{ source: '/leaderboard', destination: '/leaderboard/points', permanent: true }]
	},
	outputFileTracingRoot: path.join(__dirname, '..'),
	allowedDevOrigins: ['192.168.0.141']
}

export default nextConfig
