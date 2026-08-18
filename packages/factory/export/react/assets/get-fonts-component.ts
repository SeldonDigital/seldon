import { getRemoteFontUrl } from "@seldon/core"
import { workspaceFontCollectionService } from "@seldon/core/workspace/services"

import { format } from "../format"

import type { ExportOptions, FileToExport } from "../../types"
import type { Workspace } from "@seldon/core"

/**
 * Builds the exported `Fonts` component from the workspace's font collections.
 *
 * Local and system families need no network request, so they emit nothing here.
 * Remote families only emit a font host link when `options.enableRemoteFonts` is
 * set. `exportAllFontCollections` then selects the family scope: on, every
 * enabled remote family on a font collection board emits a link, whether or not
 * the project uses it; off, only the families a node actually renders through a
 * direct `font.family` choice emit a link.
 */
export async function getFontsComponent(
  workspace: Workspace,
  options: ExportOptions,
): Promise<FileToExport> {
  const links: string[] = []

  if (options.enableRemoteFonts) {
    const seen = new Set<string>()
    const linkedFamilies = new Set<string>()
    const enabledByFamily = workspaceFontCollectionService.getEnabledVariantsByFamily(workspace)

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

    if (options.exportAllFontCollections !== false) {
      // Every enabled remote family on a font collection board, whether or not
      // the project uses it.
      for (const family of workspaceFontCollectionService.collectWorkspaceFamilies(workspace)) {
        if (family.origin === "local") continue
        const enabled = enabledByFamily[family.name]

        // An explicit empty selection (preset None) requests no weights, so skip.
        if (enabled && enabled.length === 0) continue
        pushFamily(family.name, enabled)
      }
    } else {
      // Only the remote families a node renders through a direct `font.family`
      // choice, so an export scoped to used fonts stays request-minimal.
      for (const familyName of workspaceFontCollectionService.collectUsedRemoteFontFamilies(
        workspace,
      )) {
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
