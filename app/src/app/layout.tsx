import type { Metadata } from 'next'
import '@/scss/index.scss'
import { SocketProvider } from '@/context/Socket'
import { NotificationProvider } from '@/context/Notification'
import { AuthProvider } from '@/context/Auth'
import { ThemeProvider } from 'next-themes'
import Header from '@/components/shared/Header/Header'
import { SessionProvider } from 'next-auth/react'
import { RoomProvider } from '@/context/Room'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
	title: {
		default: 'typevs.me',
		template: '%s | typevs.me'
	},
	description: 'Race your friends in head-to-head typing competitions!',
	icons: ['/favicon.svg'],
	openGraph: {
		title: 'Race your friends in head-to-head typing competitions at typevs.me!',
		images: '/opengraph/home.png'
	}
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<Analytics />
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
									<RoomProvider>
										<Header />
										{children}
									</RoomProvider>
								</SocketProvider>
							</NotificationProvider>
						</AuthProvider>
					</SessionProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
