import { getUser } from '$shared/utils/database/user'
import { NextResponse } from 'next/server'

export async function GET(_: any, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	const { data, error } = await getUser(id)

	if (!error && !data) {
		return NextResponse.json({}, { status: 404 })
	}

	if (error) {
		return NextResponse.json({}, { status: 500 })
	}

	return NextResponse.json(data)
}
