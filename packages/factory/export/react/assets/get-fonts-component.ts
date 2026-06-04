import { Workspace, getRemoteFontUrl } from "@seldon/core"
import { workspaceFontCollectionService } from "@seldon/core/workspace/services"
import { ExportOptions, FileToExport } from "../../types"
import { format } from "../format"

/**
 * Builds the exported `Fonts` component from the workspace's font collections.
 *
 * Local and system families need no network request, so they emit nothing here.
 * Remote families only emit a font host link when `options.enableRemoteFonts` is set.
 */
export async function getFontsComponent(
  workspace: Workspace,
  options: ExportOptions,
): Promise<FileToExport> {
  const links: string[] = []

  if (options.enableRemoteFonts) {
    const seen = new Set<string>()
    const families =
      workspaceFontCollectionService.collectWorkspaceFamilies(workspace)
    const enabledByFamily =
      workspaceFontCollectionService.getEnabledVariantsByFamily(workspace)

    for (const family of families) {
      if (family.origin !== "remote") continue
      const enabled = enabledByFamily[family.name]
      // An explicit empty selection (preset None) requests no weights, so skip.
      if (enabled && enabled.length === 0) continue
      const url = getRemoteFontUrl(family.name, enabled)
      if (!url || seen.has(url)) continue
      seen.add(url)
      links.push(`    <link rel="stylesheet" href="${url}" />`)
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
