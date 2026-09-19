import { domToJpeg } from "modern-screenshot"
import { BRIDGE_ASSET_PATH } from "../../mcp/bridge-protocol"
import {
  getCanvasElement,
  getHtmlElementByBoardId,
  getHtmlElementByNodeId,
} from "../dom/canvas-elements"
import { getScopedSelectionElement } from "../overlay/selection-target"

/** Longest side of the JPEG, in CSS pixels, unless the caller passes `maxSize`. */
const DEFAULT_MAX_SIZE = 1200

/** JPEG quality when the caller does not pass `quality`. */
const DEFAULT_QUALITY = 0.8

/**
 * How long to wait for the target board or node to appear. A capture surface
 * mounts a whole board on request, so the wait covers that render, not just a
 * frame or two of layout.
 */
const ELEMENT_WAIT_MS = 5000

/**
 * Caps webfont and remote-asset waits inside the rasterizer. The library's own
 * default is 30 seconds per fetch, which can outlive the bridge's capture
 * deadline when a board has several images or font files.
 */
const ASSET_TIMEOUT_MS = 8000

/** Caps the whole rasterize so a hung clone cannot leave the capture surface up. */
const RASTERIZE_TIMEOUT_MS = 20_000

/** Transparent 1x1 PNG used when a remote image cannot be inlined. */
const PLACEHOLDER_IMAGE =
  "data:image/png;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"

/** JPEG background when no ancestor paints an opaque color. */
const CAPTURE_FALLBACK_BACKGROUND = "#ffffff"

const JPEG_MIME = "image/jpeg"
const CAPTURE_EXCLUDE_ATTR = "data-capture-exclude"

/**
 * What a canvas capture should rasterize. An omitted target uses the visible
 * board. `rootElement` narrows every lookup to one subtree, which a capture of
 * a board the canvas is not showing sets to the capture surface holding it.
 */
export interface CaptureCanvasImageRequest {
  nodeId?: string
  boardKey?: string
  rootPath?: string
  rootElement?: HTMLElement
  maxSize?: number
  quality?: number
}

/** One JPEG rasterized from a live canvas element. `data` is bare base64. */
export interface CapturedCanvasImage {
  data: string
  mimeType: string
  width: number
  height: number
  label?: string
}

/** Resolves after `ms`. */
function waitMs(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

/**
 * Yields one paint when the tab is visible. Falls back to a short timer so a
 * background tab, where `requestAnimationFrame` may never fire, cannot stall
 * the capture.
 */
function nextFrame(): Promise<void> {
  return Promise.race([
    new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve())
    }),
    waitMs(50),
  ])
}

/** Waits for webfonts, then two frames, so the target's layout has settled. */
async function waitForFontsAndPaint(): Promise<void> {
  if (document.fonts?.ready) {
    await Promise.race([document.fonts.ready, waitMs(ASSET_TIMEOUT_MS)])
  }

  await nextFrame()
  await nextFrame()
}

/**
 * Finds the board or node element the capture should rasterize. A `rootElement`
 * request stays inside that subtree, so it reads the copy the capture surface
 * rendered rather than a like-named element on the canvas.
 */
function findCaptureElement(request: CaptureCanvasImageRequest): HTMLElement | null {
  const root = request.rootElement

  if (root) {
    if (request.nodeId) return getScopedSelectionElement(request.nodeId, request.rootPath, root)

    return root.querySelector<HTMLElement>("[data-board-id]")
  }

  if (request.nodeId) {
    return (
      getScopedSelectionElement(request.nodeId, request.rootPath) ??
      getHtmlElementByNodeId(request.nodeId)
    )
  }

  if (request.boardKey) return getHtmlElementByBoardId(request.boardKey)

  return getCanvasElement()?.querySelector<HTMLElement>("[data-board-id]") ?? null
}

/** Polls until the target is in the DOM with a layout size, or the wait expires. */
async function waitForCaptureElement(
  request: CaptureCanvasImageRequest,
): Promise<HTMLElement | null> {
  const deadline = Date.now() + ELEMENT_WAIT_MS
  let element = findCaptureElement(request)

  while (
    (!element || element.offsetWidth === 0 || element.offsetHeight === 0) &&
    Date.now() < deadline
  ) {
    await nextFrame()
    element = findCaptureElement(request)
  }

  return element
}

