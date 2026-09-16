import { formatWithPrettier } from "../format-with-prettier"

import type { ExportFormatContext } from "../format-with-prettier"

/**
 * Formats an emitted HTML fragment so a file that lands in a formatted
 * repository does not fail that repository's own format check.
 */
export async function formatHtml(content: string, options?: ExportFormatContext) {
  if (options?.skipFormat) {
    return content
  }

  return formatWithPrettier(content, { parser: "html" }, options)
}
