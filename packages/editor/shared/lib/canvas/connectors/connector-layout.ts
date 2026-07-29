import type { NodeRect } from "../overlay/geometry"

/**
 * One referenced node that needs a connector, in canvas-relative pixels.
 *
 * `order` breaks a tie between two chips on the same node, ahead of the key, so a caller
 * can keep them in the order it means them to read.
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
 * `opens` and `grows` say which way the card cleared its chip, which is also what
 * decides the edges it offers to drag.
 */
export interface RefCardPosition extends RefCardRect {
  opens: "below" | "above"
  grows: "left" | "right"
}

/** The canvas edge the chip column hangs off. */
export type GutterSide = "left" | "right"

/**
 * What the column needs to place chips: the canvas it draws in, the chip sizes measured
 * from a drawn chip, the edge it hangs off, and the gap it keeps from that edge.
 *
 * `margin` is the band the column keeps off the canvas top and bottom. It is separate
 * from `chipGap` so a caller can space the column differently from the chips inside it,
 * though the overlay passes the chip's own gap to both.
 */
export interface ConnectorLayoutOptions {
  canvasWidth: number
  canvasHeight: number
  chipWidth: number
  chipHeight: number
  chipGap: number
  margin: number
  gutter: number
  side: GutterSide
}

/**
 * The theme variables the column draws by, which a caller resolves to pixels.
 *
 * Declared as variables because this spacing belongs to the theme like any other, and
 * measuring rather than styling is the only reason numbers come into it at all. Sizes
 * are chrome pixels once resolved, not scaled, since overlays draw outside the canvas
 * transform.
 *
 * `gutter` is the gap the column keeps off the canvas edge it hangs off, which on the
 * right is the sidebar edge. `anchorRadius` is the dot where a connector meets its node.
 * Every other metric comes from a drawn chip, since the chip schema decides its own size.
 */
export const CONNECTOR_TOKENS = {
  gutter: "--sdn-margins-cozy",
  anchorRadius: "--sdn-sizes-tiny",
} as const

/**
 * The canvas edge the column should hang off for these nodes.
 *
 * The edge with more free canvas between it and the nodes wins. That is the edge the
 * nodes are furthest from, so the column is drawn where there is least design to cover,
 * and a connector reaches across empty canvas rather than over the board.
 *
 * Room is what a pan changes evenly: one edge gains what the other gives up, so there is
 * a single point where the edges trade places and a pan flips the column once. Deciding
 * by the nearer edge instead would read well while the nodes are inboard and then fight
 * this, since the nearer edge is the one about to be covered, and the column would swap
 * back and forth on the way across.
 *
 * `current` is what the column does now, and the other edge has to win by the gutter to
 * take it, so a hairline crossing cannot make the column chatter.
 */
export function getGutterSide(
  sources: ConnectorSource[],
  options: { canvasWidth: number; gutter: number },
  current: GutterSide,
): GutterSide {
  if (sources.length === 0) return current

  const { canvasWidth, gutter } = options
  const room = { left: Infinity, right: Infinity }

  for (const source of sources) {
    room.left = Math.min(room.left, source.rect.left)
    room.right = Math.min(room.right, canvasWidth - (source.rect.left + source.rect.width))
  }

  const other: GutterSide = current === "right" ? "left" : "right"

  if (room[other] > room[current] + gutter) return other

  return current
}

