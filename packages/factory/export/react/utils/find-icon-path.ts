import fs from "node:fs"
import path from "node:path"

import { IconId } from "@seldon/core/icon-sets"

import { getIconComponentName } from "../discovery/get-icon-component-name"

/**
 * Recursively find an icon component file in the icon-sets/catalog directory structure
 *
 * @param componentName - The component name (e.g., "IconMaterialAdd")
 * @param rootDir - Root directory to search from (icon-sets/catalog)
 * @returns Relative path from rootDir to the component file (without .tsx extension), or null if not found
 */
function findIconComponentFile(
  componentName: string,
  rootDir: string,
): string | null {
  const fileName = `${componentName}.tsx`

  function searchDir(dir: string): string | null {
    if (!fs.existsSync(dir)) {
      return null
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory() && !entry.name.startsWith(".")) {
        const found = searchDir(fullPath)
        if (found) {
          return found
        }
      } else if (entry.isFile() && entry.name === fileName) {
        // Return relative path from rootDir without .tsx extension
        return path
          .relative(rootDir, fullPath)
          .replace(/\\/g, "/")
          .replace(/\.tsx$/, "")
      }
    }

    return null
  }

  return searchDir(rootDir)
}

/**
 * Get the relative import/export path for an icon component
 * Returns the path relative to the icons directory
 *
 * @param iconId - The icon ID (e.g., "material-add" or "__default__")
 * @param rootDirectory - Project root directory
 * @returns Relative path (e.g., "material/user-interface/actions/IconMaterialAdd" or "IconDefault")
 */
export function getIconPath(iconId: IconId, rootDirectory: string): string {
  const componentName = getIconComponentName(iconId)

  // Special handling for __default__ icon - it lives outside icon sets
  if (iconId === "__default__") {
    return "IconDefault"
  }

  // IconMissing is now IconSeldonMissing in seldon set
  // This shouldn't be called with "missing" as an iconId, but handle it just in case
  if (componentName === "IconMissing") {
    return "seldon/user-interface/actions/IconSeldonMissing"
  }

  // Search in icon-sets/catalog/ for regular icons
  const iconsSetsPath = path.join(
    rootDirectory,
    "packages",
    "core",
    "icon-sets",
    "catalog",
  )

  const foundPath = findIconComponentFile(componentName, iconsSetsPath)

  if (foundPath) {
    return foundPath
  }

  // Fallback to component name if not found (shouldn't happen, but safe fallback)
  return componentName
}
