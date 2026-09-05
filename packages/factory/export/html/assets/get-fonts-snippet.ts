import { collectRemoteFontUrls } from "../../shared/collect-remote-font-urls"

import type { ExportOptions, FileToExport } from "../../types"
import type { Workspace } from "@seldon/core"

/**
 * Builds a `fonts.html` snippet of remote font host links. Local and system
 * families emit nothing. The snippet is empty of links when remote fonts are
 * off. Family selection matches the React and Vue Fonts components.
 */
export function getFontsSnippet(workspace: Workspace, options: ExportOptions): FileToExport {
  const links = collectRemoteFontUrls(workspace, options)
    .map((url) => `<link rel="stylesheet" href="${url}" />`)
    .join("\n")
  const content = links.length > 0 ? `${links}\n` : "<!-- no remote fonts -->\n"

  return {
    path: `${options.output.componentsFolder}/fonts.html`.replaceAll("//", "/"),
    content,
  }
}
