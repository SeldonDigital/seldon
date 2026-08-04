import { badgeColumnLeft, simplify } from "./connector-layout"

import type { NodeRect } from "../overlay/geometry"
import type { BadgeBox, ConnectorPoint, GutterSide } from "./connector-layout"

/**
 * How far a badge's stub runs off the gutter before it meets its group's bus, in canvas
 * pixels. Geometry, not a style value, so it stays a named number rather than a token.
 */
export const TOKEN_STUB_LENGTH = 20

/** The badge box and the group it belongs to, which the column and the routing both read. */
export interface TokenBadgePlacement {
  key: string
  group: string
  muted: boolean
  badge: BadgeBox
}

/** One badge's short run off the gutter to its group's bus. */
export interface TokenStubGeometry {
  key: string
  muted: boolean
  points: ConnectorPoint[]
}

/** One run of a group's trunk, carrying its own muted state so a leg can stay dashed. */
export interface TokenTrunkSegment {
  points: ConnectorPoint[]
  muted: boolean
}

/**
 * One group's single connector to the object: the elbow from the object to the group's bus,
 * the bus split into runs, and the dot where it meets the node. A group reads as one
 * connector however many badges feed it, but each run keeps its own muted state so a bus
 * piece that only leads on to default tokens stays dashed until it meets a solid run. `key`
 * is the group id, unique per trunk. `muted` is the anchor dot's state, faint only when
 * every badge in the group is muted.
 */
export interface TokenTrunkGeometry {
  key: string
  muted: boolean
  segments: TokenTrunkSegment[]
  anchor: ConnectorPoint
}

export interface TokenConnectorGeometry {
  stubs: TokenStubGeometry[]
  trunks: TokenTrunkGeometry[]
}

export interface TokenConnectorOptions {
  side: GutterSide
  rect: NodeRect
  canvasWidth: number
  canvasHeight: number
  margin: number
  stubLength?: number
  /**
   * When set, the trunks meet the node at its own edges rather than at the viewport, so the
   * connectors scroll off with the board. Left unset they are held inside the canvas.
   */
  boardAnchored?: boolean
}

/** An item the column places: its key, the group that clusters it, and its muted state. */
export interface TokenColumnItem {
  key: string
  group: string
  muted: boolean
}

/**
 * What the token column needs to place badges: the canvas it draws in, the badge sizes
 * measured from a drawn badge, the edge it hangs off, the gutter it keeps off that edge,
 * and the height the whole stack is centered on.
 */
export interface TokenColumnOptions {
  canvasWidth: number
  canvasHeight: number
  badgeWidth: number
  badgeHeight: number
  badgeGap: number
  margin: number
  gutter: number
  side: GutterSide
  selectionCenterY: number
  /**
   * The board edge x to hang the column off, when it should sit beside the design rather
   * than the canvas edge. Left unset the column hangs off the canvas edge as before.
   */
  boardEdgeX?: number
}

/** Where a group's trunk meets the node, decided by the group's height against its span. */
type BandName = "above" | "center" | "below"

/**
 * Stacks the badges in a gutter column, grouped, and seated on the selection.
 *
 * Badges keep their group's order and sit shoulder to shoulder within a group, with a wider
 * gap of a badge and a half between one group and the next, so the column reads as clusters.
 * The stack is offset so the group nearest its middle lands on the selection's center, so at
 * least one group reads straight across and the rest spread above and below it. The stack
 * holds inside the canvas when it is short enough, and otherwise starts at the top margin
 * and runs on down.
 *
 * Coordinates are canvas-relative pixels, already scaled by the canvas zoom, since overlays
 * draw outside the pan and zoom transform. Badge metrics stay literal chrome pixels.
 */
