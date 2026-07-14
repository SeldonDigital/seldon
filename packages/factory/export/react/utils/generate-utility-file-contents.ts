import { ExportOptions, FileToExport } from "../../types"

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
 * Utility function to combine default and custom classNames while removing duplicates
 * 
 * @param defaultClassName - The base className(s)
 * @param customClassName - Optional additional className(s) to append
 * @returns A clean, deduplicated className string
 * 
 * @example
 * \`\`\`ts
 * combineClassNames("btn primary", "primary large") // "btn primary large"
 * combineClassNames("btn", undefined) // "btn"
 * combineClassNames("btn", "") // "btn"
 * \`\`\`
 */
export function combineClassNames(defaultClassName?: string, customClassName?: string): string {
  if (!defaultClassName) return customClassName || ""
  if (!customClassName) return defaultClassName
  
  const defaultClasses = defaultClassName.split(' ').filter(Boolean)
  const customClasses = customClassName.split(' ').filter(Boolean)
  const allClasses = [...defaultClasses, ...customClasses]
  
  // Remove duplicates using Set
  const uniqueClasses = Array.from(new Set(allClasses))
  return uniqueClasses.join(' ')
}
`

  utilityFiles.push({
    path: `${options.output.componentsFolder}/utils/class-name.ts`,
    content: classNameUtilsContent,
  })

  // Generate the ref-override file
  const applyRefUtilsContent = `import { combineClassNames } from "./class-name"

/**
 * Layers a caller-supplied override onto a slot's merged props, keyed by the
 * slot's \`data-seldon-ref\` name. This is the ref override channel: a view model
 * passes \`seldonRefs\` to a component, and each slot whose ref matches receives
 * the override last. \`className\` is merged with the slot's existing classes so
 * generated styles are preserved while extra classes are added.
 *
 * @param seldonRefs - Map of ref name to override props, or undefined
 * @param props - The slot's merged props (carries its \`data-seldon-ref\`), or null
 * @returns The props with the matching override applied, or the input unchanged
 */
export function applyRef<T extends Record<string, unknown> | null>(
  seldonRefs: Record<string, Record<string, unknown>> | undefined,
  props: T,
): T {
  if (!seldonRefs || props === null) return props

  const ref = (props as Record<string, unknown>)["data-seldon-ref"]
  if (typeof ref !== "string") return props

  const override = seldonRefs[ref]
  if (!override) return props

  const merged: Record<string, unknown> = { ...(props as Record<string, unknown>), ...override }

  const baseClassName = (props as Record<string, unknown>)["className"]
  const overrideClassName = override["className"]
  if (typeof baseClassName === "string" || typeof overrideClassName === "string") {
    merged["className"] = combineClassNames(
      typeof baseClassName === "string" ? baseClassName : undefined,
      typeof overrideClassName === "string" ? overrideClassName : undefined,
    )
  }

  return merged as T
}
`

  utilityFiles.push({
    path: `${options.output.componentsFolder}/utils/apply-ref.ts`,
    content: applyRefUtilsContent,
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
