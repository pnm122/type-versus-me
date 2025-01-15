import RacesContentClient from './RacesContentClient'

export default async function RacesContentServer() {
	// eslint-disable-next-line
	const _ = await new Promise((res) => setTimeout(res, 2000))

	return <RacesContentClient />
}
