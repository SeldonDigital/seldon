<script setup lang="ts">
import { PANEL_INITIAL_HEIGHT, PANEL_INITIAL_WIDTH } from "@app/constants"
import WindowSurface from "@app/windows/WindowSurface.vue"
import { useDraggableWindow } from "@app/windows/use-draggable-window"
import PanelDialog from "@seldon/components/modules/PanelDialog.vue"
import { getWindowInnerSize } from "@seldon/editor/lib/helpers/get-window-inner-size"
import { computed } from "vue"

import ImageDropzone from "./ImageDropzone.vue"
import { useImageUploadPanel } from "./use-image-upload-panel"

import type { ResizeSide } from "@seldon/components/utils/resize"
import type { CSSProperties } from "vue"

// The title bar owns the top edge for dragging, so the dialog resizes from the
// side and bottom edges plus the two bottom corners.
const DIALOG_RESIZE_SIDES: readonly ResizeSide[] = [
  "left",
  "right",
  "bottom",
  "bottom-left",
  "bottom-right",
]

const { isOpen, currentFile, status, onFileChange, save, close } = useImageUploadPanel()

const viewport = getWindowInnerSize()
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
  initialPosition: {
    x: 0.5 * viewport.width - 0.5 * PANEL_INITIAL_WIDTH,
    y: 0.5 * viewport.height - 0.5 * PANEL_INITIAL_HEIGHT,
  },
  initialSize: { width: PANEL_INITIAL_WIDTH, height: PANEL_INITIAL_HEIGHT },
  handleClose: close,
})

function startDrag(event: PointerEvent): void {
  moveControls.start(event)
}
function clear(): void {
  onFileChange(null)
}

const showDropzone = computed(() => status.value !== "success")
const confirmText = computed(() => (status.value === "pending" ? "Uploading..." : "Use image"))

const styles: Record<string, CSSProperties> = {
  dialog: { width: "100%", height: "100%" },
  dragHandle: { cursor: "grab", userSelect: "none", touchAction: "none" },
  content: { flex: 1, minHeight: 0, display: "flex" },
}

const barHandle = computed(() => ({
  onPointerdown: startDrag,
  style: styles.dragHandle,
}))
const clearButton = { onClick: clear }
const clearLabel = { children: "Clear" }
const cancelIcon = { icon: "material-close" }
const cancelLabel = { children: "Cancel" }
const confirmLabel = computed(() => ({ children: confirmText.value }))

// Every value and handler reaches its slot by the slot's baked `data-seldon-ref`
// name, so moving or reordering a node in the design keeps this wiring intact.
const seldonRefs = {
  dialogTitle: { children: "Choose image" },
  dialogCancel: { onClick: close },
  dialogConfirm: { onClick: save },
}
</script>

<template>
  <WindowSurface
    v-if="isOpen"
    modal
    :on-close="close"
    :x="x"
    :y="y"
    :width="width"
    :height="height"
    :move-controls="moveControls"
    :drag-constraints="dragConstraints"
    :on-resize-start="onResizeStart"
    :on-resize="onResize"
    :get-rect="getRect"
    :resize-sides="DIALOG_RESIZE_SIDES"
    :min-width="minWidth"
    :min-height="minHeight"
  >
    <PanelDialog
      data-testid="image-upload-dialog"
      :bar="barHandle"
      :seldon-refs="seldonRefs"
      :text-title="{}"
      :combobox-field-search="null"
      :button="clearButton"
      :text-label="clearLabel"
      :button4="{}"
      :icon6="cancelIcon"
      :text-label4="cancelLabel"
      :button5="{}"
      :text-label5="confirmLabel"
      :style="styles.dialog"
    >
      <template #dialogContent>
        <div :style="styles.content">
          <ImageDropzone
            v-if="showDropzone"
            :current-file="currentFile"
            @file-change="onFileChange"
          />
        </div>
      </template>
    </PanelDialog>
  </WindowSurface>
</template>
