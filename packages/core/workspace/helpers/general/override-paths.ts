/**
 * Dot-path read, write, and delete over a plain overrides object. Shared by the
 * theme, font-collection, and icon-set override handlers.
 */

/** Reads the value at one dot-path in a plain overrides object, or undefined. */
export function getOverrideAtPath(
  target: Record<string, unknown>,
  path: string,
): unknown {
  const keys = path.split(".").filter(Boolean)
  let cur: unknown = target
  for (const key of keys) {
    if (cur == null || typeof cur !== "object" || Array.isArray(cur)) {
      return undefined
    }
    cur = (cur as Record<string, unknown>)[key]
  }
  return cur
}

/** Writes `value` at `path` inside a plain overrides object, creating intermediate objects. */
export function setOverrideAtPath(
  target: Record<string, unknown>,
  path: string,
  value: unknown,
): void {
  const keys = path.split(".").filter(Boolean)
  if (keys.length === 0) return
  let cur: Record<string, unknown> = target
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]!
    const next = cur[k]
    if (typeof next !== "object" || next === null || Array.isArray(next)) {
      cur[k] = {}
    }
    cur = cur[k] as Record<string, unknown>
  }
  cur[keys[keys.length - 1]!] = value
}

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
