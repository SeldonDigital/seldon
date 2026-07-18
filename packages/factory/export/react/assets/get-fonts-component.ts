import { Workspace, getRemoteFontUrl, isRemoteFontFamily } from "@seldon/core"
import {
  workspaceFontCollectionService,
  workspaceThemeService,
} from "@seldon/core/workspace/services"

import { ExportOptions, FileToExport } from "../../types"
import { format } from "../format"

/**
 * Builds the exported `Fonts` component from the workspace's font collections
 * and themes.
 *
 * Local and system families need no network request, so they emit nothing here.
 * Remote families only emit a font host link when `options.enableRemoteFonts` is
 * set. Links come from two sources: enabled remote families on font collection
 * boards, and remote families referenced by a theme's font slots (so a Google
 * font used only through a theme still loads).
 */
export async function getFontsComponent(
  workspace: Workspace,
  options: ExportOptions,
): Promise<FileToExport> {
  const links: string[] = []

  if (options.enableRemoteFonts) {
    const seen = new Set<string>()
    const linkedFamilies = new Set<string>()
    const enabledByFamily =
      workspaceFontCollectionService.getEnabledVariantsByFamily(workspace)

    /** Emits one font host link for a remote family, deduped by family and url. */
    const pushFamily = (familyName: string, variants?: string[]): void => {
      if (linkedFamilies.has(familyName)) return
      const url = getRemoteFontUrl(familyName, variants)
      if (!url) return
      linkedFamilies.add(familyName)
      if (seen.has(url)) return
      seen.add(url)
      links.push(`    <link rel="stylesheet" href="${url}" />`)
    }

    // 1. Enabled remote families on font collection boards. On by default; when
    //    `exportAllFontCollections` is off, skip this source so only families a
    //    theme references (source 2) emit a link.
    if (options.exportAllFontCollections !== false) {
      const families =
        workspaceFontCollectionService.collectWorkspaceFamilies(workspace)
      for (const family of families) {
        if (family.origin !== "remote") continue
        const enabled = enabledByFamily[family.name]
        // An explicit empty selection (preset None) requests no weights, so skip.
        if (enabled && enabled.length === 0) continue
        pushFamily(family.name, enabled)
      }
    }

    // 2. Remote families referenced by a theme's font slots. These load even when
    //    the family is not an enabled board family, so themed text renders.
    //    Board-enabled variants are used when known; otherwise every weight loads.
    for (const themeId of Object.keys(workspace.themes ?? {})) {
      const theme = workspaceThemeService.getTheme(themeId, workspace)
      if (!theme?.fontFamily) continue
      for (const slot of [
        theme.fontFamily.parameters.primary,
        theme.fontFamily.parameters.secondary,
      ]) {
        const familyName =
          typeof slot?.parameters === "string" ? slot.parameters : undefined
        if (!familyName || !isRemoteFontFamily(familyName)) continue
        pushFamily(familyName, enabledByFamily[familyName])
      }
    }
  }

  const content = await format(
    `import React from "react"

export function Fonts() {
  return (
    <>
${links.join("\n")}
    </>
  )
}
`,
    options,
  )

  return {
    path: `${options.output.componentsFolder}/Fonts.tsx`,
    content,
  }
}
