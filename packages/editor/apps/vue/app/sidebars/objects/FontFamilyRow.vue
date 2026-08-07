<script setup lang="ts">
import ComboboxOptions from "@app/menus/ComboboxOptions.vue"
import {
  buildDisabledRefProps,
  buildDisplayInputProps,
  buildFieldStateProps,
  mergeStateProps,
} from "@app/sidebars/state-props"
import { useSelectionStore } from "@app/workspace/selection-store"
import { useDispatch } from "@app/workspace/use-dispatch"
import ItemNode from "@seldon/components/elements/ItemNode.vue"
import { storeToRefs } from "pinia"
import { computed, ref } from "vue"

import { Display } from "@seldon/core"
import { PROPERTY_OPTION_ICONS } from "@seldon/core/properties/schemas/data/property-icons"

import { formatFontFamilyKey } from "./font-collection-family-rows"
import { resolveRowDisplayDecoration } from "./hooks/row-display-style"

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
const EXCLUDE_ICON = PROPERTY_OPTION_ICONS.display.exclude

// The family's enabled state reuses the node Display picker: Show enables every
// weight (`all`), Exclude disables them (`none`). An excluded family takes the
// same dimmed, italic row presentation an excluded node does. A `custom` family
// (some weights on) reads as Show, its icon dimmed.
const SHOW_EXCLUDE_OPTIONS = [
  [
    { value: "show", name: "Show" },
    { value: "exclude", name: "Exclude" },
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
      preset: value === "exclude" ? "none" : "all",
    },
  })
  displayOpen.value = false
}

function resolveShowExcludeIcon(value: string): string {
  return value === "exclude" ? EXCLUDE_ICON : SHOW_ICON
}

const isExcluded = computed(() => props.family.preset === "none")
const displayValue = computed(() => (isExcluded.value ? "exclude" : "show"))

// An excluded family takes the same dimmed, italic row notation as an excluded
// node, resolved through the shared decoration helper so both stay in sync.
const decoration = computed(() =>
  resolveRowDisplayDecoration(isExcluded.value ? [Display.EXCLUDE] : []),
)

const seldonRefs = computed(() => {
  const disabledRef = buildDisabledRefProps(decoration.value.isDimmed)

  return {
    nodeDisclosureIcon: { style: { opacity: 0 } },
    nodeField: {
      ...buildFieldStateProps({ selected: isSelected.value }),
      style: { cursor: "pointer" },
    },
    nodeIcon: mergeStateProps({ icon: "seldon-text" }, disabledRef),
    nodeLabel: mergeStateProps(
      {
        ...buildDisplayInputProps(props.family.name),
        style: { pointerEvents: "none", ...decoration.value.labelStyle },
      },
      disabledRef,
    ),
    nodeDisplay: {
      type: "button",
      "aria-haspopup": "listbox",
      "aria-expanded": displayOpen.value,
      onClick: onDisplayClick,
      style: { position: "relative", zIndex: 10 },
    },
    nodeDisplayIcon: {
      icon: isExcluded.value ? EXCLUDE_ICON : SHOW_ICON,
      style: props.family.preset === "custom" ? { opacity: 0.5 } : undefined,
    },
  }
})
</script>

<template>
  <ItemNode
    class="objects-font-family"
    :style="rootStyle"
    :aria-selected="isSelected || undefined"
    :aria-disabled="decoration.isDimmed || undefined"
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
    :option-groups="SHOW_EXCLUDE_OPTIONS"
    :value="displayValue"
    :resolve-icon="resolveShowExcludeIcon"
    @select="onSelectDisplay"
    @close="displayOpen = false"
  />
</template>
