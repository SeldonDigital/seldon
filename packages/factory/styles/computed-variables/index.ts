import { ComputedFunction, type Value, ValueType } from "@seldon/core"
import type {
  ComputeContext,
  ComputeKeys,
} from "@seldon/core/properties/compute"
import type { Theme } from "@seldon/core/themes/types"

import { autoFitStrategy } from "./auto-fit.strategy"
import { highContrastStrategy } from "./high-contrast.strategy"
import { opticalPaddingStrategy } from "./optical-padding.strategy"
import { ComputedVariableStrategy } from "./types"

export type { ComputedVariableStrategy } from "./types"

/**
 * The single extension point for theming computed values. Add an entry to give a `ComputedFunction`
 * theme-swapping CSS variables. A `family` strategy emits its own per-theme variables; a function
 * whose result is already a theme token (Match Color) needs no entry because the existing swatch
 * variable path themes it.
 */
const COMPUTED_VARIABLE_STRATEGIES: Partial<
  Record<ComputedFunction, ComputedVariableStrategy>
> = {
  [ComputedFunction.HIGH_CONTRAST_COLOR]: highContrastStrategy,
  [ComputedFunction.AUTO_FIT]: autoFitStrategy,
  [ComputedFunction.OPTICAL_PADDING]: opticalPaddingStrategy,
}

function isComputedCell(
  value: Value | undefined,
): value is { type: ValueType.COMPUTED; value: ComputedFunction } {
  return (
    !!value &&
    typeof value === "object" &&
    "type" in value &&
    value.type === ValueType.COMPUTED
  )
}

/**
 * Returns a theme-swapping `var(--sdn-...)` for a computed property instance, or null to keep the
 * baked literal. Callers pass the pre-compute cell as `original`; when it is not computed, has no
 * strategy, or the strategy cannot reference a variable, this returns null and the caller emits the
 * literal it already resolved. The referenced variable is always defined, with the seldon `:root`
 * block as the customizable baseline, so no literal fallback is baked into the reference.
 */
export function getComputedCssValue({
  original,
  context,
  keys,
}: {
  original: Value | undefined
  context: ComputeContext
  keys?: ComputeKeys
}): string | null {
  if (!isComputedCell(original)) return null

  const strategy = COMPUTED_VARIABLE_STRATEGIES[original.value]
  if (!strategy) return null

  return strategy.reference({ original, context, keys })
}

/** Concatenates every strategy's variable declarations for one theme, scoped by the caller. */
export function emitComputedThemeVariables(theme: Theme): string {
  let out = ""
  for (const strategy of Object.values(COMPUTED_VARIABLE_STRATEGIES)) {
    out += strategy.emit(theme)
  }
  return out
}
