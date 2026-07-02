import { Unit, ValueType } from "../constants"
import type { PercentageValue } from "../values/shared/exact/percentage"

/**
 * Value an EMPTY brightness/opacity facet renders as on any paint family. A
 * layer with no brightness shift reads at 0 percent, and a fully opaque layer
 * reads at 100 percent. `computeLayerColor` treats EMPTY brightness/opacity as
 * non-contributing for the same reason, and the background color seed writes
 * these same literals, so this is the one shared source both consumers agree on.
 */
const ANCHORED_FACET_DEFAULTS: Record<"brightness" | "opacity", PercentageValue> =
  {
    brightness: {
      type: ValueType.EXACT,
      value: { value: 0, unit: Unit.PERCENT },
    },
    opacity: {
      type: ValueType.EXACT,
      value: { value: 100, unit: Unit.PERCENT },
    },
  }

/**
 * Canonical value an unset brightness or opacity facet resolves to at render.
 * Covers the bare `brightness`/`opacity` facets on background, border, and
 * shadow, and the `start`/`end` prefixed gradient stop facets. Returns
 * `undefined` for any other facet, which has no fixed neutral to anchor to.
 */
export function getAnchoredFacetDefault(
  facet: string | undefined,
): PercentageValue | undefined {
  if (!facet) return undefined
  const normalized = facet.replace(/^(start|end)/, "").toLowerCase()
  if (normalized === "brightness") return ANCHORED_FACET_DEFAULTS.brightness
  if (normalized === "opacity") return ANCHORED_FACET_DEFAULTS.opacity
  return undefined
}
