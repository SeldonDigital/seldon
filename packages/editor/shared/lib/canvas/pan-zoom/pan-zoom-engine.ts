/**
 * Framework-neutral pan and zoom engine for the canvas viewport.
 *
 * Wheel with Ctrl/Cmd zooms toward the cursor; a plain wheel pans; holding space
 * or the middle button drags to pan. Zoom buttons and shortcuts drive the same
 * transform through the engine methods. State changes notify subscribers so the
 * React and Vue shells can mirror the transform and keep the overlays glued.
 *
 * The shells own how the transform is applied to the DOM (`getTransformStyle`)
 * and how zoom controls and hotkeys call the methods. Configuration (scale
 * bounds, zoom step, initial position, axis lock, disabled predicate) is passed
 * in so each editor keeps its own behavior.
 */
export interface PanZoomTransform {
  scale: number
  x: number
  y: number
}

export interface PanZoomOptions {
  getViewport: () => HTMLElement | null
  minScale?: number
  maxScale?: number
  /** Multiplicative factor per wheel notch and per zoom button press. */
  zoomStep?: number
  initialScale?: number
  initialX?: number
  initialY?: number
  /** When true, horizontal panning is locked (device preview). */
  lockAxisX?: () => boolean
  /** When true, all interaction is ignored (a text field is focused). */
  disabled?: () => boolean
  /** Whether a middle-button drag pans. Space + left always pans. */
  allowMiddleClickPan?: boolean
}

export interface PanZoomEngine {
  getTransform: () => PanZoomTransform
  getTransformStyle: () => { transform: string; transformOrigin: string }
  isPanning: () => boolean
  subscribe: (listener: () => void) => () => void
  zoomIn: () => void
  zoomOut: () => void
  zoomCentered: (factor: number) => void
  reset: () => void
  setTransform: (x: number, y: number, scale: number) => void
  onWheel: (event: WheelEvent) => void
  onPointerDown: (event: PointerEvent) => void
  onPointerMove: (event: PointerEvent) => void
  onPointerUp: (event: PointerEvent) => void
  /** Attach window listeners (space activation). */
  attach: () => void
  destroy: () => void
}

export function createPanZoomEngine(options: PanZoomOptions): PanZoomEngine {
  const minScale = options.minScale ?? 0.1
  const maxScale = options.maxScale ?? 4
  const zoomStep = options.zoomStep ?? 1.2
  const initialScale = options.initialScale ?? 1
  const initialX = options.initialX ?? 0
  const initialY = options.initialY ?? 0
  const allowMiddleClickPan = options.allowMiddleClickPan ?? true

  let scale = initialScale
  let x = initialX
  let y = initialY
  let panning = false
  let spaceDown = false
  let lastX = 0
  let lastY = 0

  const listeners = new Set<() => void>()

  const notify = (): void => {
    for (const listener of listeners) listener()
  }

  const isDisabled = (): boolean => options.disabled?.() ?? false
  const isAxisXLocked = (): boolean => options.lockAxisX?.() ?? false

  function clampScale(value: number): number {
    return Math.min(maxScale, Math.max(minScale, value))
  }

  function commit(nextScale: number, nextX: number, nextY: number): void {
    if (nextScale === scale && nextX === x && nextY === y) return
    scale = nextScale
    x = nextX
    y = nextY
    notify()
  }

  function zoomAt(clientX: number, clientY: number, factor: number): void {
    const el = options.getViewport()

    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = clientX - rect.left
    const py = clientY - rect.top
    const nextScale = clampScale(scale * factor)
    const ratio = nextScale / scale

    // Keep the point under the cursor fixed while scaling.
    commit(nextScale, px - (px - x) * ratio, py - (py - y) * ratio)
  }

  function zoomCentered(factor: number): void {
    const el = options.getViewport()

    if (!el) return
    const rect = el.getBoundingClientRect()

    zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, factor)
  }

  function reset(): void {
    commit(initialScale, initialX, initialY)
  }

  function setTransform(nextX: number, nextY: number, nextScale: number): void {
    commit(clampScale(nextScale), nextX, nextY)
  }

  function onWheel(event: WheelEvent): void {
    if (isDisabled()) return
    event.preventDefault()

    if (event.ctrlKey || event.metaKey) {
      const factor = event.deltaY < 0 ? zoomStep : 1 / zoomStep

      zoomAt(event.clientX, event.clientY, factor)

      return
    }

    const deltaX = isAxisXLocked() ? 0 : event.deltaX

    commit(scale, x - deltaX, y - event.deltaY)
  }

  function onPointerDown(event: PointerEvent): void {
    if (isDisabled()) return
    const panButton =
      (allowMiddleClickPan && event.button === 1) || (event.button === 0 && spaceDown)

    if (!panButton) return
    event.preventDefault()
    panning = true
    lastX = event.clientX
    lastY = event.clientY
    ;(event.target as HTMLElement).setPointerCapture?.(event.pointerId)
    notify()
  }

  function onPointerMove(event: PointerEvent): void {
    if (!panning) return
    const deltaX = isAxisXLocked() ? 0 : event.clientX - lastX

    commit(scale, x + deltaX, y + (event.clientY - lastY))
    lastX = event.clientX
    lastY = event.clientY
  }

  function onPointerUp(): void {
    if (!panning) return
    panning = false
    notify()
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (event.code === "Space") spaceDown = true
  }

  function onKeyUp(event: KeyboardEvent): void {
    if (event.code === "Space") spaceDown = false
  }

  function attach(): void {
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
  }

  function destroy(): void {
    window.removeEventListener("keydown", onKeyDown)
    window.removeEventListener("keyup", onKeyUp)
    listeners.clear()
  }

  return {
    getTransform: () => ({ scale, x, y }),
    getTransformStyle: () => ({
      transform: `translate(${x}px, ${y}px) scale(${scale})`,
      transformOrigin: "0 0",
    }),
    isPanning: () => panning,
    subscribe: (listener) => {
      listeners.add(listener)

      return () => {
        listeners.delete(listener)
      }
    },
    zoomIn: () => zoomCentered(zoomStep),
    zoomOut: () => zoomCentered(1 / zoomStep),
    zoomCentered,
    reset,
    setTransform,
    onWheel,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    attach,
    destroy,
  }
}
