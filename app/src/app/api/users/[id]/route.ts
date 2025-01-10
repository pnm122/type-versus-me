import { getUser } from '@/utils/database/user'
import { NextResponse } from 'next/server'

export async function GET(_: any, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	const res = await getUser(id)

	if (!res) {
		return NextResponse.json({}, { status: 404 })
	}

	return NextResponse.json(res)
}
