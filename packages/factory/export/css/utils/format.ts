import { formatWithPrettier } from "../../format-with-prettier"

import type { ExportFormatContext } from "../../format-with-prettier"

export async function format(content: string, format?: string | ExportFormatContext) {
  return formatWithPrettier(content, { parser: "css" }, format)
}
