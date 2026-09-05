import { generateJSXStructure } from "../../react/generation/preprocess/generate-jsx-structure"
import { getConditionalPropPaths } from "../../react/generation/shared/get-conditional-prop-paths"
import { resolveVueReturns } from "../../vue/shared/vue-native-tags"
import { generateHtmlFragment } from "./generate-html-fragment"

import type { NodeIdToClass } from "../../css/types"
import type { RefViewSource } from "../../shared/generate-refs-registry"
import type { ComponentToExport, ExportOptions, FileToExport } from "../../types"
import type { Workspace } from "@seldon/core/workspace/types"

export interface GeneratedComponentFiles {
  files: FileToExport[]
  refSources: RefViewSource[]
}

/**
 * Generates one flattened HTML fragment per exported variant. The Icon primitive
 * is skipped as its own file and inlined at each use, matching the Vue target's
 * `iconMap` skip.
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
    if (resolveVueReturns(component).returns === "iconMap") continue

    try {
      const { propNames } = generateJSXStructure(component, nodeIdToClass, workspace)

      files.push({
        path: component.output.path,
        content: generateHtmlFragment(component, nodeIdToClass),
      })

      refSources.push({
        component,
        propNames,
        conditionalPaths: getConditionalPropPaths(component),
      })
    } catch (error) {
      console.warn(
        `Failed to export HTML fragment "${component.name}" (${component.output.path}):`,
        error,
      )
    }
  }

  return {
    files,
    refSources,
  }
}
