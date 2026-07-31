import { ComponentLevel, getComponentSchema, isComponentId } from "@seldon/core"
import { getRenderedScale } from "../dom/canvas-elements"
import {
  EXPLODE_DEPTH_ATTRIBUTE,
  EXPLODE_LAYER_GAP_PX,
  EXPLODE_MAX_DEPTH,
} from "./exploded-constants"

/** Attributes the canvas reads to find a node, which only the original may carry. */
const IDENTIFYING_ATTRIBUTES = [
  "data-canvas-node-id",
  "data-canvas-selection-id",
  "data-selection-id",
  "data-selection-kind",
  "data-selection-root-id",
  "data-component-id",
  "data-board-id",
  "id",
]

/** The attribute the walk reads before a copy gives it up. */
const NODE_ATTRIBUTE = "data-canvas-node-id"

/** Tells the walk which component a node renders, so it can read its level. */
const COMPONENT_ATTRIBUTE = "data-component-id"

/**
 * A node in the rendered variant, with where it sits and how deep it is. Position
 * and size are both the border box in layout pixels, so the copy is placed and
 * sized by the same box it was measured from.
 */
interface MeasuredNode {
  element: Element
  depth: number
  left: number
  top: number
  width: number
  height: number
}

/**
 * Copies a rendered variant into a stack of surfaces, one per level of the tree.
 *
 * A level's surface spans the whole variant and carries every node at that level,
 * each placed where it was laid out and holding nothing but its own paint. The
 * nodes inside it move to the next surface down the tree, so the variant reads as
 * parallel sheets pulled apart rather than boxes sitting inside boxes. At rest
 * angles and a gap of zero the stack matches the variant exactly.
 *
 * Primitives are the exception. A primitive is the paint at the end of a branch
 * rather than a level of composition, so it stays on the surface of the component
 * holding it instead of taking one of its own.
 *
 * A node that moves to the surface below leaves its space behind. The content that
 * stays was laid out around it, so taking it out would let that content reflow into
 * the gap and land somewhere the variant never put it.
 *
 * The copies keep their `node-*` classes, so the stylesheets the canvas already
 * injected paint them and this adds no styling beyond placement. Stripped of the
 * attributes the canvas reads, they stay invisible to selection, hit tests,
 * tracking, connectors, and the gallery's measuring pass, which is what makes the
 * view presentation only.
 *
 * Positions are read in one pass before anything is built, so the copy costs a
 * single layout flush.
 */
export function buildExplodedLayers(source: HTMLElement): HTMLElement {
  const board = source.closest<HTMLElement>("[data-board-id]")
  // Read the zoom off the board rather than a node, so a node's own turn does not
  // enter into it.
  const scale = board ? getRenderedScale(board) : 1
  const measured = measureNodes(source, scale)
  const sizes = new Map(measured.map((node) => [node.element, node]))
  const width = source.offsetWidth
  const height = source.offsetHeight

  const container = document.createElement("div")

  container.style.position = "relative"
  container.style.width = `${width}px`
  container.style.height = `${height}px`
  container.style.transformStyle = "preserve-3d"
  container.style.pointerEvents = "none"
  container.setAttribute("aria-hidden", "true")
  container.setAttribute("inert", "")

  const surfaces = new Map<number, HTMLElement>()

  for (const node of measured) {
    // Levels past the deepest surface share it, so a deep tree stays readable and
    // the stack cannot run away from the viewer.
    const depth = Math.min(node.depth, EXPLODE_MAX_DEPTH)
    let surface = surfaces.get(depth)

    if (!surface) {
      surface = buildSurface(depth)
      surfaces.set(depth, surface)
    }

    surface.appendChild(buildNodePaint(node, sizes))
  }

  const ordered = Array.from(surfaces.entries()).sort(([left], [right]) => left - right)

  for (const [, surface] of ordered) {
    container.appendChild(surface)
  }

  return container
}

/** One level of the tree, spanning the variant and pushed along z by its depth. */
function buildSurface(depth: number): HTMLElement {
  const surface = document.createElement("div")

  surface.setAttribute(EXPLODE_DEPTH_ATTRIBUTE, String(depth))
  surface.style.position = "absolute"
  surface.style.inset = "0"
  surface.style.setProperty("translate", `0 0 ${depth * EXPLODE_LAYER_GAP_PX}px`)

  return surface
}

