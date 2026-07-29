/**
 * Counts connector crossings for the real layout, so the column order can be checked
 * against the geometry rather than by eye.
 */
import {
  layoutConnectors,
  type ConnectorSource,
} from "../packages/editor/shared/lib/canvas/connectors/connector-layout"

const OPTIONS = {
  canvasWidth: 1024,
  canvasHeight: 665,
  chipWidth: 224,
  chipHeight: 28,
  chipGap: 4,
  margin: 4,
  gutterRight: 20,
}

type Node = { ref: string; left: number; width: number; top: number; height: number }
type Segment = { key: string; x1: number; y1: number; x2: number; y2: number }

const span = (a: number, b: number) => [Math.min(a, b), Math.max(a, b)] as const
const isVertical = (s: Segment) => s.x1 === s.x2

/** A crossing where a horizontal run passes through a vertical one. */
function crosses(a: Segment, b: Segment): boolean {
  if (isVertical(a) === isVertical(b)) return false

  const [v, h] = isVertical(a) ? [a, b] : [b, a]
  const [vTop, vBottom] = span(v.y1, v.y2)
  const [hLeft, hRight] = span(h.x1, h.x2)

  return v.x1 > hLeft && v.x1 < hRight && h.y1 > vTop && h.y1 < vBottom
}

/** Two runs on the same line sharing more than a point. */
function overlaps(a: Segment, b: Segment): boolean {
  if (isVertical(a) !== isVertical(b)) return false

  if (isVertical(a)) {
    if (a.x1 !== b.x1) return false

    const [aTop, aBottom] = span(a.y1, a.y2)
    const [bTop, bBottom] = span(b.y1, b.y2)

    return Math.min(aBottom, bBottom) - Math.max(aTop, bTop) > 0
  }

  if (a.y1 !== b.y1) return false

  const [aLeft, aRight] = span(a.x1, a.x2)
  const [bLeft, bRight] = span(b.x1, b.x2)

  return Math.min(aRight, bRight) - Math.max(aLeft, bLeft) > 0
}

function report(title: string, nodes: Node[]) {
  const sources: ConnectorSource[] = nodes.map((node) => ({
    key: node.ref,
    label: node.ref,
    rect: { top: node.top, left: node.left, width: node.width, height: node.height },
    muted: false,
  }))

  const { placements } = layoutConnectors(sources, OPTIONS)
  const segments: Segment[] = []

  for (const placement of placements) {
    for (let i = 0; i < placement.points.length - 1; i++) {
      const a = placement.points[i]
      const b = placement.points[i + 1]

      segments.push({ key: placement.key, x1: a.x, y1: a.y, x2: b.x, y2: b.y })
    }
  }

  const crossings: string[] = []
  const overlapping: string[] = []

  for (let i = 0; i < segments.length; i++) {
    for (let j = i + 1; j < segments.length; j++) {
      const a = segments[i]
      const b = segments[j]

      if (a.key === b.key) continue
      if (crosses(a, b)) crossings.push(`${a.key} x ${b.key}`)
      if (overlaps(a, b)) overlapping.push(`${a.key} = ${b.key}`)
    }
  }

  const drifts = placements.map((placement) => {
    const node = nodes.find((entry) => entry.ref === placement.label)!

    return Math.abs(placement.chip.centerY - (node.top + node.height / 2))
  })

  const drift = Math.round(drifts.reduce((total, value) => total + value, 0) / drifts.length)

  console.log(`\n${title}`)
  console.log(`  column: ${placements.map((placement) => placement.label).join(", ")}`)
  console.log(`  mean chip distance from its node: ${drift}px`)
  console.log(`  crossings: ${crossings.length}`, crossings.length ? crossings : "")
  console.log(`  collinear overlaps: ${overlapping.length}`, overlapping.length ? overlapping : "")
}

/** The selected property row from the sidebar: one row, seven controls. */
report("one property row", [
  { ref: "propertyDisclosure", left: 88, width: 22, top: 310, height: 40 },
  { ref: "propertyDisclosureIcon", left: 92, width: 14, top: 323, height: 14 },
  { ref: "propertyLabel", left: 120, width: 160, top: 310, height: 40 },
  { ref: "propertyValueIcon", left: 303, width: 14, top: 323, height: 14 },
  { ref: "propertyValueLabel", left: 370, width: 126, top: 310, height: 40 },
  { ref: "propertyValueMenu", left: 552, width: 22, top: 310, height: 40 },
  { ref: "propertyActions", left: 600, width: 22, top: 310, height: 40 },
])

/** The same row with centers off by a fraction, which an exact tie would miss. */
report(
  "one property row, heights jittered under a pixel",
  [
    { ref: "propertyDisclosure", left: 88, width: 22, top: 310, height: 40 },
    { ref: "propertyDisclosureIcon", left: 92, width: 14, top: 322.6, height: 14 },
    { ref: "propertyLabel", left: 120, width: 160, top: 310.4, height: 40 },
    { ref: "propertyValueIcon", left: 303, width: 14, top: 323.3, height: 14 },
    { ref: "propertyValueLabel", left: 370, width: 126, top: 309.7, height: 40 },
    { ref: "propertyValueMenu", left: 552, width: 22, top: 310.2, height: 40 },
    { ref: "propertyActions", left: 600, width: 22, top: 309.9, height: 40 },
  ].map((node) => node),
)

function rows(bands: Array<{ top: number; height: number; centers: number[] }>): Node[] {
  return bands.flatMap((band, index) =>
    band.centers.map((center, column) => ({
      ref: `row${index}col${column}`,
      left: center - 10,
      width: 20,
      top: band.top,
      height: band.height,
    })),
  )
}

report(
  "three rows",
  rows([
    { top: 100, height: 40, centers: [98, 200, 310, 433, 563, 611] },
    { top: 160, height: 40, centers: [98, 250, 500] },
    { top: 220, height: 40, centers: [140, 380, 611] },
  ]),
)

report(
  "rows near the canvas floor",
  rows([
    { top: 560, height: 40, centers: [98, 200, 310, 433, 563, 611] },
    { top: 600, height: 40, centers: [98, 250, 500] },
    { top: 630, height: 30, centers: [140, 380, 611] },
  ]),
)

report(
  "one crowded row",
  rows([{ top: 60, height: 30, centers: Array.from({ length: 18 }, (_, i) => 60 + i * 30) }]),
)

report(
  "rows compressed as if zoomed out",
  rows([
    { top: 100, height: 8, centers: [98, 200, 310, 433, 563, 611] },
    { top: 112, height: 8, centers: [98, 250, 500] },
    { top: 124, height: 8, centers: [140, 380, 611] },
  ]),
)
