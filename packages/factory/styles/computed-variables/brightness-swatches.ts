/**
 * Per-export registry of brightness-shifted swatch usages. A swatch color with a
 * non-zero brightness cannot ride the plain `--sdn-swatch-{slot}` variable, so
 * the export publishes a dedicated variable holding the concrete brightened
 * color and every matching usage references it. Style generation records each
 * `(slot, brightness)` pair it emits; the theme-variable and high-contrast
 * emitters read the collected set to publish one variable per pair, per theme.
 *
 * The registry is reset at the start of each export run so a run only publishes
 * the pairs it actually uses.
 */
export interface BrightnessSwatch {
  slot: string
  brightness: number
}

const registry = new Map<string, BrightnessSwatch>()

/** Clears the collected pairs. Call once at the start of an export run. */
export function resetBrightnessSwatches(): void {
  registry.clear()
}

/** Records a referenceable swatch slot used with a non-zero brightness. */
export function recordBrightnessSwatch(slot: string, brightness: number): void {
  if (brightness === 0) return
  registry.set(`${slot}:${brightness}`, { slot, brightness })
}

/** Every distinct `(slot, brightness)` pair recorded this run. */
export function getBrightnessSwatches(): BrightnessSwatch[] {
  return [...registry.values()]
}
