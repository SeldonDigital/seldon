import { parsePropertyPath } from "@seldon/editor/lib/properties/property-paths"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { getPropertyPickerOptions } from "@seldon/core/helpers/properties/properties-bridge"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"

import type { FlatProperty } from "./properties-data"
import type { ComponentId, ComponentLevel, Theme, Workspace } from "@seldon/core"
import type {
  PropertyPickerInput,
  PropertyPickerResult,
} from "@seldon/core/helpers/properties/properties-bridge"
import type { Board, Instance, Variant } from "@seldon/core/workspace/types"

export type { PropertyPickerResult }

function resolveSubjectId(
  node: Variant | Instance | Board | undefined,
  componentId: ComponentId | undefined,
): string {
  if (node) {
    if (isBoard(node)) {
      return getComponentKey(node)
    }

    return node.id
  }

  return componentId ?? ""
}

/**
 * Builds grouped picker options for a property via core workspace helpers.
 */
export function generatePropertyOptions(
  property: FlatProperty,
  theme: Theme | undefined,
  componentId: ComponentId | undefined,
  componentLevel: ComponentLevel | undefined,
  workspace: Workspace,
  node: Variant | Instance | Board | undefined,
): PropertyPickerResult {
  // An upper paint layer parent (`gradient.1`) resolves its preset options
  // through the base key, so every layer offers the same theme presets.
  const parsedPath = parsePropertyPath(property.key)
  const optionPath = parsedPath.kind === "layered-parent" ? parsedPath.root : property.key

  const input: PropertyPickerInput = {
    path: optionPath,
    value: property.value,
    subjectId: resolveSubjectId(node, componentId),
    workspace,
    theme,
    componentLevel,
  }

  return getPropertyPickerOptions(input)
}
