/**
 * Redaction: `credentials` (font/icon/media boards carry
 * Bearer tokens Factory uses to fetch private assets) and `__editor`
 * bookkeeping must never enter model context. Every tool result passes
 * through here before serialization — tools apply it at their return site and
 * the server wrapper applies it again as defense in depth.
 */
const REDACTED_KEYS = new Set(["credentials", "__editor"])

/**
 * Deep-copies a JSON-shaped value, dropping every property named
 * `credentials` or `__editor` at any depth. Primitives pass through.
 */
export function redactValue<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => redactValue(item)) as T
  }

  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {}
    for (const [key, entry] of Object.entries(value)) {
      if (REDACTED_KEYS.has(key)) continue
      result[key] = redactValue(entry)
    }
    return result as T
  }

  return value
}
