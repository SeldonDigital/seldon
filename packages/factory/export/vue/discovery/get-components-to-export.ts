import { Workspace } from "@seldon/core/workspace/types"

import { NodeIdToClass } from "../../css/types"
import { getComponentsToExport as getReactComponentsToExport } from "../../react/discovery/get-components-to-export"
import { ComponentToExport, ExportOptions } from "../../types"

/**
 * Resolves the component export list for the Vue target. The discovery IR is
 * framework-neutral, so this reuses the React discovery and only remaps output
 * file paths from `.tsx` to `.vue`. The Vue return descriptor is resolved later
 * from each component's `config.vue` (defaulting from `config.react`).
 */
export function getComponentsToExport(
  workspace: Workspace,
  options: ExportOptions,
  nodeIdToClass: NodeIdToClass,
): ComponentToExport[] {
  const components = getReactComponentsToExport(
    workspace,
    options,
    nodeIdToClass,
  )
  return components.map((component) => ({
    ...component,
    output: {
      ...component.output,
      path: component.output.path.replace(/\.tsx$/, ".vue"),
    },
  }))
}
