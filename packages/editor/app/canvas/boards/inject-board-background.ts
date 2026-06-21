import type { Properties } from "@seldon/core"
import type { Workspace } from "@seldon/core/workspace/types"

/**
 * Copies a resource board's `background` onto every board entry of a cloned
 * preview workspace.
 *
 * Icon set and font collection boards draw their previews from a throwaway
 * workspace whose own component board carries a transparent default. The
 * `HIGH_CONTRAST_COLOR` computation resolves `#parent.background.color` against
 * that board surface, so without this injection it always sees a transparent
 * surface and renders black. Injecting the real board background lets the icon
 * and text previews compute high contrast against the board's actual color.
 *
 * Returns the boards unchanged when there is no background to inject.
 */
export function injectBoardBackground(
  boards: Workspace["boards"],
  background: Properties["background"],
): Workspace["boards"] {
  if (!background) {
    return boards
  }

  return Object.fromEntries(
    Object.entries(boards).map(([id, board]) => [
      id,
      {
        ...board,
        componentProperties: {
          ...board.componentProperties,
          background,
        },
      },
    ]),
  ) as Workspace["boards"]
}
