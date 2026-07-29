import type { NodeRect } from "../overlay/geometry"

/**
 * One referenced node that needs a connector, in canvas-relative pixels.
 *
 * `order` breaks a tie between two chips that want the same height, ahead of the key,
 * so a caller can keep chips for one node in the order it means them to read.
 */
export interface ConnectorSource {
  key: string
  label: string
  rect: NodeRect
  muted: boolean
  order?: number
}

export interface ConnectorPoint {
  x: number
  y: number
}

/**
 * The label box in the gutter.
 *
 * `centerY` is where the connector meets it, and where the chip is anchored when it
 * draws, so both the elbow and the chip's own placement read one number rather than
 * deriving it twice.
 */
export interface ChipBox {
  top: number
  left: number
  width: number
  height: number
  centerY: number
}

/**
 * Where one connector draws. `anchor` sits on the node's edge, `chip` is the
 * label box in the gutter, and `points` is the elbow between them.
 */
export interface ConnectorPlacement {
  key: string
  label: string
  muted: boolean
  anchor: ConnectorPoint
  chip: ChipBox
  points: ConnectorPoint[]
}

/**
 * The connectors that fit, and a count of those that did not.
 *
 * A gutter column holds a fixed number of chips, and a busy board can carry more
 * refs than that. Rather than draw past the canvas edge where chips would paint
 * over other chrome, the extras are left out and counted. `omittedChip` is the box
 * to report that count in, held back from the column for the purpose.
 */
export interface ConnectorLayoutResult {
  placements: ConnectorPlacement[]
  omitted: number
  omittedChip: ChipBox | null
}

