import fs from "node:fs"
import path from "node:path"
import { IconId } from "@seldon/core/components/icons"
import { ExportOptions, FileToExport } from "../../types"
import { getIconComponentName } from "../discovery/get-icon-component-name"

/**
 * Get icon files to export
 *
 * @param usedIconIds - Set of icon IDs that are used in the workspace (for tree shaking)
 * @param options - Export options
 * @returns List of icon files to export
 */
export function getIcons(
  usedIconIds: Set<IconId>,
  options: ExportOptions,
): FileToExport[] {
  const icons: FileToExport[] = []
  const iconNamesToInclude = usedIconIds
    ? Array.from(usedIconIds).map((id) => `${getIconComponentName(id)}.tsx`)
    : []
  const iconsPath = path.join(
    options.rootDirectory,
    "packages",
    "core",
    "components",
    "icons",
  )

  // Check if the directory exists before trying to read it
  if (!fs.existsSync(iconsPath)) {
    return icons
  }

  const entries = fs.readdirSync(iconsPath, { withFileTypes: true })

  /**
   * Filter entries to exclude:
   * - Non-files
   * - Hidden files
   * - Index file
   * - Icons that are not used
   */
  const filtered = entries.filter((entry) => {
    return (
      entry.isFile() &&
      !entry.name.startsWith(".") &&
      entry.name !== "index.ts" &&
      iconNamesToInclude.includes(entry.name)
    )
  })

  for (const entry of filtered) {
    icons.push({
      path: path.join(options.output.componentsFolder, "icons", entry.name),
      content: fs.readFileSync(
        path.join(
          options.rootDirectory,
          "packages",
          "core",
          "components",
          "icons",
          entry.name,
        ),
        "utf8",
      ),
    })
  }

  return icons
}
