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
 * Position for a floating option list anchored to a trigger. Returns the
 * anchor's left/width and a y below it, flipping to render above when the
 * anchor sits in the bottom 40% of the viewport.
 */
export function computeListPosition(
  rect: AnchorRect,
  viewport: Viewport,
  options?: { gap?: number },
): ListPosition {
  const gap = options?.gap ?? 2
  const positionAbove = rect.top >= viewport.height * 0.6
  const y = positionAbove ? rect.top - gap : rect.top + rect.height + gap
  return { x: rect.left, y, w: rect.width, positionAbove }
}
