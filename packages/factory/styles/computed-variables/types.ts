import type { Value } from "@seldon/core"
import type {
  ComputeContext,
  ComputeKeys,
} from "@seldon/core/properties/compute"
import type { Theme } from "@seldon/core/themes/types"

export interface ComputedVariableReferenceArgs {
  /** Pre-compute property cell: `{ type: COMPUTED, value: ComputedFunction }`. */
  original: Value
  /** Theme and parent chain for resolving the compute source. */
  context: ComputeContext
  /** Property being computed, e.g. the padding side for optical padding. */
  keys?: ComputeKeys
}

/**
 * One computed function's theming behavior. `reference` returns a bare `var(--sdn-...)` for a single
 * computed property instance, or null to keep the baked literal. The referenced variable is defined
 * by every theme, including the seldon `:root` block, so the seldon default is the customizable
 * baseline. `emit` writes this function's variable declarations for one theme, or "" when the
 * function reuses existing token variables.
 */
export interface ComputedVariableStrategy {
  reference(args: ComputedVariableReferenceArgs): string | null
  emit(theme: Theme): string
}
