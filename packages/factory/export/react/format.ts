import { formatWithPrettier } from "../format-with-prettier"

export async function format(content: string, options?: { skipFormat?: boolean }) {
  if (options?.skipFormat) {
    return content
  }

  return formatWithPrettier(content, { parser: "typescript" })
}
