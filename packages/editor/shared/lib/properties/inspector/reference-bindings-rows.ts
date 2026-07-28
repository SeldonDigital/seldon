import { ValueType } from "@seldon/core"

import type { FlatProperty } from "./properties-data"
import type { RefBinding } from "@seldon/editor/lib/refs/join-ref-bindings"

/**
 * Sub-rows listing what a referenced node is wired to: the generated components
 * that expose it as a prop, then the app code that drives it.
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

const VIEW_KEY_PREFIX = "reference.view#"
const CONSUMER_KEY_PREFIX = "reference.consumer#"

export function buildReferenceBindingRows(binding: RefBinding | null): FlatProperty[] {
  if (!binding) return []

  const rows: FlatProperty[] = []

  binding.views.forEach((view, index) => {
    rows.push({
      key: `${VIEW_KEY_PREFIX}${index}`,
      propertyType: "atomic",
      label: view.component,
      icon: "seldon-component",
      value: { type: ValueType.EXACT, value: describeSlot(view.slot, view.rendersWhen) },
      actualValue: describeSlot(view.slot, view.rendersWhen),
      valueType: ValueType.EXACT,
      controlType: undefined,
      isCompound: false,
      isShorthand: false,
      isSubProperty: true,
      status: "set",
      isDimmed: true,
    })
  })

  binding.consumers.forEach((consumer, index) => {
    const location = `${consumer.file}:${consumer.line}`

    rows.push({
      key: `${CONSUMER_KEY_PREFIX}${index}`,
      propertyType: "atomic",
      label: consumer.component || getFileName(consumer.file),
      icon: "seldon-text",
      value: { type: ValueType.EXACT, value: location },
      actualValue: location,
      valueType: ValueType.EXACT,
      controlType: undefined,
      isCompound: false,
      isShorthand: false,
      isSubProperty: true,
      status: "set",
      isDimmed: true,
    })
  })

  return rows
}

/**
 * Names the slot a view exposes. A `when-passed` slot is called out, because a ref
 * override alone cannot bring it on screen and that surprises a caller who set one.
 */
function describeSlot(slot: string | null, rendersWhen: string): string {
  const name = slot ?? "root"

  return rendersWhen === "when-passed" ? `${name} (when passed)` : name
}

function getFileName(file: string): string {
  const parts = file.split("/")

  return parts[parts.length - 1] || file
}
