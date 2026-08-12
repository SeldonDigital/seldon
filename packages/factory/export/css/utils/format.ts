import { formatWithPrettier } from "../../format-with-prettier"

export async function format(content: string, formatConfigRoot?: string) {
  return formatWithPrettier(content, { parser: "css" }, formatConfigRoot)
}
