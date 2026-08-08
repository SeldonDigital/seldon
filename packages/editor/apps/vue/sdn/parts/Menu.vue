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
 * Menu: Menu
 * Level: Part
 * Intent: Floating list of actions anchored to a trigger.
 * Tags: menu, dropdown, actions, part, overlay, UI
 * Type: Default
 *
 * Structure:
 *   MenuItem     menuItem
 *     Icon       icon
 *     TextLabel  textLabel
 *     TextLabel  textLabel2
 *
 * @example
 * ```vue
 * <Menu
 *   role="menu"
 *   aria-hidden="false"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import MenuItem from "../elements/MenuItem.vue"
import Icon from "../primitives/Icon.vue"
import TextLabel from "../primitives/TextLabel.vue"
import { combineClassNames, mergeOptionalSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  menuItem?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  role: "menu",
  "aria-hidden": "false",
  menuItem: {
    className: "sdn-menu-item sdn-menu-item-option--6dxl",
  },
  icon: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--rdh1",
  },
  textLabel: {
    children: "Menu Item",
    className: "sdn-text-label sdn-text-label--y8ur",
  },
  textLabel2: {
    children: "Annotation",
    className: "sdn-text-label sdn-text-label--bign",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-menu", props.className))
const rootAttrs = { role: sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const menuItemProps = computed(() =>
  mergeOptionalSlot(sdn.menuItem, props.menuItem, props.seldonRefs),
)
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
      <MenuItem v-if="menuItemProps !== null" v-bind="menuItemProps">
        <Icon v-if="iconProps !== null" v-bind="iconProps" />
        <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
        <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
      </MenuItem>
    </slot>
  </div>
</template>
