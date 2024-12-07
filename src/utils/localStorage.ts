const PREFIX = 'app-' as const

function formatKey(s: string) {
  return `${PREFIX}${s}`
}

function valueFromStorage<T = any>(s: string | null) {
  if(!s) return null

  try {
    return JSON.parse(s) as T
  } catch {
    return s as T
  }
}

export function get<T extends Object = any>(key: string, insert: T): T
export function get<T extends Object = any>(key: string): T | null

export function get<T extends Object = any>(key: string, insert?: T) {
  const value = valueFromStorage<T>(localStorage.getItem(formatKey(key)))

  if(value) return value

  if(insert) {
    return set<T>(key, insert)
  }
}

export function set<T extends Object = any>(key: string, value: T) {
  localStorage.setItem(formatKey(key), value.toString())
  return value
}