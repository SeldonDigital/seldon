/***** * * This code was generated using Seldon (https://github.com/SeldonDigital/seldon) * *
License: https://github.com/SeldonDigital/seldon/blob/main/LICENSE.md * Do not redistribute or
sublicense without permission. * * You may not use this software, or any derivative works of it, in
whole or in part, * for the purposes of training, fine-tuning, or otherwise improving (directly or
indirectly) * any machine learning or artificial intelligence system without written permission. *
*****/

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

/**
 * Select: Select
 * Level: Element
 * Intent: Dropdown element for choosing a single value from a list of options.
 * Tags: select, dropdown, input, form, element, menu, choice
 * Type: Default
 *
 * Structure:
 *   TextOption  textOption
 *   TextOption  textOption2
 *   TextOption  textOption3
 *
 * @example
 * ```vue
 * <Select
 *   aria-hidden="false"
 *   textOption="{}"
 *   textOption2="{}"
 *   textOption3="{}"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import TextOption from "../primitives/TextOption.vue"
import { combineClassNames, mergeOptionalSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  textOption?: Record<string, unknown> | null
  textOption2?: Record<string, unknown> | null
  textOption3?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  textOption: {
    children: "Option 01",
    className: "sdn-text-option sdn-text-title--drqy",
  },
  textOption2: {
    children: "Option 02",
    className: "sdn-text-option sdn-text-title--drqy",
  },
  textOption3: {
    children: "Option 03",
    className: "sdn-text-option sdn-text-title--drqy",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-select", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const textOptionProps = computed(() =>
  mergeOptionalSlot(sdn.textOption, props.textOption, props.seldonRefs),
)
const textOption2Props = computed(() =>
  mergeOptionalSlot(sdn.textOption2, props.textOption2, props.seldonRefs),
)
const textOption3Props = computed(() =>
  mergeOptionalSlot(sdn.textOption3, props.textOption3, props.seldonRefs),
)
</script>

<template>
  <select :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <TextOption v-if="textOptionProps !== null" v-bind="textOptionProps" />
      <TextOption v-if="textOption2Props !== null" v-bind="textOption2Props" />
      <TextOption v-if="textOption3Props !== null" v-bind="textOption3Props" />
    </slot>
  </select>
</template>
