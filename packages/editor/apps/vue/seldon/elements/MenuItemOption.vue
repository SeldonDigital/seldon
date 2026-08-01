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
 * Menu Item: MenuItemOption
 * Level: Element
 * Intent: Single actionable row inside a menu.
 * Tags: menu, menuitem, action, row, element, UI
 * Type: Custom
 *
 * Structure:
 *   Icon       icon        -> optionIcon
 *   TextLabel  textLabel   -> optionLabel
 *   TextLabel  textLabel2  -> optionAnnotation
 *
 * @example
 * ```vue
 * <MenuItemOption
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
import { combineClassNames, mergeOptionalSlot } from "../utils/class-names"

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
    icon: "material-check",
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

const rootClassName = computed(() => combineClassNames("sdn-menu-item-option", props.className))
const rootAttrs = { role: sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const iconProps = computed(() => mergeOptionalSlot(sdn.icon, props.icon, props.seldonRefs))
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
