import { formatWithPrettier } from "../format-with-prettier"

import type { ExportFormatContext } from "../format-with-prettier"

export async function format(content: string, options?: ExportFormatContext) {
  if (options?.skipFormat) {
    return content
  }

  return formatWithPrettier(content, { parser: "typescript" }, options)
}
