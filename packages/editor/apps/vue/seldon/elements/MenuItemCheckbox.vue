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
 * Menu Item: MenuItemCheckbox
 * Level: Element
 * Intent: Single actionable row inside a menu.
 * Tags: menu, menuitem, action, row, element, UI
 * Type: Custom
 *
 * Structure:
 *   Icon       icon
 *   TextLabel  textLabel
 *
 * @example
 * ```vue
 * <MenuItemCheckbox
 *   role="menuitemcheckbox"
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
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  role: "menuitemcheckbox",
  "aria-hidden": "false",
  icon: {
    icon: "material-check",
    className: "sdn-icon sdn-icon--xi68",
  },
  textLabel: {
    children: "Checkbox Item",
    className: "sdn-text-label sdn-text-label--xohb",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-menu-item", props.className))
const rootAttrs = { role: sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const iconProps = computed(() => mergeOptionalSlot(sdn.icon, props.icon, props.seldonRefs))
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
</script>

<template>
  <button :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Icon v-if="iconProps !== null" v-bind="iconProps" />
      <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
    </slot>
  </button>
</template>
