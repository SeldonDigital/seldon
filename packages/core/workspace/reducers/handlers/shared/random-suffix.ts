/** Short random base36 suffix for generated entry ids, e.g. `theme-earth-{suffix}`. */
export function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 10)
}
