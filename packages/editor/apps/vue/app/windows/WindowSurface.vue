<script setup lang="ts">
import { useEditorConfigStore } from "@app/editor/editor-config-store"
import { useResolvedInterfaceMode } from "@app/editor/use-resolved-interface-mode"
import {
  RESIZE_SIDES,
  createResizeHandle,
  getResizeHandleStyle,
} from "@seldon/components/utils/resize"
import { motion } from "motion-v"
import { storeToRefs } from "pinia"
import { computed, ref } from "vue"

import type { Rect, ResizeSide } from "@seldon/components/utils/resize"
import type { MotionValue } from "motion-v"
import type { CSSProperties } from "vue"

// BESPOKE-VIEW: hand-authored motion-v floating window built on motion.div.
// It renders either a draggable, resizable window or a centered, content-sized
// modal. No generated component covers this chrome. motion-v has no 1:1
// equivalent on other platforms, so this shell is reimplemented per platform
// rather than ported like the class-free overlay primitives. Vue port of the
// React `WindowSurface.bespoke`.

/** motion-v does not export the drag controls type by name; derive it. */
type DragControls = ReturnType<(typeof import("motion-v"))["useDragControls"]>

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
    // Reports the surface itself, including its resize handles. A non-modal caller
    // that dismisses on an outside press needs it to tell its own surface from
    // elsewhere, since it renders no backdrop to catch the press for it. Mirrors
    // the React `surfaceRef` prop.
    surfaceRef?: (el: HTMLElement | null) => void
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
    maxWidth?: number
    // Render a centered modal whose surface hugs its content. `x`/`y` act as a
    // drag offset from center, the viewport bounds the drag, and no resize
    // handles are rendered.
    contentSized?: boolean
    // Live z-index for a palette surface, so a click can lift it above its peers.
    // Only the plain palette surface honors it; dialogs and anchored cards keep
    // their own bands.
    zIndex?: number
    // Fires on a palette-surface press, so the caller can raise it to the front.
    onSurfacePointerDown?: (event: PointerEvent) => void
    // Where the surface portals. Defaults to the document body, which floats it
    // over the whole editor. A canvas badge card passes the canvas layer instead,
    // with `anchored`, so it sits in that layer and the sidebar clips it.
    portalTarget?: HTMLElement | null
    // Position the surface absolutely inside its portal target rather than fixed
    // to the viewport. `x`/`y` are then read in the target's own space.
    anchored?: boolean
  }>(),
  {
    modal: false,
    closeOnClickOutside: false,
    preventInteractionOutside: false,
    contentSized: false,
    anchored: false,
    resizeSides: () => RESIZE_SIDES,
  },
)

// The portal mounts on document.body, outside the chrome root that scopes the
// editor theme and mode, so re-apply both here to match the editor interface.
const { chromeTheme } = storeToRefs(useEditorConfigStore())
const resolvedMode = useResolvedInterfaceMode()

const overlayRef = ref<HTMLElement | null>(null)

// A template ref on a component yields its instance, so the element comes off
// `$el`. Null on unmount, which is what tells a caller the window has gone.
function setSurface(instance: unknown): void {
  props.surfaceRef?.((instance as { $el?: HTMLElement } | null)?.$el ?? null)
}

const showBackdrop = computed(
  () => props.modal || props.closeOnClickOutside || props.preventInteractionOutside,
)
const backdropClose = computed(() =>
  props.modal || props.closeOnClickOutside ? props.onClose : undefined,
)

// Dialogs sit above palettes: a modal or content-sized surface is a dialog, and a
// plain draggable surface is a palette or a badge card. The two take separate
// z-index bands so a dialog is never obscured by a palette left open behind it.
const isDialog = computed(() => props.modal || props.contentSized)
// Only a plain palette surface takes a live z-index and raise-on-press; dialogs
// and anchored cards keep their own bands.
const isPalette = computed(() => !isDialog.value && !props.anchored)

const backdropStyle = computed(() => (isDialog.value ? styles.dialogBackdrop : styles.backdrop))

const teleportTarget = computed(() => props.portalTarget ?? "body")

const contentSurfaceStyle = computed(() => ({
  x: props.x,
  y: props.y,
  ...styles.contentSurface,
}))

