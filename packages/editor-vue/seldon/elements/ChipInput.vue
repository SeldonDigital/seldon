<script lang="ts">
/*****
 *
 * This code was generated using Seldon (https://github.com/SeldonDigital/seldon)
 *
 * License: https://github.com/SeldonDigital/seldon/blob/main/LICENSE.md
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it, in whole or in part,
 * for the purposes of training, fine-tuning, or otherwise improving (directly or indirectly)
 * any machine learning or artificial intelligence system without written permission.
 *
 *****/

/*****
 * Chip: ChipInput
 * Level: Element
 * Intent: Schema for a small, interactive UI element used to display information, categories, or actions with optional removal or selection states.
 * Tags: chip, ui, tag, label, badge, filter, category, pill
 * Type: Custom
 *
 * @example
 * ```vue
 * <ChipInput
 *   aria-hidden="false"
 *   textLabel="{}"
 *   icon="material-star"
 * />
 * ```
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Icon from "../primitives/Icon.vue"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  textLabel?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-chip",
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--lug5"
  },
  "icon": {
    "icon": "material-close",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--eyw9"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-chip", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
</script>

<template>
    <span :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
        <Icon v-if="iconProps !== null" v-bind="iconProps" />
      </slot>
    </span>
</template>
