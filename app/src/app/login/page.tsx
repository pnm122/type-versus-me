import Login from '@/components/page/login/Login/Login'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Login',
	description: 'Login to typevs.me to start saving your stats and unlocking new items!'
}

export default function Page() {
	return <Login />
}