const surfaceMotionStyle = computed(() => {
  const base = props.anchored
    ? styles.anchoredSurface
    : isDialog.value
      ? styles.dialogSurface
      : styles.surface
  const raisedZ = isPalette.value && props.zIndex !== undefined ? props.zIndex : undefined

  return {
    x: props.x,
    y: props.y,
    width: props.width,
    height: props.height,
    ...base,
    ...(raisedZ === undefined ? {} : { zIndex: raisedZ }),
  }
})

// Anchored inside the canvas layer, a press bubbles to the canvas click handler;
// stop it so interacting with the card never reads as a canvas click. A
// body-portaled surface has no such parent to reach, so it keeps the default.
function onSurfaceClick(event: MouseEvent): void {
  if (props.anchored) event.stopPropagation()
}

function onSurfacePointerDownCapture(event: PointerEvent): void {
  if (isPalette.value) props.onSurfacePointerDown?.(event)
}

const resizeHandles = computed(() => {
  const { onResize, getRect } = props
  if (!onResize || !getRect) return []
  const maxWidth = props.maxWidth
  return props.resizeSides.map((side) => {
    // The width cap is held per side so a left-edge drag keeps its right edge
    // fixed, shifting x, while a right-edge drag leaves x alone.
    const clampedResize = (rect: Rect) => onResize(clampResizeWidth(rect, side, maxWidth))
    const { onPointerDown } = createResizeHandle({
      side,
      getRect,
      onResize: clampedResize,
      minWidth: props.minWidth,
      minHeight: props.minHeight,
      onStart: props.onResizeStart,
    })
    return { side, onPointerDown, style: getResizeHandleStyle(side) }
  })
})

/**
 * Cap a resized window's width, holding the edge opposite the drag in place. A
 * left-edge drag keeps the right edge fixed, so the cap shifts x; a right-edge
 * drag keeps the left edge, so x is untouched. The rect is returned unchanged
 * when no cap is set or met.
 */
function clampResizeWidth(rect: Rect, side: ResizeSide, maxWidth?: number): Rect {
  if (maxWidth === undefined || rect.width <= maxWidth) return rect
  const x = side.includes("left") ? rect.x + (rect.width - maxWidth) : rect.x

  return { ...rect, x, width: maxWidth }
}

const styles: Record<string, CSSProperties> = {
  // The scope only carries the theme/mode attributes; `display: contents` keeps
  // it out of layout so the fixed backdrop and surface position as before.
  scope: { display: "contents" },
  // Palette band (30/40): a non-modal draggable surface and its optional backdrop.
  backdrop: { position: "fixed", inset: 0, zIndex: 30 },
  surface: { position: "fixed", left: 0, top: 0, zIndex: 40 },
  // Absolute inside the canvas layer, so `x`/`y` read in that layer's space and
  // the sidebar clips the surface as it does the badges.
  anchoredSurface: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 40,
  },
  // Dialog band (50/60): above the palette band, so a dialog is never hidden
  // behind a palette that stays open. Shared by modal and content-sized surfaces.
  dialogBackdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 50,
  },
  dialogSurface: {
    position: "fixed",
    left: 0,
    top: 0,
    zIndex: 60,
  },
  // Content-sized modal: a fixed, flex-centered overlay holds a surface that
  // hugs its authored content and drags as an offset from center.
  centerOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  contentSurface: {
    width: "fit-content",
    height: "fit-content",
    zIndex: 60,
  },
}
</script>

<template>
  <Teleport :to="teleportTarget">
    <div :data-theme="chromeTheme" :data-mode="resolvedMode" :style="styles.scope">
      <template v-if="contentSized">
        <div ref="overlayRef" :style="styles.centerOverlay" @click="backdropClose?.()">
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
        <div v-if="showBackdrop" :style="backdropStyle" @click="backdropClose?.()" />
        <motion.div
          :ref="setSurface"
          :drag="true"
          :drag-controls="moveControls"
          :drag-listener="false"
          :drag-momentum="false"
          :drag-elastic="false"
          :drag-constraints="dragConstraints"
          :style="surfaceMotionStyle"
          :data-testid="testId"
          @click="onSurfaceClick"
          @pointerdown.capture="onSurfacePointerDownCapture"
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
