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
 * Menu: MenuOptions
 * Level: Part
 * Intent: Floating list of actions anchored to a trigger.
 * Tags: menu, dropdown, actions, part, overlay, UI
 * Type: Custom
 *
 * Structure:
 *   MenuItemOption  menuItemOption
 *     Icon          icon
 *     TextLabel     textLabel
 *     TextLabel     textLabel2
 *
 * @example
 * ```vue
 * <MenuOptions
 *   role="listbox"
 *   aria-hidden="false"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import MenuItemOption from "../elements/MenuItemOption.vue"
import Icon from "../primitives/Icon.vue"
import TextLabel from "../primitives/TextLabel.vue"
import { combineClassNames, mergeOptionalSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  menuItemOption?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  role: "listbox",
  "aria-hidden": "false",
  menuItemOption: {
    className: "sdn-menu-item-option sdn-menu-item-option--6dxl",
  },
  icon: {
    icon: "material-check",
    className: "sdn-icon sdn-icon--rdh1",
  },
  textLabel: {
    children: "Option",
    className: "sdn-text-label sdn-text-label--y8ur",
  },
  textLabel2: {
    children: "Annotation",
    className: "sdn-text-label sdn-text-label--ni4j",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-menu", props.className))
const rootAttrs = { role: sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const menuItemOptionProps = computed(() =>
  mergeOptionalSlot(sdn.menuItemOption, props.menuItemOption, props.seldonRefs),
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
      <MenuItemOption v-if="menuItemOptionProps !== null" v-bind="menuItemOptionProps">
        <Icon v-if="iconProps !== null" v-bind="iconProps" />
        <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
        <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
      </MenuItemOption>
    </slot>
  </div>
</template>
