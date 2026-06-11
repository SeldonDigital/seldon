import fs from "node:fs"
import path from "node:path"

import { IconId } from "@seldon/core/icon-sets"

import { ExportOptions, FileToExport } from "../../types"
import { getIconSourcePath, resolveIconExport } from "../utils/find-icon-path"

/**
 * Get icon files to export from the icon-sets/catalog directory structure.
 * Icons whose catalog file cannot be resolved are skipped with a warning so
 * the emitted files always match the generated icon index.
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

    // The __default__ icon lives outside icon sets and is generated directly
    if (iconId === "__default__") {
      const outputPath = path.join(
        options.output.componentsFolder,
        "icons",
        "IconDefault.tsx",
      )

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

    const resolved = resolveIconExport(iconId, options.rootDirectory)
    if (!resolved) {
      console.warn(`Skipping icon "${iconId}": no catalog file found`)
      continue
    }

    const sourcePath = getIconSourcePath(resolved, options.rootDirectory)
    const outputPath = path.join(
      options.output.componentsFolder,
      "icons",
      `${resolved.relativePath}.tsx`,
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
    } else {
      console.warn(`Skipping icon "${iconId}": source file not readable`)
    }
  }
  return icons
}
