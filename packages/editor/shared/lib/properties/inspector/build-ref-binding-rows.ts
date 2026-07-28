import { describeBinding } from "@seldon/editor/lib/refs/describe-binding"
import { ValueType } from "@seldon/core"

import type { FlatProperty } from "./properties-data"
import type { BindingDescription } from "@seldon/editor/lib/refs/describe-binding"
import type { RefBinding } from "@seldon/editor/lib/refs/join-refs-and-bindings"

/**
 * Sub-rows listing what a referenced node is wired to: the generated components
 * that expose it as a prop, then the app code that drives it.
 *
 * The descriptions come from `@seldon/editor/lib/refs`, which the canvas card reads
 * too. A sidebar row is a name and a value, so only the view and consumer
 * descriptions fit here. The headings, the expressions, and the hooks behind them are
 * the card's job.
 *
 * Both sides are read-only. A row carries no `controlType`, which is what stops
 * the inspector from opening an editor on it, the same way a font license row
 * stays read-only.
 *
 * Keys use `#` rather than a dot for the index, because a child row must sit
 * exactly one segment under its parent. `childPathsUnderCompoundParent` rejects
 * anything deeper, so `reference.view#0` matches and `reference.view.0` does not.
 * The Repeat rows key their echoes the same way.
 */

const ROW_ICONS: Record<string, string> = {
  view: "seldon-component",
  consumer: "seldon-text",
}

export function buildRefBindingRows(binding: RefBinding | null): FlatProperty[] {
  const descriptions = describeBinding(binding)

  return descriptions.filter(fitsARow).map(toFlatProperty)
}

/** The descriptions a two-column row can carry, each with a label and a value. */
function fitsARow(description: BindingDescription): boolean {
  return description.kind === "view" || description.kind === "consumer"
}

function toFlatProperty(description: BindingDescription): FlatProperty {
  const value = description.detail ?? ""

  return {
    key: `reference.${description.key}`,
    propertyType: "atomic",
    label: description.label,
    icon: ROW_ICONS[description.kind],
    value: { type: ValueType.EXACT, value },
    actualValue: value,
    valueType: ValueType.EXACT,
    controlType: undefined,
    isCompound: false,
    isShorthand: false,
    isSubProperty: true,
    status: "set",
    isDimmed: true,
  }
}
