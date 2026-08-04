<script setup lang="ts">
// Shared shell for the editor's floating palettes. It places the window on open,
// owns the drag, resize, and escape wiring through `useDraggableWindow`, and
// renders a non-modal `WindowSurface`. The default scoped slot receives
// `startDrag` so a caller's own header acts as the drag handle. Mounting the
// panel only while it is open lets it recenter on each open, matching the other
// floating view-models. Vue port of the React `FloatingPanel`.
import WindowSurface from "@app/windows/WindowSurface.vue"
import { useDraggableWindow } from "@app/windows/use-draggable-window"
import { usePaletteStack, usePaletteZIndex } from "@app/windows/use-palette-stack"
import { getWindowInnerSize } from "@seldon/editor/lib/helpers/get-window-inner-size"
import { onBeforeUnmount, onMounted } from "vue"

import type { PanelRect } from "@app/editor/editor-config-store"

/** Gap from the viewport edges when a panel opens against the right edge. */
const RIGHT_PLACEMENT_MARGIN = 16

/** Gap from the top of the viewport when a panel opens against the right edge. */
const RIGHT_PLACEMENT_TOP = 56

/** Debounce for persisting the rect while dragging or resizing, in ms. */
const RECT_PERSIST_DELAY = 300

/** The widest a palette may be dragged, as a multiple of its minimum width. */
const MAX_WIDTH_RATIO = 2.5

const props = withDefaults(
  defineProps<{
    initialWidth: number
    initialHeight: number
    onClose: () => void
    /** Identity in the palette stack, so a press can raise this palette to the front. */
    paletteId: string
    testId?: string
    closeOnClickOutside?: boolean
    placement?: "center" | "right"
    /** Saved rect to reopen at. Falls back to the placement default when null. */
    rect?: PanelRect | null
    /** Called after a drag or resize settles, so the caller can persist the rect. */
    onRectChange?: (rect: PanelRect) => void
  }>(),
  { closeOnClickOutside: false, placement: "center", rect: null },
)

const viewport = getWindowInnerSize()
const placementPosition =
  props.placement === "right"
    ? {
        x: viewport.width - props.initialWidth - RIGHT_PLACEMENT_MARGIN,
        y: RIGHT_PLACEMENT_TOP,
      }
    : {
        x: 0.5 * viewport.width - 0.5 * props.initialWidth,
        y: 0.5 * viewport.height - 0.5 * props.initialHeight,
      }

const initialPosition = props.rect ? { x: props.rect.x, y: props.rect.y } : placementPosition
const initialSize = props.rect
  ? { width: props.rect.width, height: props.rect.height }
  : { width: props.initialWidth, height: props.initialHeight }

const {
  x,
  y,
  width,
  height,
  onResizeStart,
  onResize,
  getRect,
  moveControls,
  dragConstraints,
  minWidth,
  minHeight,
} = useDraggableWindow({
  initialPosition,
  initialSize,
  handleClose: props.onClose,
})

const maxWidth = minWidth * MAX_WIDTH_RATIO

function startDrag(event: PointerEvent): void {
  moveControls.start(event)
}

// Join the palette stack on open (frontmost) and leave it on close, so its
// z-index tracks its place in the stack and a press lifts it above its peers.
const { register, unregister, raise } = usePaletteStack()
const zIndex = usePaletteZIndex(props.paletteId)

function raiseToFront(): void {
  raise(props.paletteId)
}

const cleanups: Array<() => void> = []

onMounted(() => {
  register(props.paletteId)

  const onRectChange = props.onRectChange

  if (!onRectChange) return

  // Persist the rect a short moment after a drag or resize settles, so the
  // palette reopens where the user left it without writing on every frame.
  let timeout: ReturnType<typeof setTimeout>

  const commit = () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => onRectChange(getRect()), RECT_PERSIST_DELAY)
  }

  cleanups.push(
    x.on("change", commit),
    y.on("change", commit),
    width.on("change", commit),
    height.on("change", commit),
    () => clearTimeout(timeout),
  )
})

onBeforeUnmount(() => {
  unregister(props.paletteId)
  for (const cleanup of cleanups) cleanup()
})
</script>

<template>
  <WindowSurface
    :on-close="onClose"
    :test-id="testId"
    :close-on-click-outside="closeOnClickOutside"
    :x="x"
    :y="y"
    :width="width"
    :height="height"
    :move-controls="moveControls"
    :drag-constraints="dragConstraints"
    :on-resize-start="onResizeStart"
    :on-resize="onResize"
    :get-rect="getRect"
    :min-width="minWidth"
    :min-height="minHeight"
    :max-width="maxWidth"
    :z-index="zIndex"
    :on-surface-pointer-down="raiseToFront"
  >
    <slot :start-drag="startDrag" />
  </WindowSurface>
</template>
