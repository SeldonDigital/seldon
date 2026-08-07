<script setup lang="ts">
import { buildDisplayInputProps } from "@app/sidebars/state-props"
import { useDispatch } from "@app/workspace/use-dispatch"
import ItemNode from "@seldon/components/elements/ItemNode.vue"
import { computed } from "vue"

import type { FontFamilyWeightRow } from "./font-collection-family-rows"

const props = defineProps<{
  entryId: string
  slotId: string
  weight: FontFamilyWeightRow
  depth: number
}>()

const dispatch = useDispatch()

function onToggle(event: MouseEvent): void {
  event.stopPropagation()
  dispatch({
    type: "set_font_collection_family_variant",
    payload: {
      fontCollectionId: props.entryId,
      slot: props.slotId,
      variant: props.weight.variant,
      enabled: !props.weight.enabled,
    },
  })
}

const rootStyle = computed(() => ({ paddingLeft: `${props.depth * 12}px` }))

const seldonRefs = computed(() => ({
  nodeDisclosureIcon: { style: { opacity: 0 } },
  nodeField: { style: { cursor: "pointer" } },
  nodeIcon: { style: { opacity: 0 } },
  nodeLabel: buildDisplayInputProps(props.weight.label),
  nodeDisplay: { onClick: onToggle },
  nodeDisplayIcon: {
    icon: props.weight.enabled ? "material-checkBox" : "material-checkBoxOutlineBlank",
  },
}))
</script>

<template>
  <ItemNode
    class="objects-font-weight"
    :style="rootStyle"
    :aria-checked="weight.enabled"
    data-testid="objects-sidebar-font-weight"
    :data-font-weight="weight.variant"
    :seldon-refs="seldonRefs"
    :button-iconic="{}"
    :combobox-field="{}"
    :button-iconic2="{}"
    :button-iconic3="null"
    @click="onToggle"
  />
</template>