/** A node's own paint, placed on its surface where the variant laid it out. */
function buildNodePaint(node: MeasuredNode, sizes: Map<Element, MeasuredNode>): Element {
  const paint = node.element.cloneNode(true) as Element

  // The nodes inside it belong to the surface below, so each one is emptied and
  // hidden where it stands instead of being taken out. Baked-in primitives are not
  // among them and stay as they are. The copy holds the same structure in the same
  // order as the node it came from, so the two walks line up and each copy can be
  // sized from what it stood in for. This runs before stripping, because both
  // walks read the attributes the copy then gives up.
  const copies = findChildNodes(paint)
  const originals = findChildNodes(node.element)

  copies.forEach((copy, index) => {
    const original = originals[index]

    holdSpace(copy, original ? sizes.get(original) : undefined)
  })

  for (const attribute of IDENTIFYING_ATTRIBUTES) {
    paint.removeAttribute(attribute)
    paint.querySelectorAll(`[${attribute}]`).forEach((inner) => inner.removeAttribute(attribute))
  }

  const style = (paint as HTMLElement).style

  // Placed and sized by its border box, the same box it was measured from, so its
  // own padding leaves it the content box the node was laid out with.
  style.position = "absolute"
  style.boxSizing = "border-box"
  style.margin = "0"
  style.left = `${node.left}px`
  style.top = `${node.top}px`
  style.width = `${node.width}px`
  style.height = `${node.height}px`

  return paint
}

/**
 * Turns a copied node into empty space the size of what it stood in for.
 *
 * It keeps its own class, so the margins and the flex or grid behavior that placed
 * it still apply, and its size is pinned because the content that used to give it
 * one has gone to the surface below. Hidden rather than removed, so the content
 * beside it stays where the variant laid it out.
 */
function holdSpace(element: Element, measured: MeasuredNode | undefined): void {
  element.replaceChildren()

  const style = (element as HTMLElement).style

  style.visibility = "hidden"

  if (!measured) return

  style.boxSizing = "border-box"
  style.width = `${measured.width}px`
  style.height = `${measured.height}px`
}

function measureNodes(source: HTMLElement, scale: number): MeasuredNode[] {
  const origin = source.getBoundingClientRect()
  const found: { element: Element; depth: number }[] = []

  collectNodes(source, 0, found)

  return found.map(({ element, depth }) => measureNode(element, depth, origin, scale))
}

/**
 * Where a node sits and how big it is, both as its border box in layout pixels.
 *
 * The rendered rect is used rather than `offsetWidth`, which rounds to whole
 * pixels: shaving part of a pixel off a box that fits its text exactly is enough to
 * make that text ellipsize.
 *
 * A node that turns itself through the `rotation` property is the exception, since
 * its rect is the box its turn sweeps out rather than the box it occupies. Its own
 * box is read from layout instead and centred in the rect, which is where a turn
 * about the centre leaves it.
 */
function measureNode(
  element: Element,
  depth: number,
  origin: DOMRect,
  scale: number,
): MeasuredNode {
  const rect = element.getBoundingClientRect()
  const turned = getTurnedSize(element)

  if (turned) {
    return {
      element,
      depth,
      left: (rect.left + rect.width / 2 - origin.left) / scale - turned.width / 2,
      top: (rect.top + rect.height / 2 - origin.top) / scale - turned.height / 2,
      width: turned.width,
      height: turned.height,
    }
  }

  return {
    element,
    depth,
    left: (rect.left - origin.left) / scale,
    top: (rect.top - origin.top) / scale,
    width: rect.width / scale,
    height: rect.height / scale,
  }
}

/** Layout box of a node that turns itself, or nothing when it does not. */
function getTurnedSize(element: Element): { width: number; height: number } | null {
  if (!(element instanceof HTMLElement)) return null
  if (getComputedStyle(element).transform === "none") return null

  return { width: element.offsetWidth, height: element.offsetHeight }
}

function collectNodes(
  element: Element,
  depth: number,
  found: { element: Element; depth: number }[],
): void {
  found.push({ element, depth })

  for (const child of findChildNodes(element)) {
    collectNodes(child, depth + 1, found)
  }
}

/**
 * Nearest nodes inside this one that take a surface of their own. The walk passes
 * through the elements a component renders around its children and stops at the
 * next node, so depth counts nodes rather than DOM levels. A primitive is passed
 * through as paint, which leaves it and anything it renders where they are.
 */
function findChildNodes(element: Element): Element[] {
  const nodes: Element[] = []

  for (const child of Array.from(element.children)) {
    if (child.hasAttribute(NODE_ATTRIBUTE) && !isPrimitive(child)) {
      nodes.push(child)

      continue
    }

    nodes.push(...findChildNodes(child))
  }

  return nodes
}

function isPrimitive(element: Element): boolean {
  const componentId = element.getAttribute(COMPONENT_ATTRIBUTE)

  if (!componentId || !isComponentId(componentId)) return false

  return getComponentSchema(componentId).level === ComponentLevel.PRIMITIVE
}
