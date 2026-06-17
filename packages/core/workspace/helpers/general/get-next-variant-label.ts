/** Next `{base} NN` label (NN zero-padded under 10) not already in use. */
export function getNextVariantLabel(
  base: string,
  existingLabels: Set<string>,
): string {
  const make = (n: number) => `${base} ${n < 10 ? `0${n}` : n}`
  let n = 1
  let label = make(n)
  while (existingLabels.has(label)) {
    n++
    label = make(n)
  }
  return label
}
