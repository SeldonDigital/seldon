import { IconId } from "@seldon/core/icons"
import { ExportOptions, FileToExport } from "../../types"
import { getIconComponentName } from "../discovery/get-icon-component-name"
import { getIconPath } from "../utils/find-icon-path"

/**
 * Generate an index file that exports all used icons as named exports
 * Uses relative paths from icons/sets/ structure
 *
 * @param usedIconIds - Set of icon IDs that are used in the workspace
 * @param options - Export options
 * @returns Icon index file to export
 */
export function generateIconIndex(
  usedIconIds: Set<IconId>,
  options: ExportOptions,
): FileToExport {
  const exports: string[] = []

  if (usedIconIds && usedIconIds.size > 0) {
    // Convert to array and sort for consistent output
    const sortedIconIds = Array.from(usedIconIds).sort()

    for (const iconId of sortedIconIds) {
      const componentName = getIconComponentName(iconId)
      // Get the relative path for this icon (handles nested structure)
      const iconRelativePath = getIconPath(iconId, options.rootDirectory)
      const exportStatement = `export { ${componentName} } from './${iconRelativePath}'`
      exports.push(exportStatement)
    }
  }

  const content = exports.join("\n") + "\n"
  const indexPath = `${options.output.componentsFolder}/icons/index.ts`.replaceAll(
    "//",
    "/",
  )

  return {
    path: indexPath,
    content,
  }
}
