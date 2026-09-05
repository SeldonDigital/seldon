import { collectRemoteFontUrls } from "../../shared/collect-remote-font-urls"
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
  const links = collectRemoteFontUrls(workspace, options).map(
    (url) => `    <link rel="stylesheet" href="${url}" />`,
  )

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
