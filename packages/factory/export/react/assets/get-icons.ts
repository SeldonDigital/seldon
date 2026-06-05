import fs from "node:fs"
import path from "node:path"
import { IconId } from "@seldon/core/icon-sets"
import { ExportOptions, FileToExport } from "../../types"
import { getIconComponentName } from "../discovery/get-icon-component-name"
import { getIconPath } from "../utils/find-icon-path"

/**
 * Recursively find an icon component file in the icons/sets directory structure
 *
 * @param componentName - The component name (e.g., "IconMaterialAdd")
 * @param rootDir - Root directory to search from (icons/sets)
 * @returns Relative path from rootDir to the component file, or null if not found
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
        // Return relative path from rootDir
        return path.relative(rootDir, fullPath).replace(/\\/g, "/")
      }
    }

    return null
  }

  return searchDir(rootDir)
}

/**
 * Get icon files to export from icons/sets directory structure
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
  const iconsSetsPath = path.join(
    options.rootDirectory,
    "packages",
    "core",
    "icon-sets",
    "sets",
  )

  // Check if the icons/sets directory exists
  if (!fs.existsSync(iconsSetsPath)) {
    return icons
  }

  for (const iconId of usedIconIds) {
    const fromReader = options.assetReader?.getIconExportSource?.(iconId)
    if (fromReader) {
      icons.push({
        path: path.join(
          options.output.componentsFolder,
          "icons",
          `${fromReader.relativePath}.tsx`,
        ),
        content: fromReader.content,
      })
      continue
    }

    // Special handling for __default__ icon - it lives outside icon sets and should be generated directly
    if (iconId === "__default__") {
      const outputPath = path.join(
        options.output.componentsFolder,
        "icons",
        "IconDefault.tsx",
      )

      // Generate IconDefault component directly (it's a special fallback icon)
      const iconDefaultContent = `import { SVGAttributes } from "react"

export function IconDefault(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 320"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="22"
      >
        <path d="m149.745 193.824-77.015 79.99 111.427 11.736M189.587 179.323 300 191.094l-77.817 80.616M184.157 285.55l5.43-106.227M300 191.094 247.27 46.22M72.73 273.814 20 128.939M97.017 48.953 20 128.939l111.427 11.737M136.854 34.45 247.27 46.22l-77.815 80.619" />
      </g>
    </svg>
  )
}
`

      icons.push({
        path: outputPath,
        content: iconDefaultContent,
      })
      continue
    }

    const componentName = getIconComponentName(iconId)
    const fileName = `${componentName}.tsx`

    // Get the relative path for this icon
    const iconRelativePath = getIconPath(iconId, options.rootDirectory)

    // Use the path from icons/sets/
    const sourcePath = path.join(iconsSetsPath, `${iconRelativePath}.tsx`)
    const outputPath = path.join(
      options.output.componentsFolder,
      "icons",
      `${iconRelativePath}.tsx`,
    )

    const iconFileFromReader = options.assetReader?.readIconFile(sourcePath)
    if (iconFileFromReader) {
      icons.push({
        path: outputPath,
        content: iconFileFromReader.toString("utf8"),
      })
      continue
    }

    if (fs.existsSync(sourcePath)) {
      icons.push({
        path: outputPath,
        content: fs.readFileSync(sourcePath, "utf8"),
      })
    }
  }
  return icons
}
