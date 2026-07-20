/**
 * One declarative index for "what does this selection point at on the canvas".
 *
 * Every selectable canvas element carries `data-canvas-selection-id` listing the
 * selection ids it belongs to, separated by spaces. A node lists its node id, a
 * theme dialog its theme entry id, and a font specimen lists both its resource
 * item key and its owning variant entry id. Scroll-to-selection resolves the
 * current selection through this single attribute, so nodes, theme variants,
 * font families, and font-collection variants all use the exact same path.
 */
import { SELECTION_ROOT_ID_ATTR } from "@app/workspace/selection-target"

export const CANVAS_SELECTION_ID_ATTR = "data-canvas-selection-id"

/** Joins the selection ids an element belongs to into the attribute value. */
export function canvasSelectionId(
  ...ids: Array<string | null | undefined>
): string {
  return ids.filter((id): id is string => Boolean(id)).join(" ")
}

/**
 * Returns every canvas element registered under the given selection id.
 *
 * Scoped to `#canvas` so it never matches like-named attributes elsewhere (the
 * sidebar rows), and uses the `~=` token match so an element listing several
 * ids resolves from any one of them. A single id (node, theme variant, font
 * family) yields one element; a variant id yields its whole group of specimens.
 */
export function getCanvasSelectionElements(selectionId: string): HTMLElement[] {
  const canvasEl = document.getElementById("canvas")
  if (!canvasEl) return []
  return Array.from(
    canvasEl.querySelectorAll<HTMLElement>(
      `[${CANVAS_SELECTION_ID_ATTR}~="${selectionId}"]`,
    ),
  )
}

/**
 * Resolves a node selection to the single canvas element matching its path.
 *
 * A child node id is shared both across variant columns and across sibling
 * copies inside one column, so it can appear on several canvas elements at
 * once. Selection carries the full ancestor node-id path of the copy the user
 * clicked or hovered, so the matching copy is the one whose stamped
 * `data-selection-root-id` is equal. Without a path, or when no copy matches,
 * the first element in document order is used, which is the default variant
 * column.
 */
export function getScopedSelectionElement(
  selectionId: string,
  pathKey: string | null | undefined,
): HTMLElement | null {
  const elements = getCanvasSelectionElements(selectionId)
  if (elements.length === 0) return null
  if (pathKey) {
    const scoped = elements.find(
      (element) => element.getAttribute(SELECTION_ROOT_ID_ATTR) === pathKey,
    )
    if (scoped) return scoped
  }
  return elements[0]
}

/** Union of the elements' viewport rects, or null when there are none. */
export function getUnionRect(elements: HTMLElement[]): DOMRect | null {
  if (elements.length === 0) return null

  let top = Infinity
  let left = Infinity
  let right = -Infinity
  let bottom = -Infinity

  for (const element of elements) {
    const rect = element.getBoundingClientRect()
    top = Math.min(top, rect.top)
    left = Math.min(left, rect.left)
    right = Math.max(right, rect.right)
    bottom = Math.max(bottom, rect.bottom)
  }

  return new DOMRect(left, top, right - left, bottom - top)
}
