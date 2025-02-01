import RoomClient from '@/components/page/room/RoomClient/RoomClient'
import { DefaultSearchParams, ServerParams } from '@/types/Params'
import { Metadata } from 'next'

export async function generateMetadata(
	props: ServerParams<DefaultSearchParams, { roomId: string }>
): Promise<Metadata> {
	const { roomId } = await props.params

	return {
		title: `Room ${roomId}`,
		openGraph: {
			images: '/opengraph/room.png',
			title: 'Race me in a typing competition on typevs.me!'
		}
	}
}

export default function Page() {
	return <RoomClient />
}
