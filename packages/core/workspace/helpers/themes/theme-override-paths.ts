/** Removes one dot-path key from a plain overrides object. */
export function deleteOverrideAtPath(
  target: Record<string, unknown>,
  path: string,
): void {
  const keys = path.split(".").filter(Boolean)
  if (keys.length === 0) return
  let cur: Record<string, unknown> = target
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]!
    const next = cur[k]
    if (typeof next !== "object" || next === null || Array.isArray(next)) {
      return
    }
    cur = next as Record<string, unknown>
  }
  delete cur[keys[keys.length - 1]!]
}
