/**
 * Returns a shallow copy of a slot prop object with any inline `style` removed,
 * so the exported component CSS is the only source of styling. Used while
 * aligning the static sidebar rows to the generated styles.
 */
export function withoutStyle<T extends object>(props: T): T {
  const next = { ...props }
  delete (next as { style?: unknown }).style
  return next
}
