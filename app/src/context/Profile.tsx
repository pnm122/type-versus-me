import { User } from '@prisma/client'
import { createContext, useContext } from 'react'

interface ProfileContextType {
	user: User
}

export const ProfileContext = createContext<ProfileContextType>({
	user: {} as User
})

export const useProfile = () => useContext(ProfileContext)
