import { formatWithPrettier } from "../format-with-prettier"

/**
 * Formats an emitted JSON file, so a file that lands in a formatted repository does not
 * fail that repository's own format check on the next commit.
 *
 * `JSON.stringify` and Prettier agree on almost everything at an indent of two, and
 * part apart on a collection short enough to fit one line. `JSON.stringify` always
 * breaks `[{}]` over three lines and Prettier keeps it on one, which is the shape
 * workspace data reaches for an empty paint layer.
 *
 * Pass text that is already indented. Prettier keeps an object expanded when its first
 * key starts on its own line, so indented input stays readable and collapsed input
 * would be reprinted as one long line.
 *
 * Prettier ends its output with a newline, so a caller adds none.
 */
export async function formatJson(content: string, formatConfigRoot?: string): Promise<string> {
  return formatWithPrettier(content, { parser: "json" }, formatConfigRoot)
}
