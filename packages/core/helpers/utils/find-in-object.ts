/**
 * Find a value in an object using a dot-notation path
 *
 * @param object - The object to search
 * @param path - The path to search for (e.g., "user.address.street")
 * @returns The value at the path or undefined if not found
 */
export function findInObject<Result = unknown>(
  object: object,
  path: string,
): Result | undefined {
  const keys = path.split(".")
  let result: unknown = object

  for (const key of keys) {
    if (result == null || typeof result !== "object") return
    result = (result as Record<string, unknown>)[key]
  }

  return result as Result
}
