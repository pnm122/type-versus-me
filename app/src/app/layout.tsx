import type { Metadata } from 'next'
import '@/scss/index.scss'
import { SocketProvider } from '@/context/Socket'
import { NotificationProvider } from '@/context/Notification'
import { AuthProvider } from '@/context/Auth'
import { ThemeProvider } from 'next-themes'
import Header from '@/components/shared/Header/Header'
import { SessionProvider } from 'next-auth/react'
import LeaveRoomHandler from '@/components/shared/LeaveRoomHandler/LeaveRoomHandler'

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
					<SessionProvider>
						<AuthProvider>
							<NotificationProvider>
								<SocketProvider>
									<LeaveRoomHandler />
									<Header />
									{children}
								</SocketProvider>
							</NotificationProvider>
						</AuthProvider>
					</SessionProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
