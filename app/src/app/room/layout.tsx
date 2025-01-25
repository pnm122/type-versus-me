import { RoomProvider } from '@/context/Room'

export default function RoomLayout({ children }: React.PropsWithChildren) {
	return <RoomProvider>{children}</RoomProvider>
}
