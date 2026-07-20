import { getWindowInnerSize } from "@seldon/editor/lib/helpers/get-window-inner-size"
import { useDragControls, useMotionValue } from "motion-v"
import { onBeforeUnmount, onMounted, ref, type Ref } from "vue"

const DEFAULT_MIN_WINDOW_WIDTH = 300
const DEFAULT_MIN_WINDOW_HEIGHT = 300

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
  initialPosition?: { x: number; y: number }
  initialSize?: { width: number; height: number }
  handleClose: () => void
  closeOnEscape?: boolean
  minWidth?: number
  minHeight?: number
  contentSized?: boolean
}

/**
 * Drag, resize, and position mechanics for a floating editor window. Owns the
 * motion values, drag controls, resize handlers, and drag constraints that a
 * window surface renders. Vue port of the React `useDraggableWindow`, built on
 * motion-v. Scaffolded ahead of the Vue dialog and palette surfaces so those
 * reach parity without re-deriving the mechanics.
 */
export function useDraggableWindow(options: DraggableWindowOptions) {
  const {
    initialPosition,
    initialSize,
    handleClose,
    closeOnEscape = true,
    minWidth = DEFAULT_MIN_WINDOW_WIDTH,
    minHeight = DEFAULT_MIN_WINDOW_HEIGHT,
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

    const onWindowResize = () => {
      const size = getWindowInnerSize()
      dragConstraints.value = {
        top: 0,
        left: 0,
        right: size.width - width.get(),
        bottom: size.height - height.get(),
      }
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
