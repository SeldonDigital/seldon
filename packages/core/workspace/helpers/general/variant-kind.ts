export function isDefaultVariantKind(entry: { type: string }): boolean {
  return entry.type === "default"
}

export function isVariantKind(entry: { type: string }): boolean {
  return entry.type === "variant"
}
