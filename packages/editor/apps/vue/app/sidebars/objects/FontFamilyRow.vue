<script setup lang="ts">
import ComboboxOptions from "@app/menus/ComboboxOptions.vue"
import { buildDisplayInputProps, buildFieldStateProps } from "@app/sidebars/state-props"
import { useSelectionStore } from "@app/workspace/selection-store"
import { useDispatch } from "@app/workspace/use-dispatch"
import ItemNode from "@seldon/components/elements/ItemNode.vue"
import { storeToRefs } from "pinia"
import { computed, ref } from "vue"

import { PROPERTY_OPTION_ICONS } from "@seldon/core/properties/schemas/data/property-icons"

import { formatFontFamilyKey } from "./font-collection-family-rows"

import type { FontFamilyRowModel } from "./font-collection-family-rows"

const props = defineProps<{
  boardKey: string
  entryId: string
  family: FontFamilyRowModel
  depth: number
}>()

const selection = useSelectionStore()
const dispatch = useDispatch()
const { selectedResourceItemKey } = storeToRefs(selection)

const SHOW_ICON = PROPERTY_OPTION_ICONS.display.show
const HIDE_ICON = PROPERTY_OPTION_ICONS.display.hide

// The family's enabled state reuses the node Show/Hide picker: Show enables
// every weight (`all`), Hide disables them (`none`). A `custom` family (some
// weights on) reads as Show, dimmed.
const SHOW_HIDE_OPTIONS = [
  [
    { value: "show", name: "Show" },
    { value: "hide", name: "Hide" },
  ],
]

const selectionKey = computed(() =>
  formatFontFamilyKey(props.boardKey, props.entryId, props.family.slot),
)
const isSelected = computed(() => selectedResourceItemKey.value === selectionKey.value)

const rootStyle = computed(() => ({ paddingLeft: `${props.depth * 12}px` }))

function select(event: MouseEvent): void {
  if ((event.target as HTMLElement).closest("button")) return
  selection.selectResourceItem(selectionKey.value)
}

const displayOpen = ref(false)
const displayAnchor = ref<HTMLElement | null>(null)

function onDisplayClick(event: MouseEvent): void {
  event.stopPropagation()
  displayAnchor.value = event.currentTarget as HTMLElement
  displayOpen.value = !displayOpen.value
}

function onSelectDisplay(value: string): void {
  dispatch({
    type: "set_font_collection_family_preset",
    payload: {
      fontCollectionId: props.entryId,
      slot: props.family.slot,
      preset: value === "hide" ? "none" : "all",
    },
  })
  displayOpen.value = false
}

function resolveShowHideIcon(value: string): string {
  return value === "hide" ? HIDE_ICON : SHOW_ICON
}

const displayValue = computed(() => (props.family.preset === "none" ? "hide" : "show"))

const seldonRefs = computed(() => ({
  nodeDisclosureIcon: { style: { opacity: 0 } },
  nodeField: {
    ...buildFieldStateProps({ selected: isSelected.value }),
    style: { cursor: "pointer" },
  },
  nodeIcon: { icon: "seldon-text" },
  nodeLabel: buildDisplayInputProps(props.family.name),
  nodeDisplay: {
    type: "button",
    "aria-haspopup": "listbox",
    "aria-expanded": displayOpen.value,
    onClick: onDisplayClick,
    style: { position: "relative", zIndex: 10 },
  },
  nodeDisplayIcon: {
    icon: props.family.preset === "none" ? HIDE_ICON : SHOW_ICON,
    style: props.family.preset === "custom" ? { opacity: 0.5 } : undefined,
  },
}))
</script>

<template>
  <ItemNode
    class="objects-font-family"
    :style="rootStyle"
    :aria-selected="isSelected || undefined"
    data-testid="objects-sidebar-font-family"
    :data-resource-item-key="selectionKey"
    :data-selection-id="selectionKey"
    data-selection-kind="resourceItem"
    :seldon-refs="seldonRefs"
    :button-iconic="{}"
    :combobox-field="{}"
    :button-iconic2="{}"
    :button-iconic3="null"
    @click="select"
  />

  <ComboboxOptions
    :open="displayOpen"
    :anchor="displayAnchor"
    :option-groups="SHOW_HIDE_OPTIONS"
    :value="displayValue"
    :resolve-icon="resolveShowHideIcon"
    @select="onSelectDisplay"
    @close="displayOpen = false"
  />
</template>
