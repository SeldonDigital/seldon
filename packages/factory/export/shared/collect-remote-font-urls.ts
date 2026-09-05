import { getRemoteFontUrl } from "@seldon/core"
import { workspaceFontCollectionService } from "@seldon/core/workspace/services"

import type { ExportOptions } from "../types"
import type { Workspace } from "@seldon/core"

/**
 * Collects remote font host URLs for the exported Fonts component.
 *
 * Local and system families need no network request, so they return nothing.
 * Remote families only emit a URL when `options.enableRemoteFonts` is set.
 * `exportAllFontCollections` then selects the family scope: on, every enabled
 * remote family on a font collection board, whether or not the project uses it;
 * off, only the families a node actually renders through a direct `font.family`
 * choice.
 */
export function collectRemoteFontUrls(workspace: Workspace, options: ExportOptions): string[] {
  if (!options.enableRemoteFonts) return []

  const urls: string[] = []
  const seen = new Set<string>()
  const linkedFamilies = new Set<string>()
  const enabledByFamily = workspaceFontCollectionService.getEnabledVariantsByFamily(workspace)

  const pushFamily = (familyName: string, variants?: string[]): void => {
    if (linkedFamilies.has(familyName)) return
    const url = getRemoteFontUrl(familyName, variants)

    if (!url) return
    linkedFamilies.add(familyName)
    if (seen.has(url)) return
    seen.add(url)
    urls.push(url)
  }

  if (options.exportAllFontCollections !== false) {
    for (const family of workspaceFontCollectionService.collectWorkspaceFamilies(workspace)) {
      if (family.origin === "local") continue
      const enabled = enabledByFamily[family.name]

      // An explicit empty selection (preset None) requests no weights, so skip.
      if (enabled && enabled.length === 0) continue
      pushFamily(family.name, enabled)
    }
  } else {
    for (const familyName of workspaceFontCollectionService.collectUsedRemoteFontFamilies(
      workspace,
    )) {
      pushFamily(familyName, enabledByFamily[familyName])
    }
  }

  return urls
}
