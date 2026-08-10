import { getWindowInnerSize } from "@seldon/editor/lib/helpers/get-window-inner-size"
import { useDragControls, useMotionValue } from "motion-v"
import { onBeforeUnmount, onMounted, ref } from "vue"

import type { Ref } from "vue"

/** The size every floating window opens at, and the smallest it may be dragged to. */
export const MIN_WINDOW_SIZE = { width: 300, height: 300 }

/** Bound a value to the inclusive range, used to keep a window inside the viewport. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Absolute rect of the window in viewport coordinates. */
interface Rect {
  x: number
  y: number
  width: number
  height: number
}

/** Drag constraint box, in the same coordinate space as the motion values. */
interface BoundingBox {
  top: number
  left: number
  right: number
  bottom: number
}

interface DraggableWindowOptions {
  handleClose: () => void
  initialPosition?: { x: number; y: number }
  initialSize?: { width: number; height: number }
  closeOnEscape?: boolean
  minWidth?: number
  minHeight?: number
  contentSized?: boolean
}

/**
 * Drag, resize, and position mechanics for a floating editor window. Shared by
 * every view-model that opens one: it owns the motion values, drag controls,
 * resize handlers, and drag constraints that `WindowSurface` renders.
 *
 * Vue port of the React `useDraggableWindow`, built on motion-v.
 */
export function useDraggableWindow(options: DraggableWindowOptions) {
  const {
    initialPosition,
    initialSize,
    handleClose,
    closeOnEscape = true,
    minWidth = MIN_WINDOW_SIZE.width,
    minHeight = MIN_WINDOW_SIZE.height,
    contentSized = false,
  } = options

  const moveControls = useDragControls()
  // A content-sized window centers with flexbox and drags as an offset from
  // that center, so its motion values start at zero. A resizable window drives
  // absolute position and size from the caller's seeds.
  const startPosition = initialPosition ?? { x: 0, y: 0 }
  const startSize = initialSize ?? { width: 0, height: 0 }
  const x = useMotionValue(startPosition.x)
  const y = useMotionValue(startPosition.y)
  const width = useMotionValue(startSize.width)
  const height = useMotionValue(startSize.height)

  const initial = getWindowInnerSize()
  const dragConstraints: Ref<BoundingBox> = ref({
    top: 0,
    left: 0,
    right: initial.width - width.get(),
    bottom: initial.height - height.get(),
  })

  // Suppress native text selection while dragging a resize handle across the
  // surface. Restore it once the pointer is released.
  function onResizeStart(): void {
    const previousUserSelect = document.body.style.userSelect

    document.body.style.userSelect = "none"

    const restoreUserSelect = () => {
      document.body.style.userSelect = previousUserSelect
      window.removeEventListener("pointerup", restoreUserSelect)
    }

    window.addEventListener("pointerup", restoreUserSelect)
  }

  function getRect(): Rect {
    return { x: x.get(), y: y.get(), width: width.get(), height: height.get() }
  }

  function onResize(rect: Rect): void {
    x.set(rect.x)
    y.set(rect.y)
    width.set(rect.width)
    height.set(rect.height)
  }

  const cleanups: Array<() => void> = []

  onMounted(() => {
    // Keep the constraint box in step with the window size so the surface never
    // drags past the viewport edges.
    cleanups.push(
      width.on("change", (next: number) => {
        dragConstraints.value = {
          ...dragConstraints.value,
          right: getWindowInnerSize().width - next,
        }
      }),
    )
    cleanups.push(
      height.on("change", (next: number) => {
        dragConstraints.value = {
          ...dragConstraints.value,
          bottom: getWindowInnerSize().height - next,
        }
      }),
    )

    if (closeOnEscape) {
      const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") handleClose()
      }

      window.addEventListener("keydown", onKey)
      cleanups.push(() => window.removeEventListener("keydown", onKey))
    }

    // Recompute constraints on resize and pull the surface back into view. A
    // shrunk viewport leaves a resting window past the new edge, and motion only
    // applies constraints during a drag, so clamp its position here or its title
    // bar and handles stay off screen and unreachable. A content-sized modal
    // drags as an offset from center inside its overlay, so skip the clamp.
    const onWindowResize = () => {
      const size = getWindowInnerSize()
      const maxX = Math.max(0, size.width - width.get())
      const maxY = Math.max(0, size.height - height.get())

      if (!contentSized) {
        x.set(clamp(x.get(), 0, maxX))
        y.set(clamp(y.get(), 0, maxY))
      }

      dragConstraints.value = { top: 0, left: 0, right: maxX, bottom: maxY }
    }

    window.addEventListener("resize", onWindowResize)
    cleanups.push(() => window.removeEventListener("resize", onWindowResize))
  })

  onBeforeUnmount(() => {
    for (const cleanup of cleanups) cleanup()
  })

  return {
    x,
    y,
    width,
    height,
    onResizeStart,
    getRect,
    onResize,
    moveControls,
    dragConstraints,
    minWidth,
    minHeight,
    contentSized,
  }
}
