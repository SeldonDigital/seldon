import { ComponentId, ComponentLevel, Theme, Workspace } from "@seldon/core"
import {
  type PropertyPickerInput,
  type PropertyPickerOption,
  type PropertyPickerResult,
  getPropertyPickerOptions,
} from "@seldon/core/helpers/properties/properties-bridge"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { Board, Instance, Variant } from "@seldon/core/workspace/types"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { FlatProperty } from "./properties-data"

export type { PropertyPickerOption, PropertyPickerResult }

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
  workspace: Workspace | undefined,
  node: Variant | Instance | Board | undefined,
): PropertyPickerResult {
  const input: PropertyPickerInput = {
    path: property.key,
    value: property.value,
    subjectId: resolveSubjectId(node, componentId),
    workspace: workspace ?? ({ boards: {}, nodes: {} } as Workspace),
    theme,
    componentLevel,
  }

  return getPropertyPickerOptions(input)
}
