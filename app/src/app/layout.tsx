import type { Metadata } from 'next'
import '@/scss/index.scss'
import { SocketProvider } from '@/context/Socket'
import { NotificationProvider } from '@/context/Notification'
import { GlobalStateProvider } from '@/context/GlobalState'
import LeaveRoomHandler from '@/components/shared/LeaveRoomHandler/LeaveRoomHandler'
import { ThemeProvider } from 'next-themes'
import Header from '@/components/shared/Header/Header'

export const metadata: Metadata = {
	title: 'Typing Race',
	description: ''
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider
					storageKey="app-theme"
					themes={['light', 'dark']}
					defaultTheme="system"
					enableSystem
				>
					<NotificationProvider>
						<SocketProvider>
							<GlobalStateProvider>
								<LeaveRoomHandler />
								<Header />
								{children}
							</GlobalStateProvider>
						</SocketProvider>
					</NotificationProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