/**
 * Places a label chip for every referenced node and routes an elbow to it.
 *
 * Chips stack in a gutter down one canvas edge rather than floating beside their
 * nodes, so a dense selection reads as one column of labels instead of a scatter
 * that overlaps the design. Each chip wants to sit at its node's vertical center,
 * then gives way to the one above it. Every chip takes the caller's `chipWidth`, so
 * the column reads as a block with its labels and its icons in line.
 *
 * Chips for nodes at the same height read from the gutter's edge inward, which is what
 * keeps their connectors from crossing each other. See `orderColumn`.
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

  const { canvasWidth, canvasHeight, chipWidth, chipHeight, chipGap, margin, gutter, side } =
    options

  // Placed by the edge it hangs off, so every chip ends the same distance from that edge
  // whatever the labels are. A label too wide for the canvas stops at the far margin
  // rather than sliding off it.
  const wanted = side === "right" ? canvasWidth - gutter - chipWidth : gutter
  const chipLeft = clamp(wanted, margin, Math.max(margin, canvasWidth - margin - chipWidth))

  // The chip edge facing the design, which is where a connector meets the column.
  const gutterEdge = side === "right" ? chipLeft : chipLeft + chipWidth
  const floor = canvasHeight - margin

  const anchored = orderColumn(
    sources.map((source) => ({
      source,
      preferredY: getPreferredChipY(source.rect, canvasHeight, margin),
      centerX: source.rect.left + source.rect.width / 2,
    })),
    chipGap,
    side,
  )

  const pitch = chipHeight + chipGap
  const capacity = Math.max(Math.floor((floor - margin + chipGap) / pitch), 0)

  // Chips only ever leave the column when it cannot hold them all. The count then takes
  // the bottom slot for itself, unless that would leave nothing, since showing one
  // connector beats showing none.
  const fitting = Math.min(anchored.length, capacity)
  const countTakesSlot = fitting < anchored.length && fitting > 1
  const placed = countTakesSlot ? fitting - 1 : fitting
  const chipFloor = countTakesSlot ? floor - pitch : floor

  // Walk top to bottom, letting each chip take its node's center unless the one above
  // already claimed that space, or the chips still below need the room. Reserving that
  // room keeps a node scrolled past the floor from crowding its neighbors out: its chip
  // holds at the bottom of the column with the connector pointing off the edge at it.
  const stacked: Array<{ source: ConnectorSource; top: number }> = []
  let cursor = margin

  for (let index = 0; index < placed; index++) {
    const { source, preferredY } = anchored[index]
    const ceiling = chipFloor - chipHeight - (placed - 1 - index) * pitch
    const top = clamp(preferredY - chipHeight / 2, cursor, ceiling)

    stacked.push({ source, top })
    cursor = top + pitch
  }

  const omitted = anchored.length - stacked.length

  const placements = stacked.map(({ source, top }) => {
    const chip = {
      top,
      left: chipLeft,
      width: chipWidth,
      height: chipHeight,
      centerY: top + chipHeight / 2,
    }

    const route = getConnectorRoute({
      rect: source.rect,
      chipCenterY: chip.centerY,
      gutterEdge,
      side,
      canvasWidth,
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
      chipLeft,
      chipWidth,
      chipHeight,
    }),
  }
}

/** One source with the heights and centers the column is read by. */
interface AnchoredChip {
  source: ConnectorSource
  preferredY: number
  centerX: number
}

/**
 * Reads the column top to bottom in an order that keeps connectors from crossing.
 *
 * A connector runs vertically at its node's horizontal center and then horizontally at
 * its chip's height, so two of them only ever meet where one's horizontal run passes
 * through the other's vertical run. That needs the other node to sit further from the
 * gutter, which cannot happen while nodes at the same height are read inward from it.
 *
 * Nodes in one row rarely report the same center once the canvas is zoomed, so heights
 * within `band` are read as one row, and centers that close as one place in that row.
 * The column's own gap covers both, since two chips that close take neighboring slots
 * whichever way they are read.
 *
 * Height leads, so a chip still sits beside its node. Reading the whole column inward
 * would drop the last crossings, but it would also drag chips far from the nodes they
 * name, which is the point of the column.
 */
function orderColumn(anchored: AnchoredChip[], band: number, side: GutterSide): AnchoredChip[] {
  // Distance from the gutter's own edge, so one order covers both edges: the node nearest
  // the column is read first, and a run from a node behind it cannot cross back over.
  const fromGutter =
    side === "right" ? (chip: AnchoredChip) => -chip.centerX : (chip: AnchoredChip) => chip.centerX

  const byHeight = [...anchored].sort((a, b) => a.preferredY - b.preferredY || compareStable(a, b))

  return groupWithin(byHeight, (chip) => chip.preferredY, band).flatMap((row) => {
    const byCenter = [...row].sort((a, b) => fromGutter(a) - fromGutter(b) || compareStable(a, b))

    return groupWithin(byCenter, fromGutter, band).flatMap((column) => column.sort(compareStable))
  })
}

/**
 * Runs of neighboring items whose values sit within `band` of the one that opened the run.
 *
 * Both keys the column reads are measured, and a measurement moves by fractions of a
 * pixel while the canvas is panned. Comparing measurements directly lets that movement
 * decide the order, and the chips trade places every frame. Grouping first means a
 * difference that small settles on something that does not move at all.
 *
 * Takes the items already sorted by `value`, ascending.
 */
function groupWithin<TItem>(sorted: TItem[], value: (item: TItem) => number, band: number) {
  const groups: TItem[][] = []

  for (const item of sorted) {
    const group = groups[groups.length - 1]

    if (group && value(item) - value(group[0]) <= band) {
      group.push(item)
      continue
    }

    groups.push([item])
  }

  return groups
}

/**
 * The order for chips a measurement cannot separate: the caller's `order`, then the key.
 * Neither moves with the canvas, so a pan cannot reshuffle them.
 */
function compareStable(a: AnchoredChip, b: AnchoredChip): number {
  return (a.source.order ?? 0) - (b.source.order ?? 0) || a.source.key.localeCompare(b.source.key)
}

