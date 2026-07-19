import { computed, type ComputedRef } from "vue"
import type { Workspace } from "@seldon/core/workspace/types"
import {
  buildPropertyRows,
  type PropertyControl,
  type PropertyRow,
  type PropertySection,
} from "@seldon/editor/lib/properties/build-property-rows"

export type { PropertyControl, PropertyRow, PropertySection }

/**
 * Reactive wrapper over the shared `buildPropertyRows`. Groups a node's merged
 * properties into inspector sections with an editable control per row. The
 * grouping logic is framework-neutral and lives in `@seldon/editor`.
 */
export function useEditableProperties(
  properties: ComputedRef<Record<string, unknown>>,
  workspace: ComputedRef<Workspace>,
  overrideKeys: ComputedRef<Set<string>>,
): ComputedRef<PropertySection[]> {
  return computed(() =>
    buildPropertyRows(properties.value, workspace.value, overrideKeys.value),
  )
}
