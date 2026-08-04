/**
 * Serializes a value with object keys sorted at every level so key order never
 * affects equality. The editor serializes measured values as `{ unit, value }`
 * while seeds and schemas author `{ value, unit }`, so a raw `JSON.stringify`
 * compare would miss values that are equal but authored in a different order.
 */
export function stableStringify(value: unknown): string {
  return JSON.stringify(value, (_key, val) => {
    if (val && typeof val === "object" && !Array.isArray(val)) {
      const record = val as Record<string, unknown>

      return Object.keys(record)
        .sort()
        .reduce<Record<string, unknown>>((sorted, key) => {
          sorted[key] = record[key]

          return sorted
        }, {})
    }

    return val
  })
}
