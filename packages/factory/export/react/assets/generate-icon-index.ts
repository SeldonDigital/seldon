import { resolveIconComponent } from "./resolve-icon-component"

import type { ExportOptions, FileToExport } from "../../types"
import type { IconId } from "@seldon/core/icon-sets"

/**
 * Generate an index file that exports all used icons as named exports. Every id
 * resolves through {@link resolveIconComponent}: a data-backed id, a catalog
 * source file, or the `seldon-missing` glyph for an unresolvable id, so the
 * index always matches the emitted files and the icon map.
 *
 * @param usedIconIds - Set of icon IDs that are used in the workspace
 * @param options - Export options
 * @returns Icon index file to export
 */
export function generateIconIndex(usedIconIds: Set<IconId>, options: ExportOptions): FileToExport {
  const exports: string[] = []
  const exportedNames = new Set<string>()

  if (usedIconIds && usedIconIds.size > 0) {
    // Convert to array and sort for consistent output
    const sortedIconIds = Array.from(usedIconIds).sort()

    for (const iconId of sortedIconIds) {
      const resolved = resolveIconComponent(iconId, options)

      if (exportedNames.has(resolved.componentName)) {
        continue
      }

      exportedNames.add(resolved.componentName)
      exports.push(`export { ${resolved.componentName} } from './${resolved.relativePath}'`)
    }
  }

  const content = exports.join("\n") + "\n"
  const indexPath = `${options.output.componentsFolder}/icons/index.ts`.replaceAll("//", "/")

  return {
    path: indexPath,
    content,
  }
}