/** The slot for the count, under the last drawn chip, or nothing if it cannot fit. */
function getOmittedChip(input: {
  omitted: number
  top: number
  floor: number
  chipLeft: number
  chipWidth: number
  chipHeight: number
}): ChipBox | null {
  if (input.omitted === 0) return null
  if (input.top + input.chipHeight > input.floor) return null

  return {
    top: input.top,
    left: input.chipLeft,
    width: input.chipWidth,
    height: input.chipHeight,
    centerY: input.top + input.chipHeight / 2,
  }
}

/**
 * The theme variables the card opens by, which a caller resolves to pixels.
 *
 * `gap` is what the card keeps off its chip. `margin` is the band it keeps off the
 * viewport edge. The card is drawn from the `PanelRefs` schema, so its surface, its
 * type, and the spacing inside it are already the theme's, and these two say the same
 * about the space around it.
 */
export const REF_CARD_TOKENS = {
  gap: "--sdn-gaps-tight",
  margin: "--sdn-margins-cozy",
} as const

/** The pixels a card opens by: what it keeps clear, and how small it may be drawn. */
export interface RefCardMetrics {
  gap: number
  margin: number
  minWidth: number
  minHeight: number
}

/**
 * Places the ref card clear of its chip, in viewport pixels for a fixed element.
 *
 * The card clears its chip vertically and lines up with it horizontally, so the chip
 * that opened it stays readable beside it. Both directions go to whichever side has
 * more room, since a chip low in the gutter has none below it and a chip in a gutter
 * down the left edge has none to its left.
 *
 * The height it opens at is trimmed to the room on that side, so a card never
 * covers the chip that opened it. A drag is free to grow past that, since by then
 * the reader has asked for a bigger card and can see what it covers.
 */
export function getRefCardPosition(
  chipRect: { top: number; bottom: number; left: number; right: number },
  viewport: { width: number; height: number },
  size: { width: number; height: number },
  metrics: RefCardMetrics,
): RefCardPosition {
  const { gap, margin } = metrics
  const below = viewport.height - chipRect.bottom - gap - margin
  const above = chipRect.top - gap - margin
  const opens = below >= above ? "below" : "above"
  const room = Math.max(opens === "below" ? below : above, metrics.minHeight)

  const leftward = chipRect.right - margin
  const rightward = viewport.width - chipRect.left - margin
  const grows = leftward >= rightward ? "left" : "right"

  const width = size.width
  const height = Math.min(size.height, room)
  const x = grows === "left" ? chipRect.right - width : chipRect.left
  const y = opens === "below" ? chipRect.bottom + gap : chipRect.top - gap - height

  return { opens, grows, ...clampRefCardRect({ x, y, width, height }, viewport, metrics) }
}

/** Holds an opening card inside the viewport, sizing it down before moving it. */
function clampRefCardRect(
  rect: RefCardRect,
  viewport: { width: number; height: number },
  metrics: RefCardMetrics,
): RefCardRect {
  const { margin } = metrics
  const width = clamp(rect.width, metrics.minWidth, viewport.width - margin * 2)
  const height = clamp(rect.height, metrics.minHeight, viewport.height - margin * 2)

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
 * A chip level with its node is met by a straight run into the side facing the gutter,
 * with no turn and no side center to aim for, so the point sits at the chip's height
 * rather than the node's center.
 *
 * Only the side facing the gutter is used, because a line to the far side would cross
 * the node to reach the column.
 */
function getConnectorRoute(input: {
  rect: NodeRect
  chipCenterY: number
  gutterEdge: number
  side: GutterSide
  canvasWidth: number
  canvasHeight: number
  margin: number
}): { anchor: ConnectorPoint; points: ConnectorPoint[] } {
  const { rect, chipCenterY, gutterEdge, side, canvasWidth, canvasHeight, margin } = input

  // Held between the column and the far margin, so a node panned past either edge is
  // still pointed at from inside the canvas.
  const nearestX = side === "right" ? margin : gutterEdge
  const furthestX = side === "right" ? gutterEdge : canvasWidth - margin

  const top = clamp(rect.top, margin, canvasHeight - margin)
  const bottom = clamp(rect.top + rect.height, margin, canvasHeight - margin)
  const facing = side === "right" ? rect.left + rect.width : rect.left
  const nodeSide = clamp(facing, nearestX, furthestX)
  const centerX = clamp(rect.left + rect.width / 2, nearestX, furthestX)
  const gutterEnd = { x: gutterEdge, y: chipCenterY }

  if (chipCenterY < top) {
    const anchor = { x: centerX, y: top }

    return { anchor, points: simplify([anchor, { x: centerX, y: chipCenterY }, gutterEnd]) }
  }

  if (chipCenterY > bottom) {
    const anchor = { x: centerX, y: bottom }

    return { anchor, points: simplify([anchor, { x: centerX, y: chipCenterY }, gutterEnd]) }
  }

  const anchor = { x: nodeSide, y: chipCenterY }

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
