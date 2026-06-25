/**
 * Resolves the source MATCH_COLOR reads: the node's own `background.color`. The `#self.` prefix walks
 * ancestors while the layer is empty or transparent until a contributing color appears.
 */
export function resolveMatchColorSource(): string {
  return "#self.background.color"
}
