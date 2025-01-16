import StatsContentClient from './StatsContentClient'

export default async function StatsContentServer() {
	// eslint-disable-next-line
	const _ = await new Promise((res) => setTimeout(res, 2000))

	return <StatsContentClient />
}
