/**
 * Get a nested value from an object using a dot notation path.
 * @param obj - The object to get the nested value from.
 * @param path - The dot notation path to the nested value.
 * @returns The nested value or undefined if the path is not found.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getNested<T = unknown>(obj: Record<any, any>, path: string) {
  const value = path.split(".").reduce((value, key) => value?.[key], obj)
  if (value === undefined) {
    return undefined
  }
  return value as T
}
