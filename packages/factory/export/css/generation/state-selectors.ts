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
