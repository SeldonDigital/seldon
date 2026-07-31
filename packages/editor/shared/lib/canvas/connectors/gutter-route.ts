import { simplify } from "./connector-layout"

import type { NodeRect } from "../overlay/geometry"
import type { GalleryObstacles, GalleryRow } from "../overlay/measure-isolation-gallery"
import type { ConnectorPoint } from "./connector-layout"

/**
 * How much room two rows must leave in common before their gutters count as one
 * lane. Any less and a line down that lane would hug a board's edge, so the rows
 * keep their own lanes and a route takes a full step between them.
 */
const MIN_SHARED_GUTTER_PX = 10

/**
 * How far off a node's center a route meets it, as a share of the node's height. A
 * quarter of the height is the midpoint between the center and the edge.
 */
const ANCHOR_OFFSET_SHARE = 0.25

/** Where the route leaves and lands on the source and target nodes, on their left or right edges. */
export interface GutterRoute {
  anchor: ConnectorPoint
  endAnchor: ConnectorPoint
  points: ConnectorPoint[]
}

/**
 * The lines every route in the gallery travels on, resolved once for all of them.
 *
 * Lanes run vertically beside boards and corridors run horizontally between rows.
 * Both are shared, so two routes down the same channel are drawn on the very same
 * line instead of a few pixels apart, which is the only way two lines can pass
 * through a gutter narrower than they could be read apart in.
 */
export interface GutterLattice {
  rows: LatticeRow[]
  corridors: number[]
}

/** The lane at each cell edge: `lanes[cell]` runs left of a cell, `lanes[cell + 1]` right. */
export interface LatticeRow {
  cells: NodeRect[]
  lanes: number[]
}

/** The free span beside a board, before it is shared into a lane. */
interface Gutter {
  start: number
  end: number
}

/** Which row and cell of the gallery a rect sits in. */
interface Placement {
  row: number
  cell: number
}

type CellSide = "left" | "right"

/** The lane a route uses to leave or reach a board, and the side it is on. */
interface CellExit {
  laneX: number
  side: CellSide
}

/**
 * Resolves the gallery into the lanes and corridors routes may travel on.
 *
 * A row offers one gutter at each of its cell edges. Gutters in different rows
 * that overlap are the same channel seen from different rows, even though their
 * boards end at different places, so they resolve to one lane placed in the part
 * they share. That is what keeps a route from stepping sideways between two rows,
 * and what keeps two routes from drawing a few pixels apart.
 */
export function buildGutterLattice({ rows, sheet }: GalleryObstacles): GutterLattice {
  const columns: Gutter[] = []
  const columnByGutter = rows.map((row) =>
    getRowGutters(row, sheet).map((gutter) => {
      const index = columns.findIndex((column) => getOverlap(column, gutter))

      if (index < 0) {
        columns.push(gutter)

        return columns.length - 1
      }

      columns[index] = getOverlap(columns[index], gutter) ?? columns[index]

      return index
    }),
  )

  const corridors = rows.map((_, index) => getCorridorY(rows, sheet, index))

  corridors.push(getCorridorY(rows, sheet, rows.length))

  return {
    rows: rows.map((row, index) => ({
      cells: row.cells,
      lanes: columnByGutter[index].map((column) => getCenter(columns[column])),
    })),
    corridors,
  }
}

/**
 * An orthogonal route from one node to another along the gallery's lanes.
 *
 * A board is left and reached from its left or right edge, never over its top or
 * bottom, so a line never runs down through a board's content. The route steps
 * sideways out of the source into the lane beside its board, travels the lanes and
 * corridors, and steps back in beside the target. Two nodes on one board are
 * joined the same way, out into the lane and back, rather than across the board.
 *
 * Every row along the way offers the lane nearest the one the target is reached
 * from, and rows sharing a lane are run through on a single line.
 */
