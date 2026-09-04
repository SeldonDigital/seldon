import { getComponentsToExport as getReactComponentsToExport } from "../../react/discovery/get-components-to-export"

import type { NodeIdToClass } from "../../css/types"
import type { ComponentToExport, ExportOptions } from "../../types"
import type { Workspace } from "@seldon/core/workspace/types"

/**
 * Resolves the component export list for the HTML target. The discovery IR is
 * framework-neutral, so this reuses the React discovery and only remaps output
 * file paths from `.tsx` to `.html`.
 */
export function getComponentsToExport(
  workspace: Workspace,
  options: ExportOptions,
  nodeIdToClass: NodeIdToClass,
): ComponentToExport[] {
  const components = getReactComponentsToExport(workspace, options, nodeIdToClass)

  return components.map((component) => ({
    ...component,
    output: {
      ...component.output,
      path: component.output.path.replace(/\.tsx$/, ".html"),
    },
  }))
}
