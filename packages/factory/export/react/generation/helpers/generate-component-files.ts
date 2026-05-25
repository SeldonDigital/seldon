import { IconId } from "@seldon/core/icons"
import { Workspace } from "@seldon/core/workspace/types"
import { NodeIdToClass } from "../../../css/types"
import { ComponentToExport, ExportOptions, FileToExport } from "../../../types"
import { format } from "../../format"
import { ComponentMetadataStorage } from "../component-metadata"
import { insertComponentFunction } from "../inserts/insert-component-function"
import { insertDefaultProps } from "../inserts/insert-default-props"
import { insertIconMap } from "../inserts/insert-icon-map"
import { insertImports } from "../inserts/insert-imports"
import { insertInterface } from "../inserts/insert-interface"
import {
  extractPropKeysFromJSX,
  extractPropValuesFromJSX,
} from "../preprocess/extract-prop-names-from-jsx"
import { generateJSXStructure } from "../preprocess/generate-jsx-structure"
import { extractInterfacePropNames } from "../shared/extract-interface-prop-names"

/**
 * Generates React component files for all components in the export list.
 *
 * Processes each component through the generation pipeline:
 * 1. Generate prop maps (values and keys)
 * 2. Store component metadata for child component lookup
 * 3. Build component source: interface → function → defaults → imports → special handling
 * 4. Format and add to files list
 *
 * @param componentsToExport - Array of components to generate files for
 * @param workspace - The workspace containing all nodes
 * @param nodeIdToClass - Mapping of node IDs to CSS class names
 * @param componentMetadataStorage - Storage for component metadata (populated during generation)
 * @param usedIconIds - Set of icon IDs used in the workspace
 * @param options - Export options containing rootDirectory for icon path resolution
 * @returns Array of generated component files
 */
export async function generateComponentFiles(
  componentsToExport: ComponentToExport[],
  workspace: Workspace,
  nodeIdToClass: NodeIdToClass,
  componentMetadataStorage: ComponentMetadataStorage,
  usedIconIds: Set<IconId>,
  options: ExportOptions,
): Promise<FileToExport[]> {
  const filesToExport: FileToExport[] = []

  for (const component of componentsToExport) {
    try {
      let source: string = ""

      const jsxRoot = generateJSXStructure(
        component,
        nodeIdToClass,
        componentMetadataStorage,
        workspace,
      )

      const propValuesMap = extractPropValuesFromJSX(jsxRoot, component)
      const propKeysMap = extractPropKeysFromJSX(
        jsxRoot,
        component,
        componentMetadataStorage,
        workspace,
      )

      const propNamesMap = propValuesMap

      const interfacePropNames = extractInterfacePropNames(
        component,
        propNamesMap,
      )

      componentMetadataStorage.set(component.variantId, {
        componentId: component.componentId,
        variantId: component.variantId,
        componentName: component.name,
        propNamesMap,
        propValuesMap,
        propKeysMap,
        interfacePropNames,
      })

      source = insertInterface(
        source,
        component,
        propKeysMap,
        propValuesMap,
        workspace,
      )
      source = insertComponentFunction(
        source,
        component,
        nodeIdToClass,
        propValuesMap,
        propKeysMap,
        componentMetadataStorage,
        workspace,
        jsxRoot,
      )
      source = insertDefaultProps(
        source,
        component,
        nodeIdToClass,
        propValuesMap,
        workspace,
      )
      source = insertImports(source, component, jsxRoot, options)

      if (component.config.react.returns === "iconMap") {
        source = insertIconMap(source, usedIconIds)
      }

      source = await format(source, options)

      filesToExport.push({
        path: component.output.path,
        content: source,
      })
    } catch {
      // Failed to export component
    }
  }

  return filesToExport
}
