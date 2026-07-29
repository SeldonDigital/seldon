import type { NodeRect } from "../overlay/geometry"

/** One referenced node that needs a connector, in canvas-relative pixels. */
export interface ConnectorSource {
  key: string
  label: string
  rect: NodeRect
  muted: boolean
}

export interface ConnectorPoint {
  x: number
  y: number
}

export interface ChipBox {
  top: number
  left: number
  width: number
  height: number
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
  stub: number
  margin: number
}

/** Chip metrics the overlay draws with. Sizes are chrome pixels, not scaled. */
export const CONNECTOR_LAYOUT_DEFAULTS = {
  chipWidth: 200,
  chipHeight: 28,
  chipGap: 4,
  stub: 16,
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

  const { canvasWidth, canvasHeight, chipWidth, chipHeight, chipGap, stub, margin } = options
  const gutterLeft = canvasWidth - margin - chipWidth
  const floor = canvasHeight - margin

  const anchored = sources
    .map((source) => ({ source, anchor: getAnchor(source.rect, gutterLeft, canvasHeight, margin) }))
    .sort((a, b) => a.anchor.y - b.anchor.y || a.source.key.localeCompare(b.source.key))

  // Walk top to bottom, letting each chip take its node's center unless the one
  // above already claimed that space. A chip that would cross the floor stops the
  // column, and everything below it is reported as a count instead.
  const stacked: Array<{ source: ConnectorSource; anchor: ConnectorPoint; top: number }> = []
  let cursor = margin

  for (const { source, anchor } of anchored) {
    const top = Math.max(anchor.y - chipHeight / 2, cursor)

    if (top + chipHeight > floor) break

    stacked.push({ source, anchor, top })
    cursor = top + chipHeight + chipGap
  }

  // The count needs a slot of its own. When the column ends too close to the floor
  // to add one, the last chip gives up its place, which is known to fit. A single
  // chip keeps its place instead, since showing one connector beats showing none.
  if (stacked.length < anchored.length && stacked.length > 1 && cursor + chipHeight > floor) {
    stacked.pop()
  }

  const omitted = anchored.length - stacked.length

  const placements = stacked.map(({ source, anchor, top }) => {
    const chip = {
      top,
      left: gutterLeft,
      width: chipWidth,
      height: chipHeight,
    }

    return {
      key: source.key,
      label: source.label,
      muted: source.muted,
      anchor,
      chip,
      points: getElbowPoints({
        anchor,
        chipCenterY: top + chipHeight / 2,
        gutterLeft,
        stub,
      }),
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
 * The node edge the connector leaves from, at the right side's vertical center.
 *
 * A node scrolled past the canvas edge still reports a rect, so the anchor is
 * held inside the drawable area. Otherwise a line would run off to a point no
 * one can see and read as noise.
 */
function getAnchor(
  rect: NodeRect,
  gutterLeft: number,
  canvasHeight: number,
  margin: number,
): ConnectorPoint {
  return {
    x: clamp(rect.left + rect.width, margin, gutterLeft),
    y: clamp(rect.top + rect.height / 2, margin, canvasHeight - margin),
  }
}

/**
 * Three axis-aligned segments from the node out to the chip. The turn happens a
 * stub's length off the node, so the line clears the node's own edge before it
 * runs vertically.
 */
function getElbowPoints(input: {
  anchor: ConnectorPoint
  chipCenterY: number
  gutterLeft: number
  stub: number
}): ConnectorPoint[] {
  const turnX = Math.min(input.anchor.x + input.stub, input.gutterLeft - input.stub)

  return simplify([
    input.anchor,
    { x: turnX, y: input.anchor.y },
    { x: turnX, y: input.chipCenterY },
    { x: input.gutterLeft, y: input.chipCenterY },
  ])
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
