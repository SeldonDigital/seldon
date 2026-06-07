import { Board } from "../../types"

/**
 * Gets the appropriate variant label for a special board type.
 *
 * Special boards use specific naming conventions:
 * - IconSet: "Google Material Icons" (default) / "custom icon set" (custom)
 * - Theme: "Clean" (default) / "custom theme" (custom)
 * - Playground: "default playground" / "custom playground"
 *
 * Returns null for regular boards so callers fall back to standard labeling.
 *
 * @param board - The board to get the variant label for
 * @param isDefaultVariant - Whether this is a default variant (true) or custom variant (false)
 * @returns The variant label for special boards, or null for regular boards
 */
export function getSpecialBoardVariantLabel(
  board: Board,
  isDefaultVariant: boolean,
): string | null {
  if (board.type === "icon-set") {
    return isDefaultVariant ? "Google Material Icons" : "custom icon set"
  }

  if (board.type === "theme") {
    return isDefaultVariant ? "Clean" : "custom theme"
  }

  if (board.type === "playground") {
    return isDefaultVariant ? "default playground" : "custom playground"
  }

  if (board.label === "Playground" || board.label === "Assembly") {
    return isDefaultVariant ? "default playground" : "custom playground"
  }

  return null
}
