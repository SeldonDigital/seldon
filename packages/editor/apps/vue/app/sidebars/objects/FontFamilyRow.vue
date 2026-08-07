<script setup lang="ts">
import FramerExpandable from "@app/sidebars/FramerExpandable.vue"
import { buildDisplayInputProps, buildFieldStateProps } from "@app/sidebars/state-props"
import { useSelectionStore } from "@app/workspace/selection-store"
import { useDispatch } from "@app/workspace/use-dispatch"
import ItemNode from "@seldon/components/elements/ItemNode.vue"
import { storeToRefs } from "pinia"
import { computed, ref } from "vue"

import FontWeightRow from "./FontWeightRow.vue"
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

const selectionKey = computed(() =>
  formatFontFamilyKey(props.boardKey, props.entryId, props.family.slot),
)
const isSelected = computed(() => selectedResourceItemKey.value === selectionKey.value)
const hasWeights = computed(() => props.family.weights.length > 0)

const weightsExpanded = ref(false)

function select(event: MouseEvent): void {
  if ((event.target as HTMLElement).closest("button")) return
  selection.selectResourceItem(selectionKey.value)
}

function onToggleWeights(event: MouseEvent): void {
  event.stopPropagation()
  if (hasWeights.value) weightsExpanded.value = !weightsExpanded.value
}

function onTogglePreset(event: MouseEvent): void {
  event.stopPropagation()
  dispatch({
    type: "set_font_collection_family_preset",
    payload: {
      fontCollectionId: props.entryId,
      slot: props.family.slot,
      preset: props.family.preset === "all" ? "none" : "all",
    },
  })
}

const rootStyle = computed(() => ({ paddingLeft: `${props.depth * 12}px` }))
const presetIcon = computed(() =>
  props.family.preset === "none" ? "material-checkBoxOutlineBlank" : "material-checkBox",
)

const seldonRefs = computed(() => ({
  nodeDisclosure: { onClick: onToggleWeights },
  nodeDisclosureIcon: {
    style: {
      transition: "transform 0.2s ease",
      ...(hasWeights.value
        ? weightsExpanded.value
          ? { transform: "rotate(90deg)" }
          : {}
        : { opacity: 0 }),
    },
  },
  nodeField: { ...buildFieldStateProps({ selected: isSelected.value }), style: { cursor: "pointer" } },
  nodeIcon: { icon: "seldon-text" },
  nodeLabel: buildDisplayInputProps(props.family.name),
  nodeDisplay: { onClick: onTogglePreset, title: `Weights: ${props.family.preset}` },
  nodeDisplayIcon: {
    icon: presetIcon.value,
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

  <FramerExpandable v-if="hasWeights" :is-expanded="weightsExpanded">
    <FontWeightRow
      v-for="weight in family.weights"
      :key="weight.variant"
      :entry-id="entryId"
      :slot-id="family.slot"
      :weight="weight"
      :depth="depth + 1"
    />
  </FramerExpandable>
</template>
