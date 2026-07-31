import { ComponentLevel, getComponentSchema, isComponentId } from "@seldon/core"
import { getRenderedScale } from "../dom/canvas-elements"
import {
  EXPLODE_CLIP_OUTSET_PX,
  EXPLODE_SURFACE_ATTRIBUTE,
  EXPLODE_SURFACE_GAP_PX,
  EXPLODE_SURFACE_LEVELS,
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
 * Bounds a node is held inside by whatever clips or scrolls above it. A side no
 * ancestor bounds sits at infinity, since an axis they leave visible has no bound.
 *
 * The walk reads these in client pixels and `measureNode` converts them to the same
 * layout pixels and origin as a node's position.
 */
interface Clip {
  left: number
  top: number
  right: number
  bottom: number
}

const NO_CLIP: Clip = {
  left: -Infinity,
  top: -Infinity,
  right: Infinity,
  bottom: Infinity,
}

/**
 * A node in the rendered variant, with the surface it belongs on, where it sits, and
 * what it is clipped to. Position and size are both the border box in layout pixels,
 * so the copy is placed and sized by the same box it was measured from.
 *
 * `surface` indexes `EXPLODE_SURFACE_LEVELS`, not the plane the node ends up on.
 * Only the levels a variant actually uses get a plane.
 */
interface MeasuredNode {
  element: Element
  surface: number
  left: number
  top: number
  width: number
  height: number
  clip: Clip
}

/**
 * Copies a rendered variant into a flat stack of surfaces, one per component level.
 *
 * A level's surface spans the whole variant and carries a copy of every node at that
 * level, each placed where it was laid out and holding nothing of the nodes inside it.
 * Nesting does not deepen the stack: a part inside a part shares the part surface, so
 * the variant reads as the levels it is built from rather than as boxes inside boxes.
 * At rest angles and a gap of zero the stack matches the variant exactly.
 *
 * A node that moves to another surface leaves its space behind. The content that
 * stays was laid out around it, so taking it out would let that content reflow into
 * the gap and land somewhere the variant never put it.
 *
 * It also leaves behind whatever clipped it. A copy hangs off a surface spanning the
 * whole variant, so the scrolling panel or clipping frame it used to sit inside can no
 * longer hold it in, and content the variant keeps out of sight would paint in full
 * across the planes around it. Each copy carries that clip itself instead, and a node
 * scrolled fully out of sight is left out along with everything inside it.
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
export function buildExplodedSurfaces(source: HTMLElement): HTMLElement {
  const board = source.closest<HTMLElement>("[data-board-id]")
  // Read the zoom off the board rather than a node, so a node's own turn does not
  // enter into it.
  const scale = board ? getRenderedScale(board) : 1
  const measured = measureNodes(source, scale)
  // Every node is kept for sizing, so a node that is out of sight still holds the
  // space it held in the variant, but only the ones in sight are copied.
  const sizes = new Map(measured.map((node) => [node.element, node]))
  const visible = measured.filter((node) => !isClipEmpty(node.clip))
  const planes = getPlanes(visible)
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

  for (const node of visible) {
    const plane = planes.get(node.surface) ?? 0
    let surface = surfaces.get(plane)

    if (!surface) {
      surface = buildSurface(plane)
      surfaces.set(plane, surface)
    }

    surface.appendChild(buildNodeCopy(node, sizes))
  }

  const ordered = Array.from(surfaces.entries()).sort(([left], [right]) => left - right)

  for (const [, surface] of ordered) {
    container.appendChild(surface)
  }

  return container
}

/**
 * Which plane of the stack each level in use lands on, keeping level order and
 * closing the gaps left by the levels a variant does not use.
 *
 * A variant isolated at part level starts at parts, and its backmost surface should
 * sit at the back of the stack rather than leaving the planes above it as empty
 * space in front of the viewer.
 */
function getPlanes(nodes: MeasuredNode[]): Map<number, number> {
  const used = Array.from(new Set(nodes.map((node) => node.surface))).sort(
    (left, right) => left - right,
  )

  return new Map(used.map((surface, plane) => [surface, plane]))
}

/** One component level, spanning the variant and pushed along z by its plane. */
function buildSurface(plane: number): HTMLElement {
  const surface = document.createElement("div")

  surface.setAttribute(EXPLODE_SURFACE_ATTRIBUTE, String(plane))
  surface.style.position = "absolute"
  surface.style.inset = "0"
  surface.style.setProperty("translate", `0 0 ${plane * EXPLODE_SURFACE_GAP_PX}px`)

  return surface
}

/** A copy of one node alone, placed on its surface where the variant laid it out. */
function buildNodeCopy(node: MeasuredNode, sizes: Map<Element, MeasuredNode>): Element {
  const copy = node.element.cloneNode(true) as Element

  // The nodes inside it are carried by their own surface, so each one is emptied and
  // hidden where it stands instead of being taken out. Baked-in primitives are not
  // among them and stay as they are. The copy holds the same structure in the same
  // order as the node it came from, so the two walks line up and each one can be
  // sized from what it stood in for. This runs before stripping, because both
  // walks read the attributes the copy then gives up.
  const inside = findChildNodes(copy)
  const originals = findChildNodes(node.element)

  inside.forEach((child, index) => {
    const original = originals[index]

    holdSpace(child, original ? sizes.get(original) : undefined)
  })

  for (const attribute of IDENTIFYING_ATTRIBUTES) {
    copy.removeAttribute(attribute)
    copy.querySelectorAll(`[${attribute}]`).forEach((inner) => inner.removeAttribute(attribute))
  }

  const style = (copy as HTMLElement).style
  const clipPath = getClipPath(node)

  // Placed and sized by its border box, the same box it was measured from, so its
  // own padding leaves it the content box the node was laid out with.
  style.position = "absolute"
  style.boxSizing = "border-box"
  style.margin = "0"
  style.left = `${node.left}px`
  style.top = `${node.top}px`
  style.width = `${node.width}px`
  style.height = `${node.height}px`

  if (clipPath) style.clipPath = clipPath

  return copy
}

/**
 * The clip a copy carries in place of the ancestors that used to hold it, in its own
 * coordinates, or nothing when no ancestor bounded it.
 *
 * A side nothing bounds is pushed clear of the copy rather than left at its edge, so a
 * shadow or anything else a node draws outside its box still shows. That is also why
 * this is a polygon: a clip path takes no negative inset.
 *
 * The clip is rectangular, so a rounded ancestor clips square at its corners, and for
 * a node the `rotation` property turns it is applied before that turn.
 */
function getClipPath(node: MeasuredNode): string | null {
  const { clip } = node

  if (isClipUnbounded(clip)) return null

  const left = clip.left === -Infinity ? -EXPLODE_CLIP_OUTSET_PX : clip.left - node.left
  const top = clip.top === -Infinity ? -EXPLODE_CLIP_OUTSET_PX : clip.top - node.top
  const right =
    clip.right === Infinity ? node.width + EXPLODE_CLIP_OUTSET_PX : clip.right - node.left
  const bottom =
    clip.bottom === Infinity ? node.height + EXPLODE_CLIP_OUTSET_PX : clip.bottom - node.top

  return `polygon(${left}px ${top}px, ${right}px ${top}px, ${right}px ${bottom}px, ${left}px ${bottom}px)`
}

/**
 * Turns a copied node into empty space the size of what it stood in for.
 *
 * It keeps its own class, so the margins and the flex or grid behavior that placed
 * it still apply, and its size is pinned because the content that used to give it
 * one has gone to another surface. Hidden rather than removed, so the content beside
 * it stays where the variant laid it out.
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
  const found: CollectedNode[] = []

  collectNodes(source, getSurface(source, 0), NO_CLIP, found)

  return found.map((node) => measureNode(node, origin, scale))
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
  { element, surface, clip }: CollectedNode,
  origin: DOMRect,
  scale: number,
): MeasuredNode {
  const rect = element.getBoundingClientRect()
  const turned = getTurnedSize(element)
  const placed = {
    element,
    surface,
    clip: {
      left: (clip.left - origin.left) / scale,
      top: (clip.top - origin.top) / scale,
      right: (clip.right - origin.left) / scale,
      bottom: (clip.bottom - origin.top) / scale,
    },
  }

  if (turned) {
    return {
      ...placed,
      left: (rect.left + rect.width / 2 - origin.left) / scale - turned.width / 2,
      top: (rect.top + rect.height / 2 - origin.top) / scale - turned.height / 2,
      width: turned.width,
      height: turned.height,
    }
  }

  return {
    ...placed,
    left: (rect.left - origin.left) / scale,
    top: (rect.top - origin.top) / scale,
    width: rect.width / scale,
    height: rect.height / scale,
  }
}

interface NodeSize {
  width: number
  height: number
}

/** Layout box of a node that turns itself, or nothing when it does not. */
function getTurnedSize(element: Element): NodeSize | null {
  if (!(element instanceof HTMLElement)) return null
  if (getComputedStyle(element).transform === "none") return null

  return { width: element.offsetWidth, height: element.offsetHeight }
}

interface CollectedNode {
  element: Element
  surface: number
  clip: Clip
}

function collectNodes(element: Element, surface: number, clip: Clip, found: CollectedNode[]): void {
  found.push({ element, surface, clip })

  // Nothing of it is in sight, so nothing inside it can be either. It is still
  // collected, since the space it held is what keeps the content beside it in place.
  if (isClipEmpty(clip)) return

  for (const child of findChildNodes(element)) {
    collectNodes(child, getSurface(child, surface), getChildClip(child, element, clip), found)
  }
}

/**
 * What a child node is held inside, given what the node holding it is held inside.
 *
 * The walk covers everything from the child up to that node, since the elements a
 * component renders around its children clip just as the node itself does. Passing the
 * clip down the tree this way costs each node one short walk rather than a walk over
 * all of its ancestors.
 *
 * A node the `placement` property takes out of flow is clipped here like any other,
 * even where its containing block would have let it escape an ancestor.
 */
function getChildClip(child: Element, parent: Element, inherited: Clip): Clip {
  let clip = inherited
  let current = child.parentElement

  while (current) {
    const box = getClipBox(current)

    if (box) clip = intersectClips(clip, box)
    if (current === parent) break

    current = current.parentElement
  }

  return clip
}

/**
 * The box an element holds its content inside, or nothing when it clips neither axis.
 *
 * Overflow is clipped at the padding box, so the border comes off the rect, and each
 * axis is read on its own: a node that scrolls one way and clips the other bounds both,
 * while one left visible on an axis bounds neither side of it.
 */
function getClipBox(element: Element): Clip | null {
  if (!(element instanceof HTMLElement)) return null

  const style = getComputedStyle(element)
  const clipsX = style.overflowX !== "visible"
  const clipsY = style.overflowY !== "visible"

  if (!clipsX && !clipsY) return null

  const rect = element.getBoundingClientRect()

  return {
    left: clipsX ? rect.left + parseFloat(style.borderLeftWidth) : -Infinity,
    top: clipsY ? rect.top + parseFloat(style.borderTopWidth) : -Infinity,
    right: clipsX ? rect.right - parseFloat(style.borderRightWidth) : Infinity,
    bottom: clipsY ? rect.bottom - parseFloat(style.borderBottomWidth) : Infinity,
  }
}

function intersectClips(clip: Clip, other: Clip): Clip {
  return {
    left: Math.max(clip.left, other.left),
    top: Math.max(clip.top, other.top),
    right: Math.min(clip.right, other.right),
    bottom: Math.min(clip.bottom, other.bottom),
  }
}

/** Nothing is left of the clip, so a node inside it is out of sight in the variant. */
function isClipEmpty(clip: Clip): boolean {
  return clip.right <= clip.left || clip.bottom <= clip.top
}

function isClipUnbounded(clip: Clip): boolean {
  return (
    clip.left === -Infinity &&
    clip.top === -Infinity &&
    clip.right === Infinity &&
    clip.bottom === Infinity
  )
}

/**
 * Which surface a node belongs on, given the surface of the node holding it.
 *
 * A node goes to the surface for its own level, so the stack stays the flat set of
 * levels however the variant nests. A frame has no level of composition and takes
 * the surface it was reached from, which is where its siblings are.
 */
function getSurface(element: Element, parent: number): number {
  const level = getLevel(element)

  if (!level) return parent

  const surface = EXPLODE_SURFACE_LEVELS.indexOf(level)

  return surface === -1 ? parent : surface
}

/**
 * Nearest nodes inside this one that take a surface of their own. The walk passes
 * through the elements a component renders around its children and stops at the next
 * node. A primitive is passed through, which leaves it and anything it renders on the
 * surface of the component holding it.
 */
function findChildNodes(element: Element): Element[] {
  const nodes: Element[] = []

  for (const child of Array.from(element.children)) {
    if (child.hasAttribute(NODE_ATTRIBUTE) && getLevel(child) !== ComponentLevel.PRIMITIVE) {
      nodes.push(child)

      continue
    }

    nodes.push(...findChildNodes(child))
  }

  return nodes
}

/** Level of the component a node renders, or nothing when it renders no component. */
function getLevel(element: Element): ComponentLevel | null {
  const componentId = element.getAttribute(COMPONENT_ATTRIBUTE)

  if (!componentId || !isComponentId(componentId)) return null

  return getComponentSchema(componentId).level
}