/** A box in viewport pixels, matching the rect a resize drag reports. */
export interface RefCardRect {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Where the ref card opens, in viewport pixels for a fixed element.
 *
 * All four edges are given, so a resize drag moves the edge under the pointer and
 * leaves the other three where they are. Anchoring one edge and capping the size
 * instead would swallow a drag once the cap was reached.
 *
 * `opens` says which way the card grew off its chip, which is also what decides
 * the edges it offers to drag.
 */
export interface RefCardPosition extends RefCardRect {
  opens: "below" | "above"
}

export interface ConnectorLayoutOptions {
  canvasWidth: number
  canvasHeight: number
  chipWidth: number
  chipHeight: number
  chipGap: number
  margin: number
}

/** Chip metrics the overlay draws with. Sizes are chrome pixels, not scaled. */
export const CONNECTOR_LAYOUT_DEFAULTS = {
  chipWidth: 200,
  chipHeight: 28,
  chipGap: 4,
  margin: 12,
} as const

/** Radius of the dot on a node's edge, in the same canvas pixels as the elbow. */
export const CONNECTOR_ANCHOR_RADIUS = 2

/**
 * Places a label chip for every referenced node and routes an elbow to it.
 *
 * Chips stack in a gutter down the right edge rather than floating beside their
 * nodes, so a dense selection reads as one column of labels instead of a scatter
 * that overlaps the design. Each chip wants to sit at its node's vertical center,
 * then gives way to the one above it.
 *
 * The column never draws past the canvas floor. A chip that would cross it is left
 * out and counted, because a chip outside the canvas would paint over other chrome.
 *
 * Coordinates are canvas-relative pixels, already scaled by the canvas zoom,
 * because overlays render outside the pan and zoom transform. Chip metrics stay
 * literal chrome pixels for the same reason.
 */
export function layoutConnectors(
  sources: ConnectorSource[],
  options: ConnectorLayoutOptions,
): ConnectorLayoutResult {
  const empty = { placements: [], omitted: 0, omittedChip: null }

  if (sources.length === 0) return empty

  const { canvasWidth, canvasHeight, chipWidth, chipHeight, chipGap, margin } = options
  const gutterLeft = canvasWidth - margin - chipWidth
  const floor = canvasHeight - margin

  const anchored = sources
    .map((source) => ({ source, preferredY: getPreferredChipY(source.rect, canvasHeight, margin) }))
    .sort(
      (a, b) =>
        a.preferredY - b.preferredY ||
        (a.source.order ?? 0) - (b.source.order ?? 0) ||
        a.source.key.localeCompare(b.source.key),
    )

  // Walk top to bottom, letting each chip take its node's center unless the one
  // above already claimed that space. A chip that would cross the floor stops the
  // column, and everything below it is reported as a count instead.
  const stacked: Array<{ source: ConnectorSource; top: number }> = []
  let cursor = margin

  for (const { source, preferredY } of anchored) {
    const top = Math.max(preferredY - chipHeight / 2, cursor)

    if (top + chipHeight > floor) break

    stacked.push({ source, top })
    cursor = top + chipHeight + chipGap
  }

  // The count needs a slot of its own. When the column ends too close to the floor
  // to add one, the last chip gives up its place, which is known to fit. A single
  // chip keeps its place instead, since showing one connector beats showing none.
  if (stacked.length < anchored.length && stacked.length > 1 && cursor + chipHeight > floor) {
    stacked.pop()
  }

  const omitted = anchored.length - stacked.length

  const placements = stacked.map(({ source, top }) => {
    const chip = {
      top,
      left: gutterLeft,
      width: chipWidth,
      height: chipHeight,
      centerY: top + chipHeight / 2,
    }

    const route = getConnectorRoute({
      rect: source.rect,
      chipCenterY: chip.centerY,
      gutterLeft,
      canvasHeight,
      margin,
    })

    return {
      key: source.key,
      label: source.label,
      muted: source.muted,
      anchor: route.anchor,
      chip,
      points: route.points,
    }
  })

  const lastChip = placements[placements.length - 1]?.chip

  return {
    placements,
    omitted,
    omittedChip: getOmittedChip({
      omitted,
      top: lastChip ? lastChip.top + lastChip.height + chipGap : margin,
      floor,
      gutterLeft,
      chipWidth,
      chipHeight,
    }),
  }
}

/** The slot for the count, under the last drawn chip, or nothing if it cannot fit. */
function getOmittedChip(input: {
  omitted: number
  top: number
  floor: number
  gutterLeft: number
  chipWidth: number
  chipHeight: number
}): ChipBox | null {
  if (input.omitted === 0) return null
  if (input.top + input.chipHeight > input.floor) return null

  return {
    top: input.top,
    left: input.gutterLeft,
    width: input.chipWidth,
    height: input.chipHeight,
    centerY: input.top + input.chipHeight / 2,
  }
}

/** The gap the card keeps off its chip. */
export const REF_CARD_GAP = 4

/** The size a card opens at until one is resized, and the smallest it can be dragged to. */
export const REF_CARD_DEFAULT_SIZE = { width: 300, height: 300 }
export const REF_CARD_MIN_SIZE = { width: 200, height: 120 }

/**
 * Places the ref card clear of its chip, in viewport pixels for a fixed element.
 *
 * The card opens leftward, because chips sit against the right edge, and away from
 * the chip's nearer horizontal edge, so the chip it belongs to stays readable. It
 * takes whichever side has more room, since a chip low in the gutter has none
 * below it.
 *
 * The height it opens at is trimmed to the room on that side, so a card never
 * covers the chip that opened it. A drag is free to grow past that, since by then
 * the reader has asked for a bigger card and can see what it covers.
 */
export function getRefCardPosition(
  chipRect: { top: number; bottom: number; right: number },
  viewport: { width: number; height: number },
  size: { width: number; height: number },
  margin = CONNECTOR_LAYOUT_DEFAULTS.margin,
): RefCardPosition {
  const below = viewport.height - chipRect.bottom - REF_CARD_GAP - margin
  const above = chipRect.top - REF_CARD_GAP - margin
  const opens = below >= above ? "below" : "above"
  const room = Math.max(opens === "below" ? below : above, REF_CARD_MIN_SIZE.height)

  const width = size.width
  const height = Math.min(size.height, room)
  const x = chipRect.right - width
  const y =
    opens === "below" ? chipRect.bottom + REF_CARD_GAP : chipRect.top - REF_CARD_GAP - height

  return { opens, ...clampRefCardRect({ x, y, width, height }, viewport, margin) }
}

/** Holds an opening card inside the viewport, sizing it down before moving it. */
function clampRefCardRect(
  rect: RefCardRect,
  viewport: { width: number; height: number },
  margin: number,
): RefCardRect {
  const width = clamp(rect.width, REF_CARD_MIN_SIZE.width, viewport.width - margin * 2)
  const height = clamp(rect.height, REF_CARD_MIN_SIZE.height, viewport.height - margin * 2)

  return {
    x: clamp(rect.x, margin, viewport.width - width - margin),
    y: clamp(rect.y, margin, viewport.height - height - margin),
    width,
    height,
  }
}

/** An SVG `d` string for one elbow, as a polyline through its points. */
export function toElbowPath(points: ConnectorPoint[]): string {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${round(point.x)} ${round(point.y)}`)
    .join(" ")
}

/**
 * The height a chip asks for, which is its node's vertical center.
 *
 * A node scrolled past the canvas edge still reports a rect, so this is held inside
 * the drawable area. Otherwise a chip would be placed against a point no one can see.
 * It seeds the sort and the stack, before a chip knows where it landed.
 */
function getPreferredChipY(rect: NodeRect, canvasHeight: number, margin: number): number {
  return clamp(rect.top + rect.height / 2, margin, canvasHeight - margin)
}

/**
 * The point on the node the connector leaves from, and the line from there to the chip.
 *
 * One turn at most. A chip that ended up above or below its node is met by running in
 * at the chip's own height to the node's horizontal center, then turning into the top
 * or bottom center point. Both legs stay clear of the node's box that way.
 *
 * A chip level with its node is met by a straight run into the right edge, with no turn
 * and no side center to aim for, so the point sits at the chip's height rather than the
 * node's center.
 *
 * The left center is never used, because chips sit in a gutter down the right edge and
 * a line to the far side would cross the node.
 */
function getConnectorRoute(input: {
  rect: NodeRect
  chipCenterY: number
  gutterLeft: number
  canvasHeight: number
  margin: number
}): { anchor: ConnectorPoint; points: ConnectorPoint[] } {
  const { rect, chipCenterY, gutterLeft, canvasHeight, margin } = input

  const top = clamp(rect.top, margin, canvasHeight - margin)
  const bottom = clamp(rect.top + rect.height, margin, canvasHeight - margin)
  const right = clamp(rect.left + rect.width, margin, gutterLeft)
  const centerX = clamp(rect.left + rect.width / 2, margin, gutterLeft)
  const gutterEnd = { x: gutterLeft, y: chipCenterY }

  if (chipCenterY < top) {
    const anchor = { x: centerX, y: top }

    return { anchor, points: simplify([anchor, { x: centerX, y: chipCenterY }, gutterEnd]) }
  }

  if (chipCenterY > bottom) {
    const anchor = { x: centerX, y: bottom }

    return { anchor, points: simplify([anchor, { x: centerX, y: chipCenterY }, gutterEnd]) }
  }

  const anchor = { x: right, y: chipCenterY }

  return { anchor, points: simplify([anchor, gutterEnd]) }
}

/**
 * Drops repeated and mid-line points, so a chip level with its node collapses the
 * elbow to a single straight run instead of three segments on the same line.
 */
function simplify(points: ConnectorPoint[]): ConnectorPoint[] {
  const kept: ConnectorPoint[] = []

  for (const point of points) {
    const previous = kept[kept.length - 1]

    if (previous && previous.x === point.x && previous.y === point.y) continue

    const beforePrevious = kept[kept.length - 2]
    const collinear =
      beforePrevious &&
      previous &&
      ((beforePrevious.x === previous.x && previous.x === point.x) ||
        (beforePrevious.y === previous.y && previous.y === point.y))

    if (collinear) {
      kept.pop()
    }

    kept.push(point)
  }

  return kept
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max))
}

function round(value: number): number {
  return Math.round(value * 10) / 10
}
