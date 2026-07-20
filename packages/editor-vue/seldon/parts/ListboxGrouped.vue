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
 * List: boxGrouped
 * Level: Part
 * Intent: Floating list of selectable options for a combobox or select.
 * Tags: listbox, options, select, combobox, part, overlay, UI
 * Type: Inline
 *
 * @example
 * ```vue
 * <ListboxGrouped
 *   role="listbox"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Frame from "../frames/Frame.vue"
import Hr from "../primitives/Hr.vue"
import Icon from "../primitives/Icon.vue"
import ListboxOption from "../elements/ListboxOption.vue"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  listboxOption?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  listboxOption2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  hr?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  textLabel4?: Record<string, unknown> | null
  listboxOption3?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  textLabel5?: Record<string, unknown> | null
  listboxOption4?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  textLabel6?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "role": "listbox",
  "aria-hidden": "false",
  "className": "sdn-listbox",
  "frame": {
    "wrapperElement": "div",
    "role": "group",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--6o7x"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--oqkb"
  },
  "listboxOption": {
    "className": "sdn-listbox-option sdn-listbox-option--6dxl"
  },
  "icon": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel2": {
    "className": "sdn-text-label sdn-text-label--xohb"
  },
  "listboxOption2": {
    "className": "sdn-listbox-option sdn-listbox-option--6dxl"
  },
  "icon2": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel3": {
    "className": "sdn-text-label sdn-text-label--xohb"
  },
  "hr": {
    "aria-hidden": "false",
    "className": "sdn-hr sdn-hr--xtig"
  },
  "frame2": {
    "wrapperElement": "div",
    "role": "group",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--6o7x"
  },
  "textLabel4": {
    "className": "sdn-text-label sdn-text-label--ptvk"
  },
  "listboxOption3": {
    "className": "sdn-listbox-option sdn-listbox-option--6dxl"
  },
  "icon3": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel5": {
    "className": "sdn-text-label sdn-text-label--xohb"
  },
  "listboxOption4": {
    "className": "sdn-listbox-option sdn-listbox-option--6dxl"
  },
  "icon4": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel6": {
    "className": "sdn-text-label sdn-text-label--xohb"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-listbox", props.className))
const rootAttrs = { "role": sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const listboxOptionProps = computed(() => mergeSlot(sdn.listboxOption, props.listboxOption))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const textLabel2Props = computed(() => mergeSlot(sdn.textLabel2, props.textLabel2))
const listboxOption2Props = computed(() => mergeSlot(sdn.listboxOption2, props.listboxOption2))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2))
const textLabel3Props = computed(() => mergeSlot(sdn.textLabel3, props.textLabel3))
const hrProps = computed(() => mergeSlot(sdn.hr, props.hr))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2))
const textLabel4Props = computed(() => mergeSlot(sdn.textLabel4, props.textLabel4))
const listboxOption3Props = computed(() => mergeSlot(sdn.listboxOption3, props.listboxOption3))
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3))
const textLabel5Props = computed(() => mergeSlot(sdn.textLabel5, props.textLabel5))
const listboxOption4Props = computed(() => mergeSlot(sdn.listboxOption4, props.listboxOption4))
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4))
const textLabel6Props = computed(() => mergeSlot(sdn.textLabel6, props.textLabel6))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Frame v-bind="frameProps">
          <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
          <ListboxOption v-if="listboxOption && listboxOptionProps" v-bind="listboxOptionProps">
            <Icon v-if="iconProps !== null" v-bind="iconProps" />
            <TextLabel v-if="textLabel2 && textLabel2Props" v-bind="textLabel2Props" />
          </ListboxOption>
          <ListboxOption v-if="listboxOption2 && listboxOption2Props" v-bind="listboxOption2Props">
            <Icon v-if="icon2Props !== null" v-bind="icon2Props" />
            <TextLabel v-if="textLabel3 && textLabel3Props" v-bind="textLabel3Props" />
          </ListboxOption>
        </Frame>
        <Hr v-if="hrProps !== null" v-bind="hrProps" />
        <Frame v-bind="frame2Props">
          <TextLabel v-if="textLabel4 && textLabel4Props" v-bind="textLabel4Props" />
          <ListboxOption v-if="listboxOption3 && listboxOption3Props" v-bind="listboxOption3Props">
            <Icon v-if="icon3Props !== null" v-bind="icon3Props" />
            <TextLabel v-if="textLabel5 && textLabel5Props" v-bind="textLabel5Props" />
          </ListboxOption>
          <ListboxOption v-if="listboxOption4 && listboxOption4Props" v-bind="listboxOption4Props">
            <Icon v-if="icon4Props !== null" v-bind="icon4Props" />
            <TextLabel v-if="textLabel6 && textLabel6Props" v-bind="textLabel6Props" />
          </ListboxOption>
        </Frame>
      </slot>
    </div>
</template>
