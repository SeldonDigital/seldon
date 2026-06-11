import { IconId } from "@seldon/core/icon-sets"
import { Workspace } from "@seldon/core/workspace/types"

import { NodeIdToClass } from "../../../css/types"
import { ComponentToExport, ExportOptions, FileToExport } from "../../../types"
import { format } from "../../format"
import { insertComponentFunction } from "../inserts/insert-component-function"
import { insertDefaultProps } from "../inserts/insert-default-props"
import { insertIconMap } from "../inserts/insert-icon-map"
import { insertImports } from "../inserts/insert-imports"
import { insertInterface } from "../inserts/insert-interface"
import { generateJSXStructure } from "../preprocess/generate-jsx-structure"

/**
 * Generates React component files for all components in the export list.
 *
 * Processes each component through the generation pipeline:
 * 1. Build the JSX structure and its prop name map
 * 2. Build component source: interface → function → defaults → imports → special handling
 * 3. Format and add to files list
 *
 * @param componentsToExport - Array of components to generate files for
 * @param workspace - The workspace containing all nodes
 * @param nodeIdToClass - Mapping of node IDs to CSS class names
 * @param usedIconIds - Set of icon IDs used in the workspace
 * @param options - Export options containing rootDirectory for icon path resolution
 * @returns Array of generated component files
 */
export async function generateComponentFiles(
  componentsToExport: ComponentToExport[],
  workspace: Workspace,
  nodeIdToClass: NodeIdToClass,
  usedIconIds: Set<IconId>,
  options: ExportOptions,
): Promise<FileToExport[]> {
  const filesToExport: FileToExport[] = []

  for (const component of componentsToExport) {
    try {
      let source: string = ""

      const { root: jsxRoot, propNames } = generateJSXStructure(
        component,
        nodeIdToClass,
        workspace,
      )

      source = insertInterface(source, component, propNames)
      source = insertComponentFunction(
        source,
        component,
        nodeIdToClass,
        propNames,
        workspace,
        jsxRoot,
      )
      source = insertDefaultProps(source, component, nodeIdToClass, propNames)
      source = insertImports(source, component, jsxRoot, options)

      if (component.config.react.returns === "iconMap") {
        source = insertIconMap(source, usedIconIds, options)
      }

      source = await format(source, options)

      filesToExport.push({
        path: component.output.path,
        content: source,
      })
    } catch (error) {
      console.warn(
        `Failed to export component "${component.name}" (${component.output.path}):`,
        error,
      )
    }
  }

  return filesToExport
}