export function layoutTokenColumn(
  items: TokenColumnItem[],
  options: TokenColumnOptions,
): TokenBadgePlacement[] {
  if (items.length === 0) return []

  const { canvasWidth, canvasHeight, badgeWidth, badgeHeight, badgeGap, margin, gutter, side } =
    options
  const interGroupGap = badgeHeight / 2 + badgeHeight

  // A board-anchored column travels with the design: it is not held to the viewport, so the
  // stack tracks the selection and scrolls off with it. Canvas-anchored, it stays clear of
  // the chrome the viewport edges keep clear.
  const boardAnchored = options.boardEdgeX !== undefined

  const wanted = badgeColumnLeft(options.boardEdgeX, canvasWidth, gutter, badgeWidth, side)
  const badgeLeft = boardAnchored
    ? wanted
    : clamp(wanted, margin, Math.max(margin, canvasWidth - margin - badgeWidth))

  // Tops measured from zero, so the stack's own height is known before it is placed, then
  // the whole run is offset once to seat it against the selection.
  const tops: number[] = []
  let cursor = 0
  let previousGroup: string | null = null

  for (const item of items) {
    if (previousGroup !== null) {
      cursor += previousGroup === item.group ? badgeGap : interGroupGap
    }

    tops.push(cursor)
    cursor += badgeHeight
    previousGroup = item.group
  }

  const totalHeight = cursor

  // Seat the stack so the group nearest its middle lands on the selection's center, rather
  // than centering the stack's own midpoint, which can fall in a gap and leave no group
  // level with the node. That group then reads straight across, and the rest sit above and
  // below it. Near a canvas edge the clamp wins, so the stack stays fully in view.
  const anchorCenter = nearestGroupCenter(items, tops, badgeHeight, totalHeight / 2)
  const fits = totalHeight <= canvasHeight - margin * 2
  const alignedTop = options.selectionCenterY - anchorCenter
  const stackTop = boardAnchored
    ? alignedTop
    : fits
      ? clamp(alignedTop, margin, canvasHeight - margin - totalHeight)
      : margin

  return items.map((item, index) => {
    const top = stackTop + tops[index]

    return {
      key: item.key,
      group: item.group,
      muted: item.muted,
      badge: {
        top,
        left: badgeLeft,
        width: badgeWidth,
        height: badgeHeight,
        centerY: top + badgeHeight / 2,
      },
    }
  })
}

/**
 * The bus midpoint, in the column's own coordinates, of the group whose midpoint is closest
 * to `target`. That group is the one seated on the selection so it reads straight across.
 * Each group's midpoint is the mean of its first and last badge centers, matching the
 * `trunkY` the connector geometry draws from.
 */
function nearestGroupCenter(
  items: TokenColumnItem[],
  tops: number[],
  badgeHeight: number,
  target: number,
): number {
  let best = target
  let bestDistance = Infinity
  let currentGroup: string | null = null
  let groupTop = 0
  let groupBottom = 0

  const consider = () => {
    const center = (groupTop + groupBottom) / 2
    const distance = Math.abs(center - target)

    if (distance < bestDistance) {
      best = center
      bestDistance = distance
    }
  }

  items.forEach((item, index) => {
    const center = tops[index] + badgeHeight / 2

    if (item.group !== currentGroup) {
      if (currentGroup !== null) consider()

      currentGroup = item.group
      groupTop = center
      groupBottom = center
      return
    }

    groupBottom = center
  })

  if (currentGroup !== null) consider()

  return best
}

/**
 * Routes one connector per group, each meeting the node where the group sits against it.
 *
 * Every badge runs a short stub off the gutter to a vertical bus shared by its group, and
 * one trunk carries that bus to the node. A group level with the node runs straight across
 * into its facing side. A group stacked above or below the node can not reach it head-on,
 * so its trunk runs to the node's near edge and turns to the top or bottom corner. Which of
 * the three a group takes follows where the centered stack put it, so a lone group connects
 * straight across and the groups a taller stack pushes off the node reach in at its corners.
 *
 * The stub keeps each badge's own muted state, since a default or inherited token still
 * reads faint on its own leg. A trunk mutes only when every badge feeding it is muted.
 */
export function buildTokenConnectorGeometry(
  placements: TokenBadgePlacement[],
  options: TokenConnectorOptions,
): TokenConnectorGeometry {
  if (placements.length === 0) return { stubs: [], trunks: [] }

  const { side, rect, canvasWidth, canvasHeight, margin } = options
  const stubLength = options.stubLength ?? TOKEN_STUB_LENGTH
  const boardAnchored = options.boardAnchored ?? false

  // Every badge shares a width and a left, so the gutter edge and the bus sit at one x.
  const first = placements[0].badge
  const gutterEdge = side === "right" ? first.left : first.left + first.width
  const direction = side === "left" ? 1 : -1
  const stubX = gutterEdge + direction * stubLength

  const stubs = placements.map((placement) => ({
    key: placement.key,
    muted: placement.muted,
    points: [
      { x: gutterEdge, y: placement.badge.centerY },
      { x: stubX, y: placement.badge.centerY },
    ],
  }))

  // The node's span, clamped like the route clamps it, so a group is banded by the same
  // top and bottom the trunk will actually reach. Board-anchored, the span is the node's own
  // edges so the trunk scrolls off with it rather than bending to stay in view.
  const rectBottom = rect.top + rect.height
  const spanTop = boardAnchored ? rect.top : clamp(rect.top, margin, canvasHeight - margin)
  const spanBottom = boardAnchored ? rectBottom : clamp(rectBottom, margin, canvasHeight - margin)

  // The node edge facing the gutter, which every group's trunk meets. Canvas-anchored it is
  // held inside the canvas so a node panned past the edge is still pointed at from a visible
  // corner; board-anchored it meets the node's own edge.
  const facing = side === "left" ? rect.left : rect.left + rect.width
  const nearSide = boardAnchored ? facing : clamp(facing, margin, canvasWidth - margin)

  const groups = groupInOrder(placements)
  const trunks: TokenTrunkGeometry[] = []

  for (const members of groups.values()) {
    const centers = members.map((member) => member.badge.centerY)
    const busTop = Math.min(...centers)
    const busBottom = Math.max(...centers)
    // Leave from the middle of the group's bus, so one trunk carries the whole group.
    const trunkY = (busTop + busBottom) / 2
    const band = bandForTrunk(trunkY, spanTop, spanBottom)

    const route = routeGroupTrunk({ band, nearSide, trunkY, stubX, spanTop, spanBottom })

    const allMuted = members.every((member) => member.muted)

    // The elbow carries the group's current to the node, so it is solid unless the whole
    // group is muted. The bus is split into runs that each stay dashed until a non-muted
    // badge feeds them, so a piece that only leads on to default tokens reads faint.
    const segments: TokenTrunkSegment[] = [{ points: route.points, muted: allMuted }]

    if (busBottom > busTop) {
      segments.push(...buildBusSegments(members, trunkY, stubX))
    }

    trunks.push({
      key: members[0].group,
      muted: allMuted,
      segments,
      anchor: route.anchor,
    })
  }

  return { stubs, trunks }
}

