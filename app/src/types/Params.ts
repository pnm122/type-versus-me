export type DefaultSearchParams = Record<string, string | string[] | undefined>
export type DefaultParams = Record<string, string | string[] | undefined>

export interface ServerParams<
	T extends DefaultSearchParams = DefaultSearchParams,
	K extends DefaultParams = DefaultParams
> {
	searchParams: Promise<T>
	params: Promise<K>
}
