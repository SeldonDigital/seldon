import { Workspace } from "@seldon/core"
import { buildStyleRegistry } from "./discovery/get-style-registry"
import { generateStylesheet } from "./generation/generate-css-stylesheet"

/**
 * Exports CSS stylesheet for a workspace
 *
 * @param workspace - The workspace to export CSS for
 * @returns The generated CSS stylesheet
 */
export async function exportCss(workspace: Workspace): Promise<string> {
  // Build the style registry from the workspace
  const { classes, nodeIdToClass, classNameToNodeId, nodeTreeDepths } =
    buildStyleRegistry(workspace)

  // Generate the complete CSS stylesheet
  const stylesheet = await generateStylesheet(
    classes,
    workspace,
    classNameToNodeId,
    nodeTreeDepths,
  )

  return stylesheet
}
