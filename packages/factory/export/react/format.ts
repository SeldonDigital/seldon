import { formatWithPrettier } from "../format-with-prettier"

export async function format(
  content: string,
  options?: { skipFormat?: boolean; formatConfigRoot?: string },
) {
  if (options?.skipFormat) {
    return content
  }

  return formatWithPrettier(content, { parser: "typescript" }, options?.formatConfigRoot)
}
