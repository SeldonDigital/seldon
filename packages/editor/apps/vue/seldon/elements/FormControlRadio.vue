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
 * Form Control: FormControlRadio
 * Level: Element
 * Intent: Captures plain text input from the user for forms or interactions.
 * Tags: UI, UI control, binary, boolean, checkbox, choice, control, decorated, dropdown, editable, exclusive, field, form, icon, input, menu, options, query, radio, search, select, single choice, text, toggle, user entry
 * Type: Inline
 *
 * Structure:
 *   TextLabel        textLabel
 *   Frame            frame
 *     MenuItemRadio  menuItemRadio
 *       Icon         icon
 *       TextLabel    textLabel2
 *     MenuItemRadio  menuItemRadio2
 *       Icon         icon2
 *       TextLabel    textLabel3
 *
 * @example
 * ```vue
 * <FormControlRadio
 *   aria-hidden="false"
 *   textLabel="{}"
 *   frame="{}"
 *   menuItemRadio="{}"
 *   icon="material-star"
 *   menuItemRadio2="{}"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"
import Frame from "../frames/Frame.vue"
import Icon from "../primitives/Icon.vue"
import MenuItemRadio from "../elements/MenuItemRadio.vue"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  textLabel?: Record<string, unknown> | null
  frame?: Record<string, unknown> | null
  menuItemRadio?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  menuItemRadio2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "textLabel": {
    "children": "Label",
    "className": "sdn-text-label sdn-text-label--fwkw"
  },
  "frame": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--pgac"
  },
  "menuItemRadio": {
    "className": "sdn-menu-item sdn-menu-item-radio--mezf"
  },
  "icon": {
    "icon": "material-radioButtonChecked",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel2": {
    "children": "Yes",
    "className": "sdn-text-label sdn-text-label--xohb"
  },
  "menuItemRadio2": {
    "className": "sdn-menu-item sdn-menu-item-radio--mezf"
  },
  "icon2": {
    "icon": "material-radioButtonChecked",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel3": {
    "children": "No",
    "className": "sdn-text-label sdn-text-label--xohb"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-form-control", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const textLabelProps = computed(() => mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs))
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const menuItemRadioProps = computed(() => mergeOptionalSlot(sdn.menuItemRadio, props.menuItemRadio, props.seldonRefs))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const textLabel2Props = computed(() => mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs))
const menuItemRadio2Props = computed(() => mergeOptionalSlot(sdn.menuItemRadio2, props.menuItemRadio2, props.seldonRefs))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2, props.seldonRefs))
const textLabel3Props = computed(() => mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
        <Frame v-bind="frameProps" v-if="frameProps !== null">
          <MenuItemRadio v-if="menuItemRadioProps !== null" v-bind="menuItemRadioProps">
            <Icon v-if="iconProps !== null" v-bind="iconProps" />
            <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
          </MenuItemRadio>
          <MenuItemRadio v-if="menuItemRadio2Props !== null" v-bind="menuItemRadio2Props">
            <Icon v-if="icon2Props !== null" v-bind="icon2Props" />
            <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
          </MenuItemRadio>
        </Frame>
      </slot>
    </div>
</template>
