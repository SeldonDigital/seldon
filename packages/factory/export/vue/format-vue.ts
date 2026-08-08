import { formatWithPrettier } from "../format-with-prettier"

/**
 * Formats an emitted single-file component, so a file that lands in a formatted
 * repository does not fail that repository's own format check on the next
 * commit.
 *
 * Prettier's `vue` parser reprints the template, the script block, and the
 * style block in one pass, and the import sort plugin the export config carries
 * applies to the script block the same way it does to a `.ts` file.
 *
 * Prettier ends its output with a newline, so a caller adds none.
 */
export async function formatVue(content: string, options?: { skipFormat?: boolean }) {
  if (options?.skipFormat) {
    return content
  }

  const firstPass = await formatWithPrettier(content, { parser: "vue" })

  // Prettier's Vue printer settles on the second pass for a whitespace-sensitive
  // inline slot, where the first pass wraps what the second tightens. Running it
  // twice lands on the same text a consuming repository's own format check
  // produces, so an export leaves nothing for that check to fix.
  return formatWithPrettier(firstPass, { parser: "vue" })
}
