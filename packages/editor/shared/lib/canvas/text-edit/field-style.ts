import { measureNode } from "../overlay/measure"
import { getScopedSelectionElement } from "../overlay/selection-target"
import { updateNodeRect } from "../tracking/node-rects-store"

const EMPTY_LINE_FALLBACK_PX = 24
const ATTACH_RETRY_FRAMES = 60

export interface TextEditFieldStyle {
  WebkitAppearance: string
  WebkitTextFillColor: string
  appearance: string
  background: string
  boxSizing: string
  caretColor: string
  color: string
  fontFamily: string
  fontSize: string
  fontStyle: string
  fontWeight: string
  letterSpacing: string
  lineHeight: string
  paddingBottom: string
  paddingLeft: string
  paddingRight: string
  paddingTop: string
  textAlign: string
  textTransform: string
  whiteSpace: string
}

interface CachedFieldStyle {
  key: string
  style: TextEditFieldStyle
}

let cachedFieldStyle: CachedFieldStyle | null = null

/** The canvas element for the copy being edited, scoped by render path when present. */
export function getTextEditCanvasElement(
  nodeId: string,
  rootId: string | null,
): HTMLElement | null {
  return getScopedSelectionElement(nodeId, rootId)
}

export function clearTextEditFieldStyleCache(): void {
  cachedFieldStyle = null
}

export function getCachedTextEditFieldStyle(cacheKey: string): TextEditFieldStyle | undefined {
  if (cachedFieldStyle?.key === cacheKey) return cachedFieldStyle.style

  return undefined
}

/**
 * Type and color as painted on the canvas primitive. The overlay lives outside
 * that node, so the field must copy these instead of inheriting from editor
 * chrome. Font weight and style come from the primitive, not from a child run.
 */
export function readTextEditFieldStyle(
  element: HTMLElement,
  cacheKey?: string,
): TextEditFieldStyle {
  if (cacheKey && cachedFieldStyle?.key === cacheKey) return cachedFieldStyle.style

  const computed = window.getComputedStyle(element)
  const color = computed.color

  const style: TextEditFieldStyle = {
    WebkitAppearance: "none",
    WebkitTextFillColor: color,
    appearance: "none",
    background: "transparent",
    boxSizing: computed.boxSizing,
    caretColor: color,
    color,
    fontFamily: computed.fontFamily,
    fontSize: computed.fontSize,
    fontStyle: computed.fontStyle,
    fontWeight: computed.fontWeight,
    letterSpacing: computed.letterSpacing,
    lineHeight: computed.lineHeight,
    paddingBottom: computed.paddingBottom,
    paddingLeft: computed.paddingLeft,
    paddingRight: computed.paddingRight,
    paddingTop: computed.paddingTop,
    textAlign: computed.textAlign,
    textTransform: computed.textTransform,
    whiteSpace: computed.whiteSpace,
  }

  if (cacheKey) cachedFieldStyle = { key: cacheKey, style }

  return style
}

/** Hides the painted node while the overlay is the visible text. */
export function hideCanvasNodeForTextEdit(element: HTMLElement): () => void {
  const previousVisibility = element.style.visibility
  const previousMinHeight = element.style.minHeight
  const previousMinWidth = element.style.minWidth
  const computed = window.getComputedStyle(element)
  const lineBox =
    parseFloat(computed.lineHeight) || parseFloat(computed.fontSize) || EMPTY_LINE_FALLBACK_PX
  const box = element.getBoundingClientRect()

  if (box.height < 1) {
    element.style.minHeight = `${lineBox}px`
  }

  if (box.width < 1) {
    const parentWidth = element.parentElement?.getBoundingClientRect().width ?? 0

    element.style.minWidth = `${parentWidth > 0 ? parentWidth : lineBox}px`
  }

  element.style.visibility = "hidden"

  return () => {
    element.style.visibility = previousVisibility
    element.style.minHeight = previousMinHeight
    element.style.minWidth = previousMinWidth
  }
}

/**
 * Waits until the canvas copy is in the DOM, then runs `onAttach`. A newly
 * inserted Text is often painted one frame after the session moves to it.
 */
export function attachTextEditCanvasNode(
  nodeId: string,
  rootId: string | null,
  onAttach: (element: HTMLElement) => () => void,
): () => void {
  let cancelled = false
  let restore: (() => void) | undefined
  let frame = 0
  let attempts = 0

  function tryAttach() {
    if (cancelled) return

    const element = getTextEditCanvasElement(nodeId, rootId)

    if (!element) {
      if (attempts >= ATTACH_RETRY_FRAMES) return

      attempts += 1
      frame = requestAnimationFrame(tryAttach)

      return
    }

    restore = onAttach(element)
    updateNodeRect(nodeId, measureNode(nodeId, rootId))
  }

  tryAttach()

  return () => {
    cancelled = true
    cancelAnimationFrame(frame)
    restore?.()
  }
}
