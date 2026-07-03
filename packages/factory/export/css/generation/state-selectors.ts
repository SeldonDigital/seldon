import {
  type ReservedStateName,
  isReservedStateName,
} from "@seldon/core/workspace/model/node-state"

/**
 * React/CSS binding from a core interaction-state name to the CSS selector
 * suffixes appended to a node's class selector. This binding lives only in the
 * factory. Core stores no CSS, so other export targets define their own map for
 * the same state names.
 *
 * A state may bind to more than one suffix. The emitter groups them into a
 * single comma-separated rule, so a delta applies through any of the suffixes.
 *
 * The suffix kind matches the state's `RESERVED_STATE_EXPRESSION` in core: a
 * pseudo state uses a pseudo-class, an aria state an attribute, and a class
 * state a runtime-toggled `.sdn-state-{name}` class.
 */
const RESERVED_STATE_SELECTOR_SUFFIXES: Record<ReservedStateName, string[]> = {
  hover: [":hover"],
  focused: [":focus-visible"],
  active: [":active"],
  disabled: [":disabled", '[aria-disabled="true"]'],
  checked: [":checked"],
  error: ['[aria-invalid="true"]'],
  selected: ['[aria-selected="true"]'],
  dragged: [".sdn-state-dragged"],
  activated: [".sdn-state-activated"],
}

/**
 * React/CSS binding used when a state is triggered on an **ancestor** root
 * rather than the styled element itself. A container row owns the interaction,
 * and hovering or focusing anywhere inside it should restyle its descendants,
 * matching the canvas board preview that forces the state across the subtree.
 *
 * The suffixes differ from {@link RESERVED_STATE_SELECTOR_SUFFIXES} only where a
 * self pseudo-class does not propagate from a descendant: `focused` adds
 * `:has(:focus-visible)` and `checked` uses `:has(:checked)`. The rest already
 * match the ancestor when a descendant is in that state, or are attribute/class
 * hooks the view sets on the root.
 *
 * `focused` binds to visible focus only, not bare `:focus-within`, so a mouse
 * click paints `active` while it is held and leaves no lingering focus paint;
 * keyboard focus still styles the whole interaction root.
 */
const ANCESTOR_STATE_SELECTOR_SUFFIXES: Record<ReservedStateName, string[]> = {
  hover: [":hover"],
  focused: [":focus-visible", ":has(:focus-visible)"],
  active: [":active"],
  disabled: [":disabled", '[aria-disabled="true"]'],
  checked: [":has(:checked)"],
  error: ['[aria-invalid="true"]'],
  selected: ['[aria-selected="true"]'],
  dragged: [".sdn-state-dragged"],
  activated: [".sdn-state-activated"],
}

/** Runtime-toggled class prefix for custom states and the dragged state. */
export const STATE_CLASS_PREFIX = "sdn-state-"

/**
 * Returns the CSS selector suffixes for a state name. Reserved names use the
 * binding table. Custom names resolve to a runtime-toggled class
 * `.sdn-state-{key}`.
 */
export function getStateSelectorSuffixes(stateName: string): string[] {
  if (isReservedStateName(stateName)) {
    return RESERVED_STATE_SELECTOR_SUFFIXES[stateName]
  }
  return [`.${STATE_CLASS_PREFIX}${stateName}`]
}

/**
 * Returns the selector suffixes appended to an interaction-root's class when the
 * state is owned by that root and cascades to its descendants. Custom states use
 * the same runtime-toggled class as the self binding.
 */
export function getAncestorStateSelectorSuffixes(stateName: string): string[] {
  if (isReservedStateName(stateName)) {
    return ANCESTOR_STATE_SELECTOR_SUFFIXES[stateName]
  }
  return [`.${STATE_CLASS_PREFIX}${stateName}`]
}
