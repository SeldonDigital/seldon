<script setup lang="ts">
import { computed, type CSSProperties } from "vue"
import PanelDialog from "@seldon/components/modules/PanelDialog.vue"
import type { ResizeSide } from "@seldon/components/utils/resize"
import WindowSurface from "@app/windows/WindowSurface.vue"
import { useDraggableWindow } from "@app/menus/use-draggable-window"
import { PANEL_INITIAL_HEIGHT, PANEL_INITIAL_WIDTH } from "@app/constants"
import { getWindowInnerSize } from "@seldon/editor/lib/helpers/get-window-inner-size"
import { useImageUploadPanel } from "./use-image-upload-panel"
import ImageDropzone from "./ImageDropzone.vue"

// The title bar owns the top edge for dragging, so the dialog resizes from the
// side and bottom edges plus the two bottom corners.
const DIALOG_RESIZE_SIDES: readonly ResizeSide[] = [
  "left",
  "right",
  "bottom",
  "bottom-left",
  "bottom-right",
]

const { isOpen, currentFile, status, onFileChange, save, close } =
  useImageUploadPanel()

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
const confirmText = computed(() =>
  status.value === "pending" ? "Uploading..." : "Use image",
)

const styles: Record<string, CSSProperties> = {
  dialog: { width: "100%", height: "100%" },
  dragHandle: { cursor: "grab", userSelect: "none", touchAction: "none" },
  content: { flex: 1, minHeight: 0, display: "flex" },
}

const barHandle = computed(() => ({
  onPointerdown: startDrag,
  style: styles.dragHandle,
}))
const dialogTitle = { children: "Choose image" }
const clearButton = { onClick: clear }
const clearLabel = { children: "Clear" }
const cancelButton = { onClick: close }
const cancelIcon = { icon: "material-close" }
const cancelLabel = { children: "Cancel" }
const confirmButton = { onClick: save }
const confirmLabel = computed(() => ({ children: confirmText.value }))
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
      :text-title="dialogTitle"
      :combobox-field-search="null"
      :frame2="{}"
      :button="clearButton"
      :text-label="clearLabel"
      :frame3="{}"
      :button4="cancelButton"
      :icon6="cancelIcon"
      :text-label4="cancelLabel"
      :button5="confirmButton"
      :text-label5="confirmLabel"
      :style="styles.dialog"
    >
      <template #content>
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
