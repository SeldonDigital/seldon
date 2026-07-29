import { describeBinding } from "@seldon/editor/lib/refs/describe-binding"
import { ValueType } from "@seldon/core"

import type { FlatProperty } from "./properties-data"
import type { RefBinding } from "@seldon/editor/lib/refs/join-refs-and-bindings"

/**
 * Sub-rows listing what a referenced node is wired to: the generated components
 * that expose it as a prop, then the app code that drives it.
 *
 * The descriptions come from `@seldon/editor/lib/refs`, which the canvas card reads
 * too. A sidebar row is a name and a value, so a row keeps the component and where
 * it sits. The conditions, the expressions, and the hooks behind them are the card's
 * job.
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

const VIEW_ICON = "seldon-component"
const CONTROLLER_ICON = "seldon-text"

export function buildRefBindingRows(binding: RefBinding | null): FlatProperty[] {
  const { views, controllers } = describeBinding(binding)

  const viewRows = views.map((view, index) =>
    toFlatProperty(`view#${index}`, view.component, view.slot, VIEW_ICON),
  )

  const controllerRows = controllers.map((controller, index) =>
    toFlatProperty(`controller#${index}`, controller.name, controller.location, CONTROLLER_ICON),
  )

  return [...viewRows, ...controllerRows]
}

function toFlatProperty(key: string, label: string, value: string, icon: string): FlatProperty {
  return {
    key: `reference.${key}`,
    propertyType: "atomic",
    label,
    icon,
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
