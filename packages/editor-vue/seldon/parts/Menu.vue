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
 * Menu: Menu
 * Level: Part
 * Intent: Floating list of actions anchored to a trigger.
 * Tags: menu, dropdown, actions, part, overlay, UI
 * Type: Default
 *
 * @example
 * ```vue
 * <Menu
 *   role="menu"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Hr from "../primitives/Hr.vue"
import Icon from "../primitives/Icon.vue"
import MenuItem from "../elements/MenuItem.vue"
import MenuItemCheckbox from "../elements/MenuItemCheckbox.vue"
import MenuItemRadio from "../elements/MenuItemRadio.vue"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  menuItem?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  menuItem2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  textLabel4?: Record<string, unknown> | null
  hr?: Record<string, unknown> | null
  menuItemCheckbox?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  textLabel5?: Record<string, unknown> | null
  menuItemRadio?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  textLabel6?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "role": "menu",
  "aria-hidden": "false",
  "className": "sdn-menu",
  "menuItem": {
    "role": "menuitem",
    "aria-hidden": "false",
    "className": "sdn-menu-item sdn-menu-item--rrtt"
  },
  "icon": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--xohb"
  },
  "textLabel2": {
    "className": "sdn-text-label sdn-text-label--fdei"
  },
  "menuItem2": {
    "role": "menuitem",
    "aria-hidden": "false",
    "className": "sdn-menu-item sdn-menu-item--rrtt"
  },
  "icon2": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel3": {
    "className": "sdn-text-label sdn-text-label--xohb"
  },
  "textLabel4": {
    "className": "sdn-text-label sdn-text-label--fdei"
  },
  "hr": {
    "aria-hidden": "false",
    "className": "sdn-hr sdn-hr--lrmt"
  },
  "menuItemCheckbox": {
    "role": "menuitemcheckbox",
    "aria-hidden": "false",
    "className": "sdn-menu-item sdn-menu-item--rrtt"
  },
  "icon3": {
    "icon": "material-check",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel5": {
    "className": "sdn-text-label sdn-text-label--xohb"
  },
  "menuItemRadio": {
    "role": "menuitemradio",
    "aria-hidden": "false",
    "className": "sdn-menu-item sdn-menu-item--rrtt"
  },
  "icon4": {
    "icon": "material-radioButtonChecked",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel6": {
    "className": "sdn-text-label sdn-text-label--xohb"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-menu", props.className))
const rootAttrs = { "role": sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const menuItemProps = computed(() => mergeSlot(sdn.menuItem, props.menuItem))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const textLabel2Props = computed(() => mergeSlot(sdn.textLabel2, props.textLabel2))
const menuItem2Props = computed(() => mergeSlot(sdn.menuItem2, props.menuItem2))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2))
const textLabel3Props = computed(() => mergeSlot(sdn.textLabel3, props.textLabel3))
const textLabel4Props = computed(() => mergeSlot(sdn.textLabel4, props.textLabel4))
const hrProps = computed(() => mergeSlot(sdn.hr, props.hr))
const menuItemCheckboxProps = computed(() => mergeSlot(sdn.menuItemCheckbox, props.menuItemCheckbox))
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3))
const textLabel5Props = computed(() => mergeSlot(sdn.textLabel5, props.textLabel5))
const menuItemRadioProps = computed(() => mergeSlot(sdn.menuItemRadio, props.menuItemRadio))
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4))
const textLabel6Props = computed(() => mergeSlot(sdn.textLabel6, props.textLabel6))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <MenuItem v-if="menuItemProps !== null" v-bind="menuItemProps">
          <Icon v-if="iconProps !== null" v-bind="iconProps" />
          <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
          <TextLabel v-if="textLabel2 && textLabel2Props" v-bind="textLabel2Props" />
        </MenuItem>
        <MenuItem v-if="menuItem2Props !== null" v-bind="menuItem2Props">
          <Icon v-if="icon2Props !== null" v-bind="icon2Props" />
          <TextLabel v-if="textLabel3 && textLabel3Props" v-bind="textLabel3Props" />
          <TextLabel v-if="textLabel4 && textLabel4Props" v-bind="textLabel4Props" />
        </MenuItem>
        <Hr v-if="hrProps !== null" v-bind="hrProps" />
        <MenuItemCheckbox v-if="menuItemCheckboxProps !== null" v-bind="menuItemCheckboxProps">
          <Icon v-if="icon3Props !== null" v-bind="icon3Props" />
          <TextLabel v-if="textLabel5 && textLabel5Props" v-bind="textLabel5Props" />
        </MenuItemCheckbox>
        <MenuItemRadio v-if="menuItemRadioProps !== null" v-bind="menuItemRadioProps">
          <Icon v-if="icon4Props !== null" v-bind="icon4Props" />
          <TextLabel v-if="textLabel6 && textLabel6Props" v-bind="textLabel6Props" />
        </MenuItemRadio>
      </slot>
    </div>
</template>
