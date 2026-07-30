<script setup lang="ts" generic="T extends CatalogDialogItem">
import { PANEL_INITIAL_HEIGHT, PANEL_INITIAL_WIDTH } from "@app/constants"
import WindowSurface from "@app/windows/WindowSurface.vue"
import { useDraggableWindow } from "@app/windows/use-draggable-window"
import ItemCatalog from "@seldon/components/elements/ItemCatalog.vue"
import Container from "@seldon/components/frames/Container.vue"
import PanelDialog from "@seldon/components/modules/PanelDialog.vue"
import ListStandardCatalog from "@seldon/components/parts/ListStandardCatalog.vue"
import TextSubtitle from "@seldon/components/primitives/TextSubtitle.vue"
import { getWindowInnerSize } from "@seldon/editor/lib/helpers/get-window-inner-size"
import { computed, ref } from "vue"

import type { CatalogDialogCategory, CatalogDialogItem } from "./types"
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

const props = defineProps<{
  title: string
  confirmButtonText: string
  categories: CatalogDialogCategory<T>[]
  query: string
  onQueryChange: (query: string) => void
  onPick: (item: T) => void
  onClose: () => void
}>()

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
  handleClose: props.onClose,
})

const selectedId = ref<string | null>(null)

const visibleCategories = computed(() => props.categories.filter(({ items }) => items.length > 0))

const selectedItem = computed<T | null>(
  () =>
    visibleCategories.value
      .flatMap(({ items }) => items)
      .find((item) => item.id === selectedId.value) ?? null,
)

function startDrag(event: PointerEvent): void {
  moveControls.start(event)
}

// Keep pointer interactions with the search field from starting a drag.
function stopDrag(event: PointerEvent): void {
  event.stopPropagation()
}

function pickItem(item: T): void {
  props.onPick(item)
  selectedId.value = null
  // onPick may trigger effects that must run before the panel unmounts.
  requestAnimationFrame(props.onClose)
}

function handleConfirm(): void {
  if (selectedItem.value) pickItem(selectedItem.value)
}

function onSearchInput(event: Event): void {
  props.onQueryChange((event.target as HTMLInputElement).value)
}

function clearQuery(): void {
  props.onQueryChange("")
}

const styles: Record<string, CSSProperties> = {
  dialog: { width: "100%", height: "100%" },
  dragHandle: { cursor: "grab", userSelect: "none", touchAction: "none" },
  content: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    overflowX: "hidden",
    scrollbarGutter: "stable",
    scrollbarWidth: "thin",
  },
  category: { width: "100%" },
  catalogGrid: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "var(--sdn-gaps-compact)",
  },
  row: { cursor: "pointer", width: "100%" },
  rowSelected: {
    cursor: "pointer",
    width: "100%",
    backgroundColor: "color-mix(in srgb, var(--sdn-swatch-white) 10%, transparent)",
  },
  empty: { width: "100%" },
  hidden: { display: "none" },
}

const barHandle = computed(() => ({
  onPointerdown: startDrag,
  style: styles.dragHandle,
}))

// Cancel and confirm live in the footer's right frame (button4/button5). The shell
// leaves both slots as placeholders, so enable them and set their labels; their
// icons ride the shell defaults and the click flows through `seldonRefs`.
const cancelLabel = { children: "Cancel" }
const confirmLabel = computed(() => ({ children: props.confirmButtonText }))
const dialogStyle = styles.dialog

// Drive every slot through its stable workspace ref. The title and the search
// field are conditional slots, so they keep a positional `{}` enabler to render;
// their data flows through `seldonRefs`. The search field itself only stops the
// drag so a click in the input does not move the window. The content frame is
// bound for layout only; its rows ride the generated `dialogContent` slot.
const seldonRefs = computed(() => ({
  dialogTitle: { children: props.title },
  dialogSearchField: { onPointerdown: stopDrag },
  dialogSearch: {
    value: props.query,
    onInput: onSearchInput,
    placeholder: "Search...",
    autofocus: true,
  },
  dialogSearchClear: {
    onClick: clearQuery,
    style: props.query ? undefined : styles.hidden,
  },
  dialogContent: { style: styles.content },
  dialogCancel: { onClick: props.onClose },
  dialogConfirm: { onClick: handleConfirm },
}))

// Each row is its own `ItemCatalog`, so the row's content reaches its slots by
// ref name. The three slots are opt-in, so each keeps a positional `{}` enabler.
function rowRefs(item: T): Record<string, Record<string, unknown>> {
  return {
    catalogIcon: { icon: item.icon },
    catalogLabel: { children: item.name },
    catalogVariant: { children: item.description },
  }
}

function rowStyle(item: T): CSSProperties {
  return item.id === selectedId.value ? styles.rowSelected : styles.row
}
</script>

<template>
  <WindowSurface
    modal
    :on-close="onClose"
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
      data-testid="catalog-dialog"
      :seldon-refs="seldonRefs"
      :bar="barHandle"
      :text-title="{}"
      :combobox-field-search="{}"
      :button4="{}"
      :text-label4="cancelLabel"
      :button5="{}"
      :text-label5="confirmLabel"
      :style="dialogStyle"
    >
      <template #dialogContent>
        <TextSubtitle v-if="visibleCategories.length === 0" :style="styles.empty">
          No results found
        </TextSubtitle>
        <template v-else>
          <ListStandardCatalog v-for="cat in visibleCategories" :key="cat.category">
            <TextSubtitle :style="styles.category">{{ cat.category }}</TextSubtitle>
            <Container :style="styles.catalogGrid">
              <ItemCatalog
                v-for="item in cat.items"
                :key="item.id"
                :aria-selected="item.id === selectedId || undefined"
                :style="rowStyle(item)"
                :seldon-refs="rowRefs(item)"
                :icon="{}"
                :text-title="{}"
                :text-subtitle="{}"
                :data-testid="`catalog-item-${item.id}`"
                @click="selectedId = item.id"
                @dblclick="pickItem(item)"
              />
            </Container>
          </ListStandardCatalog>
        </template>
      </template>
    </PanelDialog>
  </WindowSurface>
</template>
