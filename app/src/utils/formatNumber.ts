export default function formatNumber(n: number, compact = false) {
	return Intl.NumberFormat('en-US', { notation: compact ? 'compact' : undefined }).format(n)
}
