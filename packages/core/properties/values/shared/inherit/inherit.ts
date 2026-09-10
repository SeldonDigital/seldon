import type { ValueType } from "../../../constants"

/**
 * Explicit parent inheritance. `computeProperties` walks `parentContext` and
 * replaces this cell with the first contributing ancestor value. A look
 * `preset` set to inherit copies the parent compound, then overlays authored
 * child facets. The copy is read-side only and is not written to the workspace.
 * When no ancestor contributes a value, the cell stays inherit.
 */
export type InheritValue = {
  type: ValueType.INHERIT
  value: null
}
