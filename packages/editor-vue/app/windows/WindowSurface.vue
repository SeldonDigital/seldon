<script setup lang="ts">
// BESPOKE-VIEW: hand-authored motion-v floating window built on motion.div.
// It renders either a draggable, resizable window or a centered, content-sized
// modal. No generated component covers this chrome. motion-v has no 1:1
// equivalent on other platforms, so this shell is reimplemented per platform
// rather than ported like the class-free overlay primitives. Vue port of the
// React `WindowSurface.bespoke`.
import { computed, ref, type CSSProperties } from "vue"
import { storeToRefs } from "pinia"
import { motion, type MotionValue } from "motion-v"

/** motion-v does not export the drag controls type by name; derive it. */
type DragControls = ReturnType<(typeof import("motion-v"))["useDragControls"]>
import {
  RESIZE_SIDES,
  createResizeHandle,
  getResizeHandleStyle,
  type Rect,
  type ResizeSide,
} from "@seldon/components/utils/resize"
import { useEditorConfigStore } from "@app/editor/editor-config-store"
import { useResolvedInterfaceMode } from "@app/editor/use-resolved-interface-mode"

/** Drag constraint box, in the same coordinate space as the motion values. */
interface BoundingBox {
  top: number
  left: number
  right: number
  bottom: number
}

const props = withDefaults(
  defineProps<{
    x: MotionValue<number>
    y: MotionValue<number>
    moveControls: DragControls
    onClose: () => void
    testId?: string
    modal?: boolean
    closeOnClickOutside?: boolean
    preventInteractionOutside?: boolean
    // Resizable-window wiring. Required unless `contentSized` is set, where the
    // surface sizes to its content, centers itself, and cannot resize.
    width?: MotionValue<number>
    height?: MotionValue<number>
    dragConstraints?: BoundingBox
    onResizeStart?: () => void
    onResize?: (rect: Rect) => void
    getRect?: () => Rect
    resizeSides?: readonly ResizeSide[]
    minWidth?: number
    minHeight?: number
    // Render a centered modal whose surface hugs its content. `x`/`y` act as a
    // drag offset from center, the viewport bounds the drag, and no resize
    // handles are rendered.
    contentSized?: boolean
  }>(),
  {
    modal: false,
    closeOnClickOutside: false,
    preventInteractionOutside: false,
    contentSized: false,
    resizeSides: () => RESIZE_SIDES,
  },
)

// The portal mounts on document.body, outside the chrome root that scopes the
// editor theme and mode, so re-apply both here to match the editor interface.
const { chromeTheme } = storeToRefs(useEditorConfigStore())
const resolvedMode = useResolvedInterfaceMode()

const overlayRef = ref<HTMLElement | null>(null)

const showBackdrop = computed(
  () =>
    props.modal || props.closeOnClickOutside || props.preventInteractionOutside,
)
const backdropClose = computed(() =>
  props.modal || props.closeOnClickOutside ? props.onClose : undefined,
)

const contentSurfaceStyle = computed(() => ({
  x: props.x,
  y: props.y,
  ...styles.contentSurface,
}))

const surfaceMotionStyle = computed(() => ({
  x: props.x,
  y: props.y,
  width: props.width,
  height: props.height,
  ...styles.surface,
}))

const resizeHandles = computed(() => {
  const { onResize, getRect } = props
  if (!onResize || !getRect) return []
  return props.resizeSides.map((side) => {
    const { onPointerDown } = createResizeHandle({
      side,
      getRect,
      onResize,
      minWidth: props.minWidth,
      minHeight: props.minHeight,
      onStart: props.onResizeStart,
    })
    return { side, onPointerDown, style: getResizeHandleStyle(side) }
  })
})

const styles: Record<string, CSSProperties> = {
  // The scope only carries the theme/mode attributes; `display: contents` keeps
  // it out of layout so the fixed backdrop and surface position as before.
  scope: { display: "contents" },
  backdrop: { position: "fixed", inset: 0, zIndex: 30 },
  surface: { position: "fixed", left: 0, top: 0, zIndex: 40 },
  // Content-sized modal: a fixed, flex-centered overlay holds a surface that
  // hugs its authored content and drags as an offset from center.
  centerOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  contentSurface: {
    width: "fit-content",
    height: "fit-content",
    zIndex: 40,
  },
}
</script>

<template>
  <Teleport to="body">
    <div
      :data-theme="chromeTheme"
      :data-mode="resolvedMode"
      :style="styles.scope"
    >
      <template v-if="contentSized">
        <div
          ref="overlayRef"
          :style="styles.centerOverlay"
          @click="backdropClose?.()"
        >
          <motion.div
            :drag="true"
            :drag-controls="moveControls"
            :drag-listener="false"
            :drag-momentum="false"
            :drag-elastic="false"
            :drag-constraints="overlayRef ?? undefined"
            :style="contentSurfaceStyle"
            :data-testid="testId"
            @click.stop
          >
            <slot />
          </motion.div>
        </div>
      </template>

      <template v-else>
        <div
          v-if="showBackdrop"
          :style="styles.backdrop"
          @click="backdropClose?.()"
        />
        <motion.div
          :drag="true"
          :drag-controls="moveControls"
          :drag-listener="false"
          :drag-momentum="false"
          :drag-elastic="false"
          :drag-constraints="dragConstraints"
          :style="surfaceMotionStyle"
          :data-testid="testId"
        >
          <slot />
          <div
            v-for="handle in resizeHandles"
            :key="handle.side"
            :style="handle.style"
            @pointerdown="handle.onPointerDown($event)"
          />
        </motion.div>
      </template>
    </div>
  </Teleport>
</template>
