<script setup lang="ts">
import { computed, ref, watch, nextTick } from "vue"
import type {
  Board,
  Instance,
  Theme,
  Variant,
  Workspace,
} from "@seldon/core"
import type {
  FontCollectionEditingContext,
  IconSetEditingContext,
  ThemeEditingContext,
} from "@seldon/editor/lib/properties/inspector/editing-contexts"
import type { FlatProperty } from "@seldon/editor/lib/properties/inspector/properties-data"
import ItemProperty from "@seldon/components/elements/ItemProperty.vue"
import ItemPropertyToggle from "@seldon/components/elements/ItemPropertyToggle.vue"
import MenuController from "@app/menus/MenuController.vue"
import ComboboxListbox from "@app/menus/ComboboxListbox.vue"
import FramerExpandable from "@app/sidebars/FramerExpandable.vue"
import type { ComboboxOptionItem } from "@app/menus/types"
import { mergeStateProps } from "@app/sidebars/state-props"
import { useRowActionsMenu } from "@app/menus/use-row-actions-menu"
import { useDispatch } from "@app/workspace/use-dispatch"
import { useRowProperty } from "./hooks/use-row-property"
import { useLayerDragStore } from "./layer-drag-store"

const props = withDefaults(
  defineProps<{
    property: FlatProperty
    workspace: Workspace
    node: Variant | Instance | Board
    theme?: Theme
    allProperties: FlatProperty[]
    themeEditingContext: ThemeEditingContext | null
    fontCollectionEditingContext: FontCollectionEditingContext | null
    iconSetEditingContext: IconSetEditingContext | null
    depth?: number
  }>(),
  { depth: 0 },
)

const rowStyle = computed(() =>
  props.depth > 0 ? { paddingLeft: `${props.depth * 12}px` } : undefined,
)

const dispatch = useDispatch()
const layerDrag = useLayerDragStore()

const view = useRowProperty({
  property: computed(() => props.property),
  workspace: computed(() => props.workspace),
  node: computed(() => props.node),
  theme: computed(() => props.theme),
  allProperties: computed(() => props.allProperties),
  themeEditingContext: computed(() => props.themeEditingContext),
  fontCollectionEditingContext: computed(() => props.fontCollectionEditingContext),
  iconSetEditingContext: computed(() => props.iconSetEditingContext),
})

const control = view.control
const isLookParent = computed(() => Boolean(props.property.isLookParent))
const isSwitch = computed(() => control.kind.value === "switch")

const actionsMenu = useRowActionsMenu(() => view.resetActions.value, {
  ariaLabel: "Property actions",
})

// ---- Shared slot props ----
const nameProps = computed(() =>
  mergeStateProps(view.nameLabelProps.value, view.stateRef.value),
)
const actionsButton = computed(() => actionsMenu.buttonIconic.value)
const actionsIcon = computed(() => actionsMenu.icon.value)

// ---- ItemProperty (value rows) ----
const valueIconProps = computed(() =>
  view.listItemProps.value.icon2
    ? mergeStateProps(view.listItemProps.value.icon2, view.stateRef.value)
    : null,
)
const valueLabelProps = computed(() =>
  mergeStateProps(
    view.valueLabelProps.value,
    isLookParent.value ? { placeholder: "" } : undefined,
    view.stateRef.value,
  ),
)
const comboboxFieldProps = computed(() =>
  isLookParent.value
    ? { "aria-disabled": true, style: { pointerEvents: "none" } }
    : { onClick: view.onValueFieldClick, "data-frame-ref": "true" },
)

// ---- ItemPropertyToggle (switch rows) ----
const toggleIconProps = computed(() =>
  view.listItemProps.value.icon2
    ? mergeStateProps(view.listItemProps.value.icon2, view.stateRef.value)
    : null,
)
const toggleSwitchProps = computed(() => {
  const state = control.switchState.value
  const checked = state.checked
  return mergeStateProps(
    {
      role: "switch",
      "aria-checked": state.mixed ? "mixed" : checked ? "true" : "false",
      style: { cursor: "pointer" },
      onClick: (event: MouseEvent) => {
        event.stopPropagation()
        control.onSwitchToggle(!checked)
      },
    },
    props.property.status === "override" ? undefined : view.stateRef.value,
  )
})

// ---- Combobox floating options ----
const anchorEl = ref<HTMLElement | null>(null)
const comboboxOpen = computed(
  () =>
    control.kind.value === "combobox" &&
    control.combobox.open.value &&
    control.combobox.hasFilteredOptions.value,
)
const filteredGroups = computed<ComboboxOptionItem[][]>(
  () => control.combobox.filteredGroups.value,
)
const resolveIcon = computed(() => control.resolveOptionIcon.value)

