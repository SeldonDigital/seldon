/**
 * Resolves the source MATCH reads: the node's own `background.color`. The `#self.` prefix walks
 * ancestors while the layer is empty or transparent until a contributing color appears.
 */
export function resolveMatchSource(): string {
  return "#self.background.color"
}
