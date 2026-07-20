import { Workspace } from "@seldon/core/workspace/types"

import { NodeIdToClass } from "../../css/types"
import { ComponentToExport, ExportOptions, FileToExport } from "../../types"
import { resolveVueReturns } from "../shared/vue-native-tags"
import { generateVueComponent } from "./generate-vue-component"

/**
 * Generates a `.vue` SFC for every component in the export list. Failures are
 * isolated per component so one bad component does not abort the whole export,
 * matching the React target's resilience.
 */
export function generateComponentFiles(
  componentsToExport: ComponentToExport[],
  workspace: Workspace,
  nodeIdToClass: NodeIdToClass,
  _options: ExportOptions,
): FileToExport[] {
  const files: FileToExport[] = []
  for (const component of componentsToExport) {
    // The Icon primitive (returns "iconMap") is rendered by the hand-authored
    // Icon.vue emitted from shared icon data, not from a generated SFC.
    if (resolveVueReturns(component).returns === "iconMap") continue
    try {
      files.push({
        path: component.output.path,
        content: generateVueComponent(component, nodeIdToClass, workspace),
      })
    } catch (error) {
      console.warn(
        `Failed to export Vue component "${component.name}" (${component.output.path}):`,
        error,
      )
    }
  }
  return files
}
