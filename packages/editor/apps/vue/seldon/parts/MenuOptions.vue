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
 *   MenuItemOption  menuItemOption2
 *     Icon          icon2
 *     TextLabel     textLabel3
 *     TextLabel     textLabel4
 *   MenuItemOption  menuItemOption3
 *     Icon          icon3
 *     TextLabel     textLabel5
 *     TextLabel     textLabel6
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
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  menuItemOption?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  menuItemOption2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  textLabel4?: Record<string, unknown> | null
  menuItemOption3?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  textLabel5?: Record<string, unknown> | null
  textLabel6?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  role: "listbox",
  "aria-hidden": "false",
  menuItemOption: {
    role: "option",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-option--6dxl",
  },
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  textLabel: {
    children: "Option",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  textLabel2: {
    children: "Annotation",
    className: "sdn-text-label sdn-text-label--lqmh",
  },
  menuItemOption2: {
    role: "option",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-option--6dxl",
  },
  icon2: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  textLabel3: {
    children: "Option",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  textLabel4: {
    children: "Annotation",
    className: "sdn-text-label sdn-text-label--lqmh",
  },
  menuItemOption3: {
    role: "option",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-option--6dxl",
  },
  icon3: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  textLabel5: {
    children: "Option",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  textLabel6: {
    children: "Annotation",
    className: "sdn-text-label sdn-text-label--lqmh",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-menu-options", props.className))
const rootAttrs = { role: sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const menuItemOptionProps = computed(() =>
  mergeSlot(sdn.menuItemOption, props.menuItemOption, props.seldonRefs),
)
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const textLabel2Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs),
)
const menuItemOption2Props = computed(() =>
  mergeSlot(sdn.menuItemOption2, props.menuItemOption2, props.seldonRefs),
)
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2, props.seldonRefs))
const textLabel3Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs),
)
const textLabel4Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel4, props.textLabel4, props.seldonRefs),
)
const menuItemOption3Props = computed(() =>
  mergeSlot(sdn.menuItemOption3, props.menuItemOption3, props.seldonRefs),
)
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3, props.seldonRefs))
const textLabel5Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel5, props.textLabel5, props.seldonRefs),
)
const textLabel6Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel6, props.textLabel6, props.seldonRefs),
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
      <MenuItemOption v-if="menuItemOption2Props !== null" v-bind="menuItemOption2Props">
        <Icon v-if="icon2Props !== null" v-bind="icon2Props" />
        <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
        <TextLabel v-if="textLabel4Props !== null" v-bind="textLabel4Props" />
      </MenuItemOption>
      <MenuItemOption v-if="menuItemOption3Props !== null" v-bind="menuItemOption3Props">
        <Icon v-if="icon3Props !== null" v-bind="icon3Props" />
        <TextLabel v-if="textLabel5Props !== null" v-bind="textLabel5Props" />
        <TextLabel v-if="textLabel6Props !== null" v-bind="textLabel6Props" />
      </MenuItemOption>
    </slot>
  </div>
</template>
