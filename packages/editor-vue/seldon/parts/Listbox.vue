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
 * List: box
 * Level: Part
 * Intent: Floating list of selectable options for a combobox or select.
 * Tags: listbox, options, select, combobox, part, overlay, UI
 * Type: Default
 *
 * @example
 * ```vue
 * <Listbox
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
import Icon from "../primitives/Icon.vue"
import ListboxOption from "../elements/ListboxOption.vue"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  listboxOption?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  listboxOption2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  listboxOption3?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "role": "listbox",
  "aria-hidden": "false",
  "className": "sdn-listbox",
  "listboxOption": {
    "role": "option",
    "aria-hidden": "false",
    "className": "sdn-listbox-option sdn-listbox-option--6dxl"
  },
  "icon": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--xohb"
  },
  "listboxOption2": {
    "role": "option",
    "aria-hidden": "false",
    "className": "sdn-listbox-option sdn-listbox-option--6dxl"
  },
  "icon2": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel2": {
    "className": "sdn-text-label sdn-text-label--xohb"
  },
  "listboxOption3": {
    "role": "option",
    "aria-hidden": "false",
    "className": "sdn-listbox-option sdn-listbox-option--6dxl"
  },
  "icon3": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel3": {
    "className": "sdn-text-label sdn-text-label--xohb"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-listbox", props.className))
const rootAttrs = { "role": sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const listboxOptionProps = computed(() => mergeSlot(sdn.listboxOption, props.listboxOption))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const listboxOption2Props = computed(() => mergeSlot(sdn.listboxOption2, props.listboxOption2))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2))
const textLabel2Props = computed(() => mergeSlot(sdn.textLabel2, props.textLabel2))
const listboxOption3Props = computed(() => mergeSlot(sdn.listboxOption3, props.listboxOption3))
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3))
const textLabel3Props = computed(() => mergeSlot(sdn.textLabel3, props.textLabel3))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <ListboxOption v-if="listboxOptionProps !== null" v-bind="listboxOptionProps">
          <Icon v-if="iconProps !== null" v-bind="iconProps" />
          <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
        </ListboxOption>
        <ListboxOption v-if="listboxOption2Props !== null" v-bind="listboxOption2Props">
          <Icon v-if="icon2Props !== null" v-bind="icon2Props" />
          <TextLabel v-if="textLabel2 && textLabel2Props" v-bind="textLabel2Props" />
        </ListboxOption>
        <ListboxOption v-if="listboxOption3Props !== null" v-bind="listboxOption3Props">
          <Icon v-if="icon3Props !== null" v-bind="icon3Props" />
          <TextLabel v-if="textLabel3 && textLabel3Props" v-bind="textLabel3Props" />
        </ListboxOption>
      </slot>
    </div>
</template>
