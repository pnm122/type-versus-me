import { getAllUserIds } from '$shared/utils/database/user'
import { MetadataRoute } from 'next'

// Revalidate every 24 hours
export const revalidate = 86400

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const { data: allUserIds } = await getAllUserIds()

	return [
		{
			url: 'https://typevs.me'
		},
		{
			url: 'https://typevs.me/login'
		},
		...(allUserIds?.map((id) => ({
			url: `https://typevs.me/profile/${id}`
		})) ?? [])
	]
}
