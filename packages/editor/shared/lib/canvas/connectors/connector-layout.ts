import type { NodeRect } from "../overlay/geometry"

/**
 * One referenced node that needs a connector, in canvas-relative pixels.
 *
 * `order` breaks a tie between two badges on the same node, ahead of the key, so a caller
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
 * `centerY` is where the connector meets it, and where the badge is anchored when it
 * draws, so both the elbow and the badge's own placement read one number rather than
 * deriving it twice.
 */
export interface BadgeBox {
  top: number
  left: number
  width: number
  height: number
  centerY: number
}

/**
 * Where one connector draws. `anchor` sits on the node's edge, `badge` is the
 * label box in the gutter, and `points` is the elbow between them.
 */
export interface ConnectorPlacement {
  key: string
  label: string
  muted: boolean
  anchor: ConnectorPoint
  badge: BadgeBox
  points: ConnectorPoint[]
}

/**
 * The connectors that fit, and a count of those that did not.
 *
 * A gutter column holds a fixed number of badges, and a busy board can carry more
 * refs than that. Rather than draw past the canvas edge where badges would paint
 * over other chrome, the extras are left out and counted. `omittedBadge` is the box
 * to report that count in, held back from the column for the purpose.
 */
export interface ConnectorLayoutResult {
  placements: ConnectorPlacement[]
  omitted: number
  omittedBadge: BadgeBox | null
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
 * `opens` and `grows` say which way the card cleared its badge, which is also what
 * decides the edges it offers to drag.
 */
export interface RefCardPosition extends RefCardRect {
  opens: "below" | "above"
  grows: "left" | "right"
}

/** The canvas edge the badge column hangs off. */
export type GutterSide = "left" | "right"

/**
 * What the column needs to place badges: the canvas it draws in, the badge sizes measured
 * from a drawn badge, the edge it hangs off, and the gap it keeps from that edge.
 *
 * `margin` is the band the column keeps off the canvas top and bottom. It is separate
 * from `badgeGap` so a caller can space the column differently from the badges inside it,
 * though the overlay passes the badge's own gap to both.
 */
export interface ConnectorLayoutOptions {
  canvasWidth: number
  canvasHeight: number
  badgeWidth: number
  badgeHeight: number
  badgeGap: number
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
 * Every other metric comes from a drawn badge, since the badge schema decides its own size.
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
 * Places a label badge for every referenced node and routes an elbow to it.
 *
 * Badges stack in a gutter down one canvas edge rather than floating beside their
 * nodes, so a dense selection reads as one column of labels instead of a scatter
 * that overlaps the design. Each badge wants to sit at its node's vertical center,
 * then gives way to the one above it. Every badge takes the caller's `badgeWidth`, so
 * the column reads as a block with its labels and its icons in line.
 *
 * Badges for nodes at the same height read from the gutter's edge inward, which is what
 * keeps their connectors from crossing each other. See `orderColumn`.
 *
 * The column never draws past the canvas floor. A badge that would cross it is left
 * out and counted, because a badge outside the canvas would paint over other chrome.
 *
 * Coordinates are canvas-relative pixels, already scaled by the canvas zoom,
 * because overlays render outside the pan and zoom transform. Badge metrics stay
 * literal chrome pixels for the same reason.
 */
export function layoutConnectors(
  sources: ConnectorSource[],
  options: ConnectorLayoutOptions,
): ConnectorLayoutResult {
  const empty = { placements: [], omitted: 0, omittedBadge: null }

  if (sources.length === 0) return empty

  const { canvasWidth, canvasHeight, badgeWidth, badgeHeight, badgeGap, margin, gutter, side } =
    options

  // Placed by the edge it hangs off, so every badge ends the same distance from that edge
  // whatever the labels are. A label too wide for the canvas stops at the far margin
  // rather than sliding off it.
  const wanted = side === "right" ? canvasWidth - gutter - badgeWidth : gutter
  const badgeLeft = clamp(wanted, margin, Math.max(margin, canvasWidth - margin - badgeWidth))

  // The badge edge facing the design, which is where a connector meets the column.
  const gutterEdge = side === "right" ? badgeLeft : badgeLeft + badgeWidth
  const floor = canvasHeight - margin

  const anchored = orderColumn(
    sources.map((source) => ({
      source,
      preferredY: getPreferredBadgeY(source.rect, canvasHeight, margin),
      centerX: source.rect.left + source.rect.width / 2,
    })),
    badgeGap,
    side,
  )

  const pitch = badgeHeight + badgeGap
  const capacity = Math.max(Math.floor((floor - margin + badgeGap) / pitch), 0)

  // Badges only ever leave the column when it cannot hold them all. The count then takes
  // the bottom slot for itself, unless that would leave nothing, since showing one
  // connector beats showing none.
  const fitting = Math.min(anchored.length, capacity)
  const countTakesSlot = fitting < anchored.length && fitting > 1
  const placed = countTakesSlot ? fitting - 1 : fitting
  const badgeFloor = countTakesSlot ? floor - pitch : floor

  // Walk top to bottom, letting each badge take its node's center unless the one above
  // already claimed that space, or the badges still below need the room. Reserving that
  // room keeps a node scrolled past the floor from crowding its neighbors out: its badge
  // holds at the bottom of the column with the connector pointing off the edge at it.
  const stacked: Array<{ source: ConnectorSource; top: number }> = []
  let cursor = margin

  for (let index = 0; index < placed; index++) {
    const { source, preferredY } = anchored[index]
    const ceiling = badgeFloor - badgeHeight - (placed - 1 - index) * pitch
    const top = clamp(preferredY - badgeHeight / 2, cursor, ceiling)

    stacked.push({ source, top })
    cursor = top + pitch
  }

  const omitted = anchored.length - stacked.length

  const placements = stacked.map(({ source, top }) => {
    const badge = {
      top,
      left: badgeLeft,
      width: badgeWidth,
      height: badgeHeight,
      centerY: top + badgeHeight / 2,
    }

    const route = getConnectorRoute({
      rect: source.rect,
      badgeCenterY: badge.centerY,
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
      badge,
      points: route.points,
    }
  })

  const lastBadge = placements[placements.length - 1]?.badge

  return {
    placements,
    omitted,
    omittedBadge: getOmittedBadge({
      omitted,
      top: lastBadge ? lastBadge.top + lastBadge.height + badgeGap : margin,
      floor,
      badgeLeft,
      badgeWidth,
      badgeHeight,
    }),
  }
}

/** One source with the heights and centers the column is read by. */
interface AnchoredBadge {
  source: ConnectorSource
  preferredY: number
  centerX: number
}

/**
 * Reads the column top to bottom in an order that keeps connectors from crossing.
 *
 * A connector runs vertically at its node's horizontal center and then horizontally at
 * its badge's height, so two of them only ever meet where one's horizontal run passes
 * through the other's vertical run. That needs the other node to sit further from the
 * gutter, which cannot happen while nodes at the same height are read inward from it.
 *
 * Nodes in one row rarely report the same center once the canvas is zoomed, so heights
 * within `band` are read as one row, and centers that close as one place in that row.
 * The column's own gap covers both, since two badges that close take neighboring slots
 * whichever way they are read.
 *
 * Height leads, so a badge still sits beside its node. Reading the whole column inward
 * would drop the last crossings, but it would also drag badges far from the nodes they
 * name, which is the point of the column.
 */
function orderColumn(anchored: AnchoredBadge[], band: number, side: GutterSide): AnchoredBadge[] {
  // Distance from the gutter's own edge, so one order covers both edges: the node nearest
  // the column is read first, and a run from a node behind it cannot cross back over.
  const fromGutter =
    side === "right"
      ? (badge: AnchoredBadge) => -badge.centerX
      : (badge: AnchoredBadge) => badge.centerX

  const byHeight = [...anchored].sort((a, b) => a.preferredY - b.preferredY || compareStable(a, b))

  return groupWithin(byHeight, (badge) => badge.preferredY, band).flatMap((row) => {
    const byCenter = [...row].sort((a, b) => fromGutter(a) - fromGutter(b) || compareStable(a, b))

    return groupWithin(byCenter, fromGutter, band).flatMap((column) => column.sort(compareStable))
  })
}

/**
 * Runs of neighboring items whose values sit within `band` of the one that opened the run.
 *
 * Both keys the column reads are measured, and a measurement moves by fractions of a
 * pixel while the canvas is panned. Comparing measurements directly lets that movement
 * decide the order, and the badges trade places every frame. Grouping first means a
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
 * The order for badges a measurement cannot separate: the caller's `order`, then the key.
 * Neither moves with the canvas, so a pan cannot reshuffle them.
 */
function compareStable(a: AnchoredBadge, b: AnchoredBadge): number {
  return (a.source.order ?? 0) - (b.source.order ?? 0) || a.source.key.localeCompare(b.source.key)
}

/** The slot for the count, under the last drawn badge, or nothing if it cannot fit. */
function getOmittedBadge(input: {
  omitted: number
  top: number
  floor: number
  badgeLeft: number
  badgeWidth: number
  badgeHeight: number
}): BadgeBox | null {
  if (input.omitted === 0) return null
  if (input.top + input.badgeHeight > input.floor) return null

  return {
    top: input.top,
    left: input.badgeLeft,
    width: input.badgeWidth,
    height: input.badgeHeight,
    centerY: input.top + input.badgeHeight / 2,
  }
}

/**
 * The theme variables the card opens by, which a caller resolves to pixels.
 *
 * `gap` is what the card keeps off its badge. `margin` is the band it keeps off the
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
 * Places the ref card clear of its badge, in viewport pixels for a fixed element.
 *
 * The card clears its badge vertically and lines up with it horizontally, so the badge
 * that opened it stays readable beside it. Both directions go to whichever side has
 * more room, since a badge low in the gutter has none below it and a badge in a gutter
 * down the left edge has none to its left.
 *
 * The height it opens at is trimmed to the room on that side, so a card never
 * covers the badge that opened it. A drag is free to grow past that, since by then
 * the reader has asked for a bigger card and can see what it covers.
 */
export function getRefCardPosition(
  badgeRect: { top: number; bottom: number; left: number; right: number },
  viewport: { width: number; height: number },
  size: { width: number; height: number },
  metrics: RefCardMetrics,
): RefCardPosition {
  const { gap, margin } = metrics
  const below = viewport.height - badgeRect.bottom - gap - margin
  const above = badgeRect.top - gap - margin
  const opens = below >= above ? "below" : "above"
  const room = Math.max(opens === "below" ? below : above, metrics.minHeight)

  const leftward = badgeRect.right - margin
  const rightward = viewport.width - badgeRect.left - margin
  const grows = leftward >= rightward ? "left" : "right"

  const width = size.width
  const height = Math.min(size.height, room)
  const x = grows === "left" ? badgeRect.right - width : badgeRect.left
  const y = opens === "below" ? badgeRect.bottom + gap : badgeRect.top - gap - height

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
 * The height a badge asks for, which is its node's vertical center.
 *
 * A node scrolled past the canvas edge still reports a rect, so this is held inside
 * the drawable area. Otherwise a badge would be placed against a point no one can see.
 * It seeds the sort and the stack, before a badge knows where it landed.
 */
function getPreferredBadgeY(rect: NodeRect, canvasHeight: number, margin: number): number {
  return clamp(rect.top + rect.height / 2, margin, canvasHeight - margin)
}

/**
 * The point on the node the connector leaves from, and the line from there to the badge.
 *
 * One turn at most. A badge that ended up above or below its node is met by running in
 * at the badge's own height to the node's horizontal center, then turning into the top
 * or bottom center point. Both legs stay clear of the node's box that way.
 *
 * A badge level with its node is met by a straight run into the side facing the gutter,
 * with no turn and no side center to aim for, so the point sits at the badge's height
 * rather than the node's center.
 *
 * Only the side facing the gutter is used, because a line to the far side would cross
 * the node to reach the column.
 */
function getConnectorRoute(input: {
  rect: NodeRect
  badgeCenterY: number
  gutterEdge: number
  side: GutterSide
  canvasWidth: number
  canvasHeight: number
  margin: number
}): { anchor: ConnectorPoint; points: ConnectorPoint[] } {
  const { rect, badgeCenterY, gutterEdge, side, canvasWidth, canvasHeight, margin } = input

  // Held between the column and the far margin, so a node panned past either edge is
  // still pointed at from inside the canvas.
  const nearestX = side === "right" ? margin : gutterEdge
  const furthestX = side === "right" ? gutterEdge : canvasWidth - margin

  const top = clamp(rect.top, margin, canvasHeight - margin)
  const bottom = clamp(rect.top + rect.height, margin, canvasHeight - margin)
  const facing = side === "right" ? rect.left + rect.width : rect.left
  const nodeSide = clamp(facing, nearestX, furthestX)
  const centerX = clamp(rect.left + rect.width / 2, nearestX, furthestX)
  const gutterEnd = { x: gutterEdge, y: badgeCenterY }

  if (badgeCenterY < top) {
    const anchor = { x: centerX, y: top }

    return { anchor, points: simplify([anchor, { x: centerX, y: badgeCenterY }, gutterEnd]) }
  }

  if (badgeCenterY > bottom) {
    const anchor = { x: centerX, y: bottom }

    return { anchor, points: simplify([anchor, { x: centerX, y: badgeCenterY }, gutterEnd]) }
  }

  const anchor = { x: nodeSide, y: badgeCenterY }

  return { anchor, points: simplify([anchor, gutterEnd]) }
}

/**
 * Drops repeated and mid-line points, so a badge level with its node collapses the
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
