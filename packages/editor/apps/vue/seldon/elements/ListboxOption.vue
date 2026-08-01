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
 * List: boxOption
 * Level: Element
 * Intent: Single selectable row inside a listbox.
 * Tags: listbox, option, select, row, element, UI
 * Type: Default
 *
 * Structure:
 *   Icon       icon        -> optionIcon
 *   TextLabel  textLabel   -> optionLabel
 *   TextLabel  textLabel2  -> optionAnnotation
 *
 * @example
 * ```vue
 * <ListboxOption
 *   role="option"
 *   aria-hidden="false"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import Icon from "../primitives/Icon.vue"
import TextLabel from "../primitives/TextLabel.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  icon?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  role: "option",
  "aria-hidden": "false",
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "optionIcon",
  },
  textLabel: {
    children: "Option",
    className: "sdn-text-label sdn-text-label--xohb",
    "data-seldon-ref": "optionLabel",
  },
  textLabel2: {
    children: "Annotation",
    className: "sdn-text-label sdn-text-label--lqmh",
    "data-seldon-ref": "optionAnnotation",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-listbox-option", props.className))
const rootAttrs = { role: sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const textLabel2Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs),
)
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Icon v-if="iconProps !== null" v-bind="iconProps" />
      <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
      <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
    </slot>
  </div>
</template>
