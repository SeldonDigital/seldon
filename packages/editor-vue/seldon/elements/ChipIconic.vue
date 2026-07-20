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
 * Chip: ChipIconic
 * Level: Element
 * Intent: Schema for a small, interactive UI element used to display information, categories, or actions with optional removal or selection states.
 * Tags: chip, ui, tag, label, badge, filter, category, pill
 * Type: Custom
 *
 * @example
 * ```vue
 * <ChipIconic
 *   aria-hidden="false"
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

const props = defineProps<{
  className?: string
  icon?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-chip-iconic sdn-chip",
  "icon": {
    "icon": "material-inbox",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--gh8m"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-chip-iconic", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
</script>

<template>
    <span :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Icon v-if="iconProps !== null" v-bind="iconProps" />
      </slot>
    </span>
</template>
