import { resolveIconExport } from "../utils/find-icon-path"
import { getDataBackedIcon } from "./data-backed-icon"

import type { ExportOptions } from "../../types"
import type { ResolvedIconExport } from "../utils/find-icon-path"
import type { IconId } from "@seldon/core/icon-sets"

/** The Seldon glyph shown for a referenced id that resolves to no other icon. */
export const MISSING_ICON_ID: IconId = "seldon-missing"

/**
 * Resolves an icon id to the component name and path the export emits for it,
 * using one order shared by the icon map, the icon index, and the icon files:
 * generated glyph data, then a catalog source file (installed or in-repo), then
 * the Seldon `seldon-missing` glyph for a referenced id that resolves to
 * neither. `__default__` keeps its own inline component for an unset icon.
 *
 * Keeping these three call sites on one resolver guarantees the map, the index,
 * and the emitted files agree, so a data-backed id maps to its synthesized
 * component and an unresolvable id maps to the emitted `seldon-missing` glyph
 * rather than to a dangling import.
 */
export function resolveIconComponent(iconId: IconId, options: ExportOptions): ResolvedIconExport {
  if (iconId === "__default__") {
    return { componentName: "IconDefault", relativePath: "IconDefault" }
  }

  const data = getDataBackedIcon(iconId)

  if (data) {
    return { componentName: data.componentName, relativePath: data.relativePath }
  }

  const fromReader = options.assetReader?.resolveIconExport?.(iconId)

  if (fromReader) return fromReader

  const resolved = resolveIconExport(iconId, options.rootDirectory)

  if (resolved) return resolved

  return resolveMissingIcon(options)
}

/** Resolves the `seldon-missing` glyph, the fallback for an unresolvable id. */
export function resolveMissingIcon(options: ExportOptions): ResolvedIconExport {
  const fromReader = options.assetReader?.resolveIconExport?.(MISSING_ICON_ID)

  if (fromReader) return fromReader

  const resolved = resolveIconExport(MISSING_ICON_ID, options.rootDirectory)

  if (resolved) return resolved

  // seldon-missing ships as a source glyph and should always resolve; the
  // default keeps the icon map total if the catalog is somehow unreachable.
  return { componentName: "IconDefault", relativePath: "IconDefault" }
}