/** The message when the target is not on the canvas. */
function missingTargetMessage(request: CaptureCanvasImageRequest): string {
  if (request.nodeId) return `No canvas element found for node "${request.nodeId}".`
  if (request.boardKey) return `No canvas element found for board "${request.boardKey}".`

  return "No board or node is on the canvas to capture."
}

/** Scale that keeps the longest side at or under `maxSize` without enlarging. */
function captureScale(width: number, height: number, maxSize: number): number {
  const longest = Math.max(width, height)

  if (longest <= 0) return 1

  return Math.min(1, maxSize / longest)
}

/** Walks up to the board for an opaque background, then the fallback. */
function resolveBackgroundColor(element: HTMLElement): string {
  let current: HTMLElement | null = element

  while (current) {
    const color = getComputedStyle(current).backgroundColor

    if (color && color !== "transparent" && color !== "rgba(0, 0, 0, 0)") return color
    if (current.hasAttribute("data-board-id")) break
    current = current.parentElement
  }

  return CAPTURE_FALLBACK_BACKGROUND
}

/** Drops overlay chrome stamped with `data-capture-exclude`. */
function includeInCapture(node: Node): boolean {
  if (!(node instanceof Element)) return true

  return !node.hasAttribute(CAPTURE_EXCLUDE_ATTR)
}

/**
 * Rewrites an absolute http(s) URL through the bridge asset proxy. A miss
 * returns a placeholder instead of `false`, so the rasterizer does not fall
 * through to its own fetch and wait out another timeout on a CORS-blocked host.
 */
async function fetchViaAssetProxy(url: string): Promise<string | false> {
  if (!/^https?:\/\//i.test(url)) return false

  try {
    const response = await fetch(`${BRIDGE_ASSET_PATH}?url=${encodeURIComponent(url)}`)

    if (!response.ok) return PLACEHOLDER_IMAGE
    const dataUrl = await response.text()

    return dataUrl.startsWith("data:") ? dataUrl : PLACEHOLDER_IMAGE
  } catch {
    return PLACEHOLDER_IMAGE
  }
}

/** Strips the `data:` prefix so the MCP image block can take bare base64. */
function dataUrlToBase64(dataUrl: string): string {
  const comma = dataUrl.indexOf(",")

  return comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl
}

/** Names the captured target for the agent. */
function captureLabel(request: CaptureCanvasImageRequest, element: HTMLElement): string {
  if (request.nodeId) return `node ${request.nodeId}`
  if (request.boardKey) return `board ${request.boardKey}`
  const boardId = element.getAttribute("data-board-id")

  return boardId ? `board ${boardId}` : "active board"
}

/**
 * Rasterizes a board or node to a JPEG. The caller mounts the target first when
 * the canvas is showing a different board, and passes the surface holding it as
 * `rootElement`. Zoom on the ancestor transform wrapper does not affect the
 * output size, so the JPEG comes out at the target's own layout size whatever
 * the canvas is zoomed to.
 */
export async function captureCanvasImage(
  request: CaptureCanvasImageRequest = {},
): Promise<CapturedCanvasImage> {
  const element = await waitForCaptureElement(request)

  if (!element) throw new Error(missingTargetMessage(request))
  await waitForFontsAndPaint()

  if (element.offsetWidth === 0 || element.offsetHeight === 0) {
    throw new Error("The canvas target has no layout size to capture.")
  }

  const maxSize = request.maxSize ?? DEFAULT_MAX_SIZE
  const quality = request.quality ?? DEFAULT_QUALITY
  const width = element.offsetWidth
  const height = element.offsetHeight
  const scale = captureScale(width, height, maxSize)
  const dataUrl = await Promise.race([
    domToJpeg(element, {
      width,
      height,
      scale,
      quality,
      type: JPEG_MIME,
      timeout: ASSET_TIMEOUT_MS,
      backgroundColor: resolveBackgroundColor(element),
      filter: includeInCapture,
      fetchFn: fetchViaAssetProxy,
    }),
    waitMs(RASTERIZE_TIMEOUT_MS).then(() => {
      throw new Error("Timed out rasterizing the canvas target.")
    }),
  ])

  return {
    data: dataUrlToBase64(dataUrl),
    mimeType: JPEG_MIME,
    width: Math.round(width * scale),
    height: Math.round(height * scale),
    label: captureLabel(request, element),
  }
}