watch(
  () => control.combobox.open.value,
  (open) => {
    if (!open) return
    void nextTick(() => {
      const el = view.rowRef.value?.$el as HTMLElement | undefined
      anchorEl.value =
        el?.querySelector<HTMLElement>(".sdn-combobox-field") ?? el ?? null
    })
  },
)

function onSelectOption(value: string): void {
  control.combobox.handleSelect(value)
}
function onCloseOptions(): void {
  control.combobox.handleClose()
  view.endEdit()
}

// ---- Layer drag reorder (native) ----
const dropZone = ref<"before" | "after" | null>(null)
const isDraggable = computed(() => view.layerDrag.value !== null)

function onDragStart(event: DragEvent): void {
  const context = view.layerDrag.value
  if (!context) return
  layerDrag.start(context.property, context.layerIndex)
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move"
    event.dataTransfer.setData("text/plain", `${context.layerIndex}`)
  }
}

function onDragEnd(): void {
  layerDrag.end()
  dropZone.value = null
}

function onDragOver(event: DragEvent): void {
  const context = view.layerDrag.value
  if (!context) return
  if (layerDrag.property !== context.property) return
  if (layerDrag.fromIndex === context.layerIndex) return
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  dropZone.value =
    event.clientY - rect.top < rect.height / 2 ? "before" : "after"
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = "move"
}

function onDragLeave(): void {
  dropZone.value = null
}

function onDrop(event: DragEvent): void {
  const context = view.layerDrag.value
  const from = layerDrag.fromIndex
  const property = layerDrag.property
  dropZone.value = null
  if (!context || from === null || property !== context.property) {
    layerDrag.end()
    return
  }
  if (from === context.layerIndex) {
    layerDrag.end()
    return
  }
  event.preventDefault()
  dispatch({
    type: "reorder_node_layer",
    payload: {
      nodeId: (props.node as Variant | Instance).id,
      property,
      fromIndex: from,
      toIndex: context.layerIndex,
    },
  } as never)
  layerDrag.end()
}
</script>

<template>
  <ItemPropertyToggle
    v-if="isSwitch"
    :ref="(el: any) => (view.rowRef.value = el)"
    class="properties-row"
    :style="rowStyle"
    :button-iconic="view.listItemProps.value.buttonIconic"
    :icon="view.listItemProps.value.icon"
    :form-control-combobox="{}"
    :input="nameProps"
    :frame="{}"
    :icon2="toggleIconProps"
    :toggle-switch="toggleSwitchProps"
    :button-iconic2="actionsButton"
    :icon3="actionsIcon"
    @click="view.onRowClick"
    @dblclick="view.onRowDoubleClick"
  />

  <ItemProperty
    v-else
    :ref="(el: any) => (view.rowRef.value = el)"
    class="properties-row"
    :class="{
      'properties-row--drop-before': dropZone === 'before',
      'properties-row--drop-after': dropZone === 'after',
    }"
    :style="rowStyle"
    :draggable="isDraggable"
    :button-iconic="view.listItemProps.value.buttonIconic"
    :icon="view.listItemProps.value.icon"
    :form-control-combobox="{}"
    :input="nameProps"
    :combobox-field="comboboxFieldProps"
    :icon2="valueIconProps"
    :input2="valueLabelProps"
    :button-iconic2="view.listItemProps.value.buttonIconic2"
    :icon3="view.listItemProps.value.icon3"
    :button-iconic3="actionsButton"
    :icon4="actionsIcon"
    @click="view.onRowClick"
    @dblclick="view.onRowDoubleClick"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  />

  <MenuController
    v-if="actionsMenu.hasActions.value"
    :open="actionsMenu.open.value"
    :anchor="actionsMenu.anchor.value"
    :items="actionsMenu.menuItems.value"
    align="end"
    @close="actionsMenu.close"
  />

  <ComboboxListbox
    v-if="comboboxOpen"
    :open="comboboxOpen"
    :anchor="anchorEl"
    :option-groups="filteredGroups"
    :value="control.storedValue.value"
    :resolve-icon="resolveIcon"
    @select="onSelectOption"
    @close="onCloseOptions"
  />

  <FramerExpandable
    v-if="view.hasChildren.value"
    :is-expanded="view.isExpanded.value"
  >
    <Property
      v-for="child in view.children.value"
      :key="child.key"
      :property="child"
      :workspace="workspace"
      :node="node"
      :theme="theme"
      :all-properties="allProperties"
      :theme-editing-context="themeEditingContext"
      :font-collection-editing-context="fontCollectionEditingContext"
      :icon-set-editing-context="iconSetEditingContext"
      :depth="depth + 1"
    />
  </FramerExpandable>
</template>

<style scoped>
.properties-row--drop-before {
  box-shadow: inset 0 2px 0 var(--sdn-swatch-active, #6366f1);
}
.properties-row--drop-after {
  box-shadow: inset 0 -2px 0 var(--sdn-swatch-active, #6366f1);
}
</style>
