<script setup lang="ts">
import { catalog } from "@seldon/core/components/catalog"
import { isComponentId } from "@seldon/core/components/constants"
import {
  authoredBoardKeyFromName,
  authoredExportNameFromName,
} from "@seldon/core/workspace/helpers/components/authored-board-key"
import type { EntryNodeLevel } from "@seldon/core/workspace/model/entry-node"
import DialogCreateComponent from "@seldon/components/modules/DialogCreateComponent.vue"
import WindowSurface from "@app/windows/WindowSurface.vue"
import MenuController from "@app/menus/MenuController.vue"
import type { MenuEntry } from "@app/menus/types"
import { useDraggableWindow } from "@app/menus/use-draggable-window"
import { useAddRemoveCommands } from "@app/commands/use-add-remove-commands"
import { usePanelStore } from "@app/editor/panel-store"
import { useWorkspace } from "@app/workspace/use-workspace"
import { storeToRefs } from "pinia"
import { computed, ref, watch, type CSSProperties } from "vue"

type AuthoredRootKind = "container" | "frame"

const AUTHORED_LEVEL_OPTIONS: ReadonlyArray<{
  value: EntryNodeLevel
  label: string
}> = [
  { value: "element", label: "Element" },
  { value: "part", label: "Part" },
  { value: "module", label: "Module" },
  { value: "screen", label: "Screen" },
]

const CATALOG_COMPONENT_NAMES = new Set<string>(
  Object.values(catalog)
    .flat()
    .map((schema) => schema.name),
)

const panel = usePanelStore()
const { activePanel } = storeToRefs(panel)
const { workspace } = useWorkspace()
const { addAuthoredComponent } = useAddRemoveCommands()

const isOpen = computed(() => activePanel.value === "create-component")

const name = ref("")
const rootKind = ref<AuthoredRootKind>("frame")
const level = ref<EntryNodeLevel>("element")
const intent = ref("")
const tags = ref("")

const trimmedName = computed(() => name.value.trim())
const boardKey = computed(() =>
  trimmedName.value ? authoredBoardKeyFromName(trimmedName.value) : "",
)
const exportName = computed(() =>
  trimmedName.value ? authoredExportNameFromName(trimmedName.value) : "",
)

const nameError = computed<string | null>(() => {
  if (!trimmedName.value) return null
  if (!boardKey.value) return "Name must contain a letter or number."
  if (workspace.value.boards[boardKey.value] !== undefined) {
    return "A component with this name already exists in this workspace."
  }
  if (isComponentId(boardKey.value)) {
    return `Name collides with the catalog component "${boardKey.value}".`
  }
  if (CATALOG_COMPONENT_NAMES.has(exportName.value)) {
    return `Name collides with the catalog component "${exportName.value}".`
  }
  return null
})

const canSubmit = computed(
  () =>
    trimmedName.value.length > 0 &&
    boardKey.value.length > 0 &&
    !nameError.value,
)

// A centered, content-sized modal: it hugs the authored dialog size, drags from
// the title bar, and does not resize.
const { x, y, moveControls } = useDraggableWindow({
  handleClose: close,
  contentSized: true,
})

const levelOpen = ref(false)
const levelAnchor = ref<HTMLElement | null>(null)

const levelLabel = computed(
  () =>
    AUTHORED_LEVEL_OPTIONS.find((option) => option.value === level.value)
      ?.label ?? "",
)

const levelItems = computed<MenuEntry[]>(() =>
  AUTHORED_LEVEL_OPTIONS.map((option) => ({
    id: option.value,
    label: option.label,
    selected: option.value === level.value,
    active: option.value === level.value,
    activeMarker: "bullet",
    onSelect: () => {
      level.value = option.value
    },
  })),
)

const frameSelected = computed(() => rootKind.value === "frame")
const containerSelected = computed(() => rootKind.value === "container")

function startDrag(event: PointerEvent): void {
  moveControls.start(event)
}
function selectFrame(): void {
  rootKind.value = "frame"
}
function selectContainer(): void {
  rootKind.value = "container"
}
function openLevel(event: MouseEvent): void {
  levelAnchor.value = event.currentTarget as HTMLElement
  levelOpen.value = true
}
function closeLevel(): void {
  levelOpen.value = false
}
function onNameInput(event: Event): void {
  name.value = (event.target as HTMLInputElement).value
}
function onIntentInput(event: Event): void {
  intent.value = (event.target as HTMLInputElement).value
}
function onTagsInput(event: Event): void {
  tags.value = (event.target as HTMLInputElement).value
}

