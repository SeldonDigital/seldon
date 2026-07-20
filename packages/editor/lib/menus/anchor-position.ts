/**
 * Pure positioning math for floating menus and option lists anchored to a
 * trigger element. Both editors feed a plain rect plus viewport size and get
 * back a position, so the flip logic lives in one place instead of being
 * reimplemented per framework.
 */

export interface AnchorRect {
  top: number
  bottom: number
  left: number
  right: number
  width: number
  height: number
}

export interface Viewport {
  width: number
  height: number
}

export interface MenuPosition {
  top?: number
  bottom?: number
  left?: number
  right?: number
}

export interface ListPosition {
  x: number
  y: number
  w: number
  /** True when the list should render above the anchor (anchor near viewport bottom). */
  positionAbove?: boolean
}

/**
 * Fixed-position style anchored to a trigger. Opens below the trigger, flipping
 * above when the trigger sits in the bottom 40% of the viewport. `align: "end"`
 * pins the right edge to the trigger's right edge instead of the left.
 */
export function computeMenuPosition(
  rect: AnchorRect,
  viewport: Viewport,
  options?: { align?: "start" | "end"; gap?: number },
): MenuPosition {
  const align = options?.align ?? "start"
  const gap = options?.gap ?? 4
  const positionAbove = rect.bottom >= viewport.height * 0.6

  const next: MenuPosition = {}

  if (align === "end") {
    next.right = Math.max(0, viewport.width - rect.right)
  } else {
    next.left = rect.left
  }

  if (positionAbove) {
    next.bottom = Math.max(0, viewport.height - rect.top + gap)
  } else {
    next.top = rect.bottom + gap
  }

  return next
}

/**
 * Position for a floating option list anchored to a trigger. Returns the list's
 * x/width and a y line, plus `positionAbove` so the caller flips the panel above
 * the anchor (render at `y` and translate up by its own height).
 *
 * Defaults match a left-aligned list the width of the anchor that flips when the
 * anchor sits in the bottom 40% of the viewport. Pass `width` with `align: "end"`
 * to right-align a fixed-width panel to the anchor, and `minSpaceBelow` to flip
 * only when the room below is smaller than that and there is more room above.
 */
export function computeListPosition(
  rect: AnchorRect,
  viewport: Viewport,
  options?: {
    gap?: number
    width?: number
    align?: "start" | "end"
    minSpaceBelow?: number
  },
): ListPosition {
  const gap = options?.gap ?? 2
  const align = options?.align ?? "start"
  const width = options?.width
  const w = width ?? rect.width

  let positionAbove: boolean
  if (options?.minSpaceBelow !== undefined) {
    const spaceBelow = viewport.height - rect.bottom
    positionAbove = spaceBelow < options.minSpaceBelow && rect.top > spaceBelow
  } else {
    positionAbove = rect.top >= viewport.height * 0.6
  }

  const x =
    align === "end" && width !== undefined
      ? Math.max(8, rect.right - width)
      : rect.left
  const y = positionAbove ? rect.top - gap : rect.top + rect.height + gap
  return { x, y, w, positionAbove }
}
