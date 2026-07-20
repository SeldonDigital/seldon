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
 * Menu Item: MenuItemCheckbox
 * Level: Element
 * Intent: Single actionable row inside a menu.
 * Tags: menu, menuitem, action, row, element, UI
 * Type: Custom
 *
 * @example
 * ```vue
 * <MenuItemCheckbox
 *   role="menuitemcheckbox"
 *   aria-hidden="false"
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
  icon?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "role": "menuitemcheckbox",
  "aria-hidden": "false",
  "className": "sdn-menu-item",
  "icon": {
    "icon": "material-check",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--xohb"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-menu-item", props.className))
const rootAttrs = { "role": sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
</script>

<template>
    <button :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Icon v-if="iconProps !== null" v-bind="iconProps" />
        <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
      </slot>
    </button>
</template>