function reset(): void {
  name.value = ""
  rootKind.value = "frame"
  level.value = "element"
  intent.value = ""
  tags.value = ""
}

function close(): void {
  reset()
  panel.closePanel()
}

function save(): void {
  if (!canSubmit.value) return
  const parsedTags = tags.value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
  const trimmedIntent = intent.value.trim()
  addAuthoredComponent({
    name: trimmedName.value,
    rootKind: rootKind.value,
    level: level.value,
    intent: trimmedIntent || undefined,
    tags: parsedTags.length > 0 ? parsedTags : undefined,
  })
  close()
}

// Recenter on each open by clearing the drag offset from center.
watch(isOpen, (open) => {
  if (open) {
    x.set(0)
    y.set(0)
  }
})

const styles: Record<string, CSSProperties> = {
  dragHandle: { cursor: "grab", userSelect: "none", touchAction: "none" },
  option: { cursor: "pointer" },
  levelField: { cursor: "pointer" },
  levelInput: { cursor: "pointer" },
  disabled: { opacity: 0.5, pointerEvents: "none" },
}

// Each display-only slot ships baked authored copy, icons, and placeholders, so
// an empty object turns the slot on and renders that content. Interactive slots
// carry handlers and values.
const showSlot = {}

const barHandle = computed(() => ({
  onPointerdown: startDrag,
  style: styles.dragHandle,
}))
const frameItem = computed(() => ({
  onClick: selectFrame,
  role: "radio",
  "aria-checked": frameSelected.value ? "true" : "false",
  "aria-selected": frameSelected.value || undefined,
  style: styles.option,
}))
const containerItem = computed(() => ({
  onClick: selectContainer,
  role: "radio",
  "aria-checked": containerSelected.value ? "true" : "false",
  "aria-selected": containerSelected.value || undefined,
  style: styles.option,
}))
const nameInput = computed(() => ({
  value: name.value,
  onInput: onNameInput,
  autofocus: true,
  "aria-invalid": nameError.value ? "true" : undefined,
}))
const levelField = computed(() => ({
  onClick: openLevel,
  "aria-expanded": levelOpen.value,
  style: styles.levelField,
}))
const levelInput = computed(() => ({
  value: levelLabel.value,
  readonly: true,
  style: styles.levelInput,
}))
const intentInput = computed(() => ({ value: intent.value, onInput: onIntentInput }))
const tagsInput = computed(() => ({ value: tags.value, onInput: onTagsInput }))
const cancelButton = { onClick: close }
const confirmButton = computed(() => ({
  onClick: save,
  "aria-disabled": !canSubmit.value,
  style: canSubmit.value ? undefined : styles.disabled,
}))
</script>

<template>
  <WindowSurface
    v-if="isOpen"
    modal
    content-sized
    :on-close="close"
    :x="x"
    :y="y"
    :move-controls="moveControls"
  >
    <DialogCreateComponent
      data-testid="create-component-dialog"
      :bar="barHandle"
      :text-title="showSlot"
      :item-catalog="frameItem"
      :icon="showSlot"
      :frame2="showSlot"
      :text-title2="showSlot"
      :text-subtitle="showSlot"
      :item-catalog2="containerItem"
      :icon2="showSlot"
      :frame3="showSlot"
      :text-title3="showSlot"
      :text-subtitle2="showSlot"
      :form-control="showSlot"
      :text-label="showSlot"
      :input="nameInput"
      :form-control-combobox="showSlot"
      :text-label2="showSlot"
      :combobox-field="levelField"
      :input2="levelInput"
      :form-control2="showSlot"
      :text-label3="showSlot"
      :input3="intentInput"
      :form-control3="showSlot"
      :text-label4="showSlot"
      :input4="tagsInput"
      :button="cancelButton"
      :text-label5="showSlot"
      :button2="confirmButton"
      :text-label6="showSlot"
    />
    <MenuController
      :open="levelOpen"
      :anchor="levelAnchor"
      :items="levelItems"
      @close="closeLevel"
    />
  </WindowSurface>
</template>
