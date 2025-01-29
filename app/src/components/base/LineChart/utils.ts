interface Point {
	x: number
	y: number
	percent?: boolean
}

type AbsolutePoint = Omit<Point, 'percent'>

export interface Region<T extends string> {
	name: T
	from: Point
	to: Point
}

interface AbsoluteRegion {
	from: Point
	to: Point
	width: number
	height: number
}

interface Line {
	from: Point
	to: Point
}

interface Rectangle {
	from: Point
	to: Point
}

export class Canvas<T extends string> {
	private canvas: HTMLCanvasElement
	private regions?: Region<T>[]

	constructor(canvas: HTMLCanvasElement, regions?: Region<T>[]) {
		this.canvas = canvas
		this.regions = regions
	}

	private getAbsoluteRegion(region: T): AbsoluteRegion | null {
		const r = this.regions?.find((r) => r.name === region)
		if (!r) return null

		const p1 = this.getAbsolutePoint(r.from)
		const p2 = this.getAbsolutePoint(r.to)

		const from = { x: Math.min(p1.x, p2.x), y: Math.min(p1.y, p2.y) }
		const to = { x: Math.max(p1.x, p2.x), y: Math.max(p1.y, p2.y) }

		return {
			from,
			to,
			width: Math.abs(from.x - to.x),
			height: Math.abs(from.y - to.y)
		}
	}

	private getAbsolutePoint({ x, y, percent }: Point): AbsolutePoint {
		return percent
			? { x: this.canvas.width * x, y: this.canvas.height * y }
			: {
					x,
					y
				}
	}

	private getAbsolutePointInRegion({ x, y, percent }: Point, region: T) {
		const absoluteRegion = this.getAbsoluteRegion(region)
		if (!absoluteRegion) return null

		const { from, width, height } = absoluteRegion

		return {
			x: from.x + (percent ? width * x : x),
			y: from.y + (percent ? height * y : y)
		}
	}

	getRegions() {
		return this.regions
	}

	drawLineInRegion(
		line: Line,
		region: T,
		color?: string
	): { from: AbsolutePoint; to: AbsolutePoint } | null {
		const from = this.getAbsolutePointInRegion(line.from, region)
		const to = this.getAbsolutePointInRegion(line.to, region)
		if (!from || !to) return null

		const ctx = this.canvas.getContext('2d')
		if (!ctx) return null

		ctx.strokeStyle = color ?? 'gray'
		ctx.moveTo(from.x, from.y)
		ctx.lineTo(to.x, to.y)
		ctx.stroke()

		return { from, to }
	}

	drawRectInRegion(
		rectangle: Rectangle,
		region: T,
		{ stroke, fill }: { stroke?: string; fill?: string }
	) {
		const from = this.getAbsolutePointInRegion(rectangle.from, region)
		const to = this.getAbsolutePointInRegion(rectangle.to, region)
		if (!from || !to) return null

		const ctx = this.canvas.getContext('2d')
		if (!ctx) return null

		if (stroke) {
			ctx.strokeStyle = stroke
			ctx.strokeRect(from.x, from.y, to.x - from.x, to.y - from.y)
		}
		if (fill) {
			ctx.fillStyle = fill
			ctx.fillRect(from.x, from.y, to.x - from.x, to.y - from.y)
		}

		return { from, to }
	}
}
