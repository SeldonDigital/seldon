import type { ExportOptions, FileToExport } from "../../types"

/**
 * Generates utility files needed by the exported components
 * This includes the class name utilities that components import
 *
 * @param options - Export options to determine output paths
 * @returns Array of utility files to export
 */
export function getUtilityFileContents(options: ExportOptions): FileToExport[] {
  const utilityFiles: FileToExport[] = []

  // Generate the class-name file
  const classNameUtilsContent = `/**
 * Combines any number of className sources while removing duplicates.
 *
 * @param names - The className sources, in order of increasing precedence
 * @returns A clean, deduplicated className string
 *
 * @example
 * \`\`\`ts
 * combineClassNames("btn primary", "primary large") // "btn primary large"
 * combineClassNames("btn", undefined) // "btn"
 * combineClassNames("btn", null, "large") // "btn large"
 * \`\`\`
 */
export function combineClassNames(...names: Array<string | null | undefined>): string {
  const classes = names.flatMap((name) => (name ? name.split(' ') : [])).filter(Boolean)

  return Array.from(new Set(classes)).join(' ')
}
`

  utilityFiles.push({
    path: `${options.output.componentsFolder}/utils/class-name.ts`,
    content: classNameUtilsContent,
  })

  // Generate the slot-merge file. Every generated component layers its slot props
  // through these helpers: the baked \`sdn\` default, then the caller's prop, then
  // the caller's ref-keyed override. Returning null when a slot must not render
  // lets every generated guard be a single \`!== null\` check.
  const mergeSlotUtilsContent = `import { combineClassNames } from "./class-name"

/** Map of \`data-seldon-ref\` name to override props. */
export type SeldonRefs = Record<string, Record<string, unknown>>

function readString(source: object | null | undefined, key: string) {
  const value = (source as Record<string, unknown> | null | undefined)?.[key]

  return typeof value === "string" ? value : undefined
}

/**
 * Resolves the override a caller addressed to this slot by its baked
 * \`data-seldon-ref\` name. The ref rides on the slot's defaults, so a view model
 * can drive a slot by a stable name instead of a positional prop.
 */
function readRefOverride(base: object | null | undefined, refs: SeldonRefs | undefined) {
  const name = readString(base, "data-seldon-ref")

  if (name === undefined) return undefined

  return refs?.[name]
}

function layer<T extends object>(
  base: T | null | undefined,
  override: T | null | undefined,
  refOverride: Record<string, unknown> | undefined,
): T {
  const merged: Record<string, unknown> = {
    ...base,
    ...override,
    ...refOverride,
  }

  const className = combineClassNames(
    readString(base, "className"),
    readString(override, "className"),
    readString(refOverride, "className"),
  )

  if (className) merged["className"] = className

  return merged as T
}

/**
 * Layers a caller's slot props over the slot's baked defaults, then applies the
 * matching \`seldonRefs\` override last. Class names from all three sources are
 * combined so generated styles survive.
 *
 * Returns \`null\` when the caller passes \`null\`, which suppresses the slot.
 *
 * @param base - The slot's baked default props from \`sdn\`
 * @param override - The caller's props for this slot
 * @param refs - The caller's ref-keyed overrides
 */
export function mergeSlot<T extends object>(
  base: T | null | undefined,
  override: T | null | undefined,
  refs?: SeldonRefs,
): T | null {
  if (override === null) return null

  return layer(base, override, readRefOverride(base, refs))
}

/**
 * The opt-in form of \`mergeSlot\`, for a slot the component does not render by
 * default. It stays hidden until a caller opts it in, either by passing props
 * for the slot or by addressing it through a matching \`seldonRefs\` entry. A
 * caller that passes \`null\` suppresses the slot even when a ref exists.
 *
 * @param base - The slot's baked default props from \`sdn\`
 * @param override - The caller's props for this slot
 * @param refs - The caller's ref-keyed overrides
 */
export function mergeOptionalSlot<T extends object>(
  base: T | null | undefined,
  override: T | null | undefined,
  refs?: SeldonRefs,
): T | null {
  const refOverride = readRefOverride(base, refs)

  if (override === null) return null
  if (override === undefined && refOverride === undefined) return null

  return layer(base, override, refOverride)
}
`

  utilityFiles.push({
    path: `${options.output.componentsFolder}/utils/merge-slot.ts`,
    content: mergeSlotUtilsContent,
  })

  // Generate the icon-registry file. The generated `Icon` renders static catalog
  // ids from its `iconMap`. A consumer can register extra ids at runtime that map
  // to arbitrary React components (dynamic, prop-driven icons the factory cannot
  // emit as static SVGs). `Icon` consults this registry for any id absent from
  // `iconMap` before falling back to the default icon.
  const iconRegistryUtilsContent = `import type { ComponentType } from "react"

/** Props any registered icon may receive; the generated \`Icon\` spreads its own props through. */
export type RegisteredIconProps = Record<string, unknown>

const registry = new Map<string, ComponentType<RegisteredIconProps>>()

/**
 * Registers a React component under an icon id. Call this at startup for each
 * dynamic icon the generated \`Icon\` should render but that has no catalog SVG.
 */
export function registerIcon(
  id: string,
  component: ComponentType<RegisteredIconProps>,
): void {
  registry.set(id, component)
}

/** Returns the component registered for an icon id, or undefined when none is. */
export function getRegisteredIcon(
  id: string | undefined,
): ComponentType<RegisteredIconProps> | undefined {
  if (!id) return undefined
  return registry.get(id)
}
`

  utilityFiles.push({
    path: `${options.output.componentsFolder}/utils/icon-registry.ts`,
    content: iconRegistryUtilsContent,
  })

  // Generate the resize file. These framework-agnostic helpers let any component
  // whose root is a positioned box (relative, absolute, or fixed) that owns its
  // own width and height expose drag-to-resize handles. The helpers compute grip
  // styles and the next rect and wire native pointer events; the host decides how
  // to store the size (state, CSS variables, or animation library motion values).
  const resizeUtilsContent = `import type { CSSProperties } from "react"

/** The eight edges and corners a resizable surface can expose. */
export type ResizeSide =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"

/** All resize sides, edges first then corners. */
export const RESIZE_SIDES: readonly ResizeSide[] = [
  "top",
  "right",
  "bottom",
  "left",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
]

/** Position and size of a surface, in pixels. */
export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

/** Minimal pointer shape shared by DOM and React pointer events. */
interface PointerLike {
  clientX: number
  clientY: number
  preventDefault(): void
}

const HANDLE_THICKNESS = "0.5rem"

/**
 * Returns the absolute-position style for a single resize handle. Edge handles
 * are inset by the handle thickness so the corners stay free for the corner
 * handles. The host element must be positioned (relative, absolute, or fixed)
 * for these handles to anchor to it.
 */
export function getResizeHandleStyle(
  side: ResizeSide,
  thickness: string = HANDLE_THICKNESS,
): CSSProperties {
  const style: CSSProperties = { position: "absolute", touchAction: "none" }

  if (side.includes("bottom")) {
    style.bottom = 0
    style.height = thickness
  }
  if (side.includes("top")) {
    style.top = 0
    style.height = thickness
  }
  if (side.includes("left")) {
    style.left = 0
    style.width = thickness
  }
  if (side.includes("right")) {
    style.right = 0
    style.width = thickness
  }

  switch (side) {
    case "top":
    case "bottom":
      style.left = thickness
      style.right = thickness
      style.cursor = "ns-resize"
      break
    case "left":
    case "right":
      style.top = thickness
      style.bottom = thickness
      style.cursor = "ew-resize"
      break
    case "top-left":
    case "bottom-right":
      style.cursor = "nwse-resize"
      break
    case "top-right":
    case "bottom-left":
      style.cursor = "nesw-resize"
      break
  }

  return style
}

/**
 * Computes the next rect for a resize drag. Width and height are clamped to the
 * given minimums; when a left or top edge is dragged the opposite edge stays
 * fixed, so clamping shifts x or y instead of overshooting the minimum.
 */
export function computeResizedRect(args: {
  side: ResizeSide
  startRect: Rect
  offsetX: number
  offsetY: number
  minWidth?: number
  minHeight?: number
}): Rect {
  const { side, startRect, offsetX, offsetY } = args
  const minWidth = args.minWidth ?? 0
  const minHeight = args.minHeight ?? 0

  let { x, y, width, height } = startRect

  if (side.includes("right")) {
    width = Math.max(minWidth, startRect.width + offsetX)
  }
  if (side.includes("left")) {
    width = Math.max(minWidth, startRect.width - offsetX)
    x = startRect.x + startRect.width - width
  }
  if (side.includes("bottom")) {
    height = Math.max(minHeight, startRect.height + offsetY)
  }
  if (side.includes("top")) {
    height = Math.max(minHeight, startRect.height - offsetY)
    y = startRect.y + startRect.height - height
  }

  return { x, y, width, height }
}

/**
 * Wires a resize handle with native pointer events, so no animation library is
 * required. Attach the returned onPointerDown to a handle element styled by
 * {@link getResizeHandleStyle}. On each pointer move the handle reads the start
 * rect from getRect, computes the next rect, and hands it to onResize; the host
 * stores the size however it likes.
 */
export function createResizeHandle(args: {
  side: ResizeSide
  getRect: () => Rect
  onResize: (rect: Rect) => void
  minWidth?: number
  minHeight?: number
  onStart?: () => void
  onEnd?: () => void
}): { onPointerDown: (event: PointerLike) => void } {
  function onPointerDown(event: PointerLike) {
    event.preventDefault()
    const startRect = args.getRect()
    const originX = event.clientX
    const originY = event.clientY
    args.onStart?.()

    function handleMove(moveEvent: PointerEvent) {
      const next = computeResizedRect({
        side: args.side,
        startRect,
        offsetX: moveEvent.clientX - originX,
        offsetY: moveEvent.clientY - originY,
        minWidth: args.minWidth,
        minHeight: args.minHeight,
      })
      args.onResize(next)
    }

    function handleUp() {
      window.removeEventListener("pointermove", handleMove)
      window.removeEventListener("pointerup", handleUp)
      args.onEnd?.()
    }

    window.addEventListener("pointermove", handleMove)
    window.addEventListener("pointerup", handleUp)
  }

  return { onPointerDown }
}
`

  utilityFiles.push({
    path: `${options.output.componentsFolder}/utils/resize.ts`,
    content: resizeUtilsContent,
  })

  return utilityFiles
}