/** Float slack for treating a badge center as sitting on a bus breakpoint. */
const BUS_EPSILON = 0.5

/**
 * Splits a group's vertical bus into runs at each badge center and the trunk junction.
 *
 * Current flows from each badge in toward the junction at `trunkY`. A run is solid when a
 * non-muted badge lies beyond it, away from the junction, and dashed when only muted badges
 * do. So a run past the last solid badge on its side stays dashed, and a default token's leg
 * reads faint from its stub through the bus until it merges with a solid run.
 */
function buildBusSegments(
  members: TokenBadgePlacement[],
  trunkY: number,
  stubX: number,
): TokenTrunkSegment[] {
  const centers = members.map((member) => member.badge.centerY)
  const muted = members.map((member) => member.muted)
  const breakpoints = Array.from(new Set([...centers, trunkY])).sort((a, b) => a - b)

  const segments: TokenTrunkSegment[] = []

  for (let index = 0; index < breakpoints.length - 1; index++) {
    const top = breakpoints[index]
    const bottom = breakpoints[index + 1]

    if (bottom - top < BUS_EPSILON) continue

    const above = (top + bottom) / 2 < trunkY
    const solid = centers.some((center, member) => {
      if (muted[member]) return false

      return above ? center <= top + BUS_EPSILON : center >= bottom - BUS_EPSILON
    })

    segments.push({
      points: [
        { x: stubX, y: top },
        { x: stubX, y: bottom },
      ],
      muted: !solid,
    })
  }

  return segments
}

/** Where a group's trunk meets the node, from its bus midpoint against the node's span. */
function bandForTrunk(trunkY: number, spanTop: number, spanBottom: number): BandName {
  if (trunkY < spanTop) return "above"
  if (trunkY > spanBottom) return "below"

  return "center"
}

/**
 * The trunk from a group's bus to the node, and the dot where it meets it.
 *
 * A center group runs straight across into the node's near side at its own height. A group
 * above or below the node can not reach it head-on, so its trunk runs at the group's height
 * to the node's near edge, then turns down or up along that edge to the top or bottom
 * corner. The turn stays in the channel beside the node rather than crossing over it.
 */
function routeGroupTrunk(input: {
  band: BandName
  nearSide: number
  trunkY: number
  stubX: number
  spanTop: number
  spanBottom: number
}): { anchor: ConnectorPoint; points: ConnectorPoint[] } {
  const { band, nearSide, trunkY, stubX, spanTop, spanBottom } = input
  const busEnd = { x: stubX, y: trunkY }

  if (band === "center") {
    const anchor = { x: nearSide, y: trunkY }

    return { anchor, points: simplify([anchor, busEnd]) }
  }

  const corner = band === "above" ? spanTop : spanBottom
  const anchor = { x: nearSide, y: corner }

  return { anchor, points: simplify([anchor, { x: nearSide, y: trunkY }, busEnd]) }
}

/** Members per group, in first-seen order, so the trunks read in the badges' order. */
function groupInOrder(placements: TokenBadgePlacement[]): Map<string, TokenBadgePlacement[]> {
  const groups = new Map<string, TokenBadgePlacement[]>()

  for (const placement of placements) {
    const members = groups.get(placement.group)

    if (members) {
      members.push(placement)
      continue
    }

    groups.set(placement.group, [placement])
  }

  return groups
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max))
}
