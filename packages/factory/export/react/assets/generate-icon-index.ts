import { IconId } from "@seldon/core/icon-sets"

import { ExportOptions, FileToExport } from "../../types"
import { resolveIconExport } from "../utils/find-icon-path"

/**
 * Generate an index file that exports all used icons as named exports.
 * Only icons that resolve to an actual catalog file get an export line, so
 * the index never references files that were not emitted.
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
  const exportedNames = new Set<string>()

  if (usedIconIds && usedIconIds.size > 0) {
    // Convert to array and sort for consistent output
    const sortedIconIds = Array.from(usedIconIds).sort()

    for (const iconId of sortedIconIds) {
      const resolved = resolveIconExport(iconId, options.rootDirectory)
      if (!resolved) {
        console.warn(
          `Skipping icon index export for "${iconId}": no catalog file found`,
        )
        continue
      }
      if (exportedNames.has(resolved.componentName)) {
        continue
      }
      exportedNames.add(resolved.componentName)
      exports.push(
        `export { ${resolved.componentName} } from './${resolved.relativePath}'`,
      )
    }
  }

  const content = exports.join("\n") + "\n"
  const indexPath =
    `${options.output.componentsFolder}/icons/index.ts`.replaceAll("//", "/")

  return {
    path: indexPath,
    content,
  }
}
