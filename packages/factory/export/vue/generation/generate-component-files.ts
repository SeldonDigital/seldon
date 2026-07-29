import { getConditionalPropPaths } from "../../react/generation/shared/get-conditional-prop-paths"
import { resolveVueReturns } from "../shared/vue-native-tags"
import { generateVueComponent } from "./generate-vue-component"

import type { NodeIdToClass } from "../../css/types"
import type { RefViewSource } from "../../shared/generate-refs-registry"
import type { ComponentToExport, ExportOptions, FileToExport } from "../../types"
import type { Workspace } from "@seldon/core/workspace/types"

export interface GeneratedComponentFiles {
  files: FileToExport[]
  refSources: RefViewSource[]
}

/**
 * Generates a `.vue` SFC for every component in the export list. Failures are
 * isolated per component so one bad component does not abort the whole export,
 * matching the React target's resilience.
 *
 * Also returns the slot data behind each generated file, so the refs registry
 * reports only the components this target emitted. The Icon primitive is skipped
 * here, so it carries no views.
 */
export function generateComponentFiles(
  componentsToExport: ComponentToExport[],
  workspace: Workspace,
  nodeIdToClass: NodeIdToClass,
  _options: ExportOptions,
): GeneratedComponentFiles {
  const files: FileToExport[] = []
  const refSources: RefViewSource[] = []

  for (const component of componentsToExport) {
    // The Icon primitive (returns "iconMap") is rendered by the hand-authored
    // Icon.vue emitted from shared icon data, not from a generated SFC.
    if (resolveVueReturns(component).returns === "iconMap") continue

    try {
      const { content, propNames } = generateVueComponent(component, nodeIdToClass, workspace)

      files.push({
        path: component.output.path,
        content,
      })

      refSources.push({
        component,
        propNames,
        conditionalPaths: getConditionalPropPaths(component),
      })
    } catch (error) {
      console.warn(
        `Failed to export Vue component "${component.name}" (${component.output.path}):`,
        error,
      )
    }
  }

  return {
    files,
    refSources,
  }
}
