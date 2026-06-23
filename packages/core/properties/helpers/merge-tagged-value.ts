function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

/**
 * Merges two tagged property values. Objects merge shallowly so a patch overrides matching keys;
 * non-objects replace. Computed values are bare markers (`value` is a `ComputedFunction`), so they
 * merge by replacement through the same object spread.
 */
export function mergeTaggedValues(existing: unknown, next: unknown): unknown {
  if (isRecord(existing) && isRecord(next)) {
    return { ...existing, ...next }
  }

  return next
}
