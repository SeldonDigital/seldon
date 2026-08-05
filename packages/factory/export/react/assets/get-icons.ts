import fs from "node:fs"
import path from "node:path"

import { getIconSourcePath, resolveIconExport } from "../utils/find-icon-path"
import { getDataBackedIcon } from "./data-backed-icon"
import { MISSING_ICON_ID } from "./resolve-icon-component"

import type { ExportOptions, FileToExport } from "../../types"
import type { IconId } from "@seldon/core/icon-sets"

/**
 * The inline `__default__` glyph, shown for an unset or component-default icon.
 * It lives outside the icon sets and is emitted directly.
 */
const ICON_DEFAULT_CONTENT = `import { SVGAttributes } from "react"

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

/**
 * Get icon files to export from the icon-sets catalog and generated glyph data.
 * A referenced id that resolves to neither data nor a catalog source emits the
 * Seldon `seldon-missing` glyph instead of being skipped, so the emitted files
 * always match the icon index and the icon map. Files are deduplicated by
 * output path, since several unresolvable ids share the one missing glyph.
 *
 * @param usedIconIds - Set of icon IDs that are used in the workspace (for tree shaking)
 * @param options - Export options
 * @returns List of icon files to export
 */
export function getIcons(usedIconIds: Set<IconId>, options: ExportOptions): FileToExport[] {
  const icons: FileToExport[] = []
  const seenPaths = new Set<string>()

  function push(relativePath: string, content: string): void {
    const outputPath = path.join(options.output.componentsFolder, "icons", `${relativePath}.tsx`)

    if (seenPaths.has(outputPath)) return
    seenPaths.add(outputPath)
    icons.push({ path: outputPath, content })
  }

  for (const iconId of usedIconIds) {
    const dataBacked = getDataBackedIcon(iconId)

    if (dataBacked) {
      push(dataBacked.relativePath, dataBacked.content)
      continue
    }

    const fromReader = options.assetReader?.getIconExportSource?.(iconId)

    if (fromReader) {
      push(fromReader.relativePath, fromReader.content)
      continue
    }

    if (iconId === "__default__") {
      push("IconDefault", ICON_DEFAULT_CONTENT)
      continue
    }

    const source = readCatalogSource(iconId, options)

    if (source) {
      push(source.relativePath, source.content)
      continue
    }

    const missing = readMissingGlyph(options)

    if (missing) {
      push(missing.relativePath, missing.content)
    } else {
      console.warn(`Skipping icon "${iconId}": no catalog source and no seldon-missing glyph`)
    }
  }

  return icons
}

/** Reads a catalog `.tsx` source for an id from the installed core or the repo. */
function readCatalogSource(
  iconId: IconId,
  options: ExportOptions,
): { relativePath: string; content: string } | undefined {
  const fromReader = options.assetReader?.getIconExportSource?.(iconId)

  if (fromReader) {
    return { relativePath: fromReader.relativePath, content: fromReader.content }
  }

  const resolved = resolveIconExport(iconId, options.rootDirectory)

  if (!resolved) return undefined

  const sourcePath = getIconSourcePath(resolved, options.rootDirectory)
  const iconFileFromReader = options.assetReader?.readIconFile(sourcePath)

  if (iconFileFromReader) {
    return { relativePath: resolved.relativePath, content: iconFileFromReader.toString("utf8") }
  }

  if (fs.existsSync(sourcePath)) {
    return { relativePath: resolved.relativePath, content: fs.readFileSync(sourcePath, "utf8") }
  }

  return undefined
}

/** Resolves the `seldon-missing` glyph source, the fallback for a missing id. */
function readMissingGlyph(
  options: ExportOptions,
): { relativePath: string; content: string } | undefined {
  return readCatalogSource(MISSING_ICON_ID, options)
}