export function buildGutterRoute(
  source: NodeRect,
  target: NodeRect,
  lattice: GutterLattice,
): GutterRoute {
  const { rows } = lattice
  const from = findPlacement(rows, source)
  const to = findPlacement(rows, target)

  // An unplaced rect has no lattice to route on.
  if (!from || !to) return buildFallbackRoute(source, target)

  // Both on one board: out into the lane beside it, along, and back in the same
  // side. The side follows the source alone, so every route out of one selection
  // leaves by the same lane.
  if (from.row === to.row && from.cell === to.cell) {
    const lane = chooseExit(rows[from.row], from.cell, centerX(source))

    return buildRoute(source, target, lane.side, lane.side, [lane.laneX], [])
  }

  const exit = chooseExit(rows[from.row], from.cell, centerX(target))
  const entry = chooseExit(rows[to.row], to.cell, exit.laneX)
  const step = Math.sign(to.row - from.row)
  const lanes = [exit.laneX]

  for (const band of getBandsBetween(from.row, to.row)) {
    lanes.push(getNearestLane(rows[band], entry.laneX))
  }

  lanes.push(entry.laneX)

  return buildRoute(
    source,
    target,
    exit.side,
    entry.side,
    lanes,
    getStepCorridors(lattice, from.row, step, lanes.length - 1, source, target),
  )
}

/**
 * Threads the points: sideways out of the source, down each lane in turn with a
 * corridor between, then sideways into the target. A step whose two lanes are the
 * same collapses to a straight run.
 */
function buildRoute(
  source: NodeRect,
  target: NodeRect,
  exitSide: CellSide,
  entrySide: CellSide,
  lanes: number[],
  corridors: number[],
): GutterRoute {
  // Ref badge connectors leave a node from its center, so these meet one off center,
  // each end on the side facing the other. Two nodes level with one another both
  // take the upper offset.
  const direction = Math.sign(centerY(target) - centerY(source)) || -1
  const anchor = { x: getSideX(source, exitSide), y: getAnchorY(source, direction) }
  const endAnchor = { x: getSideX(target, entrySide), y: getAnchorY(target, -direction) }
  const points: ConnectorPoint[] = [anchor, { x: lanes[0], y: anchor.y }]

  corridors.forEach((corridor, index) => {
    points.push({ x: lanes[index], y: corridor }, { x: lanes[index + 1], y: corridor })
  })

  points.push({ x: lanes[lanes.length - 1], y: endAnchor.y }, endAnchor)

  return { anchor, endAnchor, points: simplify(points) }
}

/**
 * A route between two nodes with no lattice to travel on, which turns halfway
 * across. It still leaves and lands sideways like every other route.
 */
function buildFallbackRoute(source: NodeRect, target: NodeRect): GutterRoute {
  const side: CellSide = centerX(target) >= centerX(source) ? "right" : "left"
  const middle = (getSideX(source, side) + getSideX(target, flip(side))) / 2

  return buildRoute(source, target, side, flip(side), [middle], [])
}

/**
 * The corridor each step turns in: the one it meets leaving its row, or for two
 * boards in one row, whichever of the two asks for less of a detour.
 */
function getStepCorridors(
  lattice: GutterLattice,
  fromRow: number,
  step: number,
  steps: number,
  source: NodeRect,
  target: NodeRect,
): number[] {
  const { corridors } = lattice

  if (step === 0) {
    const above = corridors[fromRow]
    const below = corridors[fromRow + 1]
    const overCost = centerY(source) - above + (centerY(target) - above)
    const underCost = below - centerY(source) + (below - centerY(target))

    return [overCost <= underCost ? above : below]
  }

  const stepCorridors: number[] = []

  for (let index = 0; index < steps; index++) {
    const row = fromRow + index * step

    stepCorridors.push(step > 0 ? corridors[row + 1] : corridors[row])
  }

  return stepCorridors
}

/**
 * Which side of a board to step out of or into, taken as the side whose lane lies
 * nearer the position the route is headed for or coming from.
 */
function chooseExit(row: LatticeRow, cell: number, towardX: number): CellExit {
  const left = row.lanes[cell]
  const right = row.lanes[cell + 1]

  if (Math.abs(left - towardX) <= Math.abs(right - towardX)) {
    return { laneX: left, side: "left" }
  }

  return { laneX: right, side: "right" }
}

