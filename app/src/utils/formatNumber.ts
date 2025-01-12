export default function formatNumber(n: number) {
	return Intl.NumberFormat('en-US').format(n)
}
