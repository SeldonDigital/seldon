/**
 * Resolves the source HIGH_CONTRAST_COLOR contrasts against: the node's own `background.color`. The
 * `#self.` prefix walks ancestors while the layer is empty or transparent, so a node without its own
 * background contrasts against the nearest painting ancestor.
 */
export function resolveHighContrastSource(): string {
  return "#self.background.color"
}