/** The lane of a row lying nearest `preferredX`. */
function getNearestLane(row: LatticeRow, preferredX: number): number {
  return row.lanes.reduce((nearest, lane) =>
    Math.abs(lane - preferredX) < Math.abs(nearest - preferredX) ? lane : nearest,
  )
}

/**
 * The free span at each cell edge of a row. The outer two run through the sheet
 * padding, and a row wider than the sheet has none on its right, so the span there
 * is as wide as the padding the sheet does have.
 */
function getRowGutters(row: GalleryRow, sheet: NodeRect): Gutter[] {
  const { cells } = row

  if (cells.length === 0) return [{ start: sheet.left, end: right(sheet) }]

  const padding = cells[0].left - sheet.left
  const gutters: Gutter[] = [{ start: sheet.left, end: cells[0].left }]

  for (let cell = 0; cell < cells.length - 1; cell++) {
    gutters.push({ start: right(cells[cell]), end: cells[cell + 1].left })
  }

  const last = right(cells[cells.length - 1])

  gutters.push({ start: last, end: right(sheet) > last ? right(sheet) : last + padding })

  return gutters
}

/**
 * What two gutters have in common, or null when it is too little to run a line
 * through. A gutter narrower than the minimum on its own, which is what a zoomed
 * out canvas leaves, is still shared in full rather than given up on.
 */
function getOverlap(a: Gutter, b: Gutter): Gutter | null {
  const start = Math.max(a.start, b.start)
  const end = Math.min(a.end, b.end)
  const needed = Math.min(MIN_SHARED_GUTTER_PX, getWidth(a), getWidth(b))

  if (end - start < needed) return null

  return { start, end }
}

/** The row and cell holding a rect's center, or null when it sits outside them. */
function findPlacement(rows: LatticeRow[], rect: NodeRect): Placement | null {
  const x = centerX(rect)
  const y = centerY(rect)

  for (let row = 0; row < rows.length; row++) {
    const cell = rows[row].cells.findIndex((candidate) => contains(candidate, x, y))

    if (cell >= 0) return { row, cell }
  }

  return null
}

/**
 * The corridor above row `index`, as its center line. An index past the last row
 * reads as the corridor below it, and the outer two run through the sheet padding.
 */
function getCorridorY(rows: GalleryRow[], sheet: NodeRect, index: number): number {
  if (rows.length === 0) return centerY(sheet)

  if (index <= 0) return (sheet.top + rows[0].rect.top) / 2

  if (index >= rows.length) {
    return (bottom(rows[rows.length - 1].rect) + bottom(sheet)) / 2
  }

  return (bottom(rows[index - 1].rect) + rows[index].rect.top) / 2
}

/** The rows lying strictly between two rows, in travel order. */
function getBandsBetween(from: number, to: number): number[] {
  const step = Math.sign(to - from)
  const bands: number[] = []

  if (step === 0) return bands

  for (let row = from + step; row !== to; row += step) bands.push(row)

  return bands
}

function getCenter(gutter: Gutter): number {
  return (gutter.start + gutter.end) / 2
}

function getWidth(gutter: Gutter): number {
  return gutter.end - gutter.start
}

function getSideX(rect: NodeRect, side: CellSide): number {
  return side === "left" ? rect.left : right(rect)
}

function flip(side: CellSide): CellSide {
  return side === "left" ? "right" : "left"
}

function contains(rect: NodeRect, x: number, y: number): boolean {
  return x >= rect.left && x <= right(rect) && y >= rect.top && y <= bottom(rect)
}

function centerX(rect: NodeRect): number {
  return rect.left + rect.width / 2
}

function centerY(rect: NodeRect): number {
  return rect.top + rect.height / 2
}

/**
 * Where a route meets a node vertically: halfway between its center and its top when
 * `direction` is negative, and between its center and its bottom when positive.
 */
function getAnchorY(rect: NodeRect, direction: number): number {
  return centerY(rect) + direction * rect.height * ANCHOR_OFFSET_SHARE
}

function right(rect: NodeRect): number {
  return rect.left + rect.width
}

function bottom(rect: NodeRect): number {
  return rect.top + rect.height
}
