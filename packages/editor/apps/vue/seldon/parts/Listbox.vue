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
 * List: box
 * Level: Part
 * Intent: Floating list of selectable options for a combobox or select.
 * Tags: listbox, options, select, combobox, part, overlay, UI
 * Type: Default
 *
 * Structure:
 *   ListboxOption  listboxOption
 *     Icon         icon
 *     TextLabel    textLabel
 *   ListboxOption  listboxOption2
 *     Icon         icon2
 *     TextLabel    textLabel2
 *   ListboxOption  listboxOption3
 *     Icon         icon3
 *     TextLabel    textLabel3
 *
 * @example
 * ```vue
 * <Listbox
 *   role="listbox"
 *   aria-hidden="false"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot, mergeOptionalSlot } from "../utils/class-names"
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
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "role": "listbox",
  "aria-hidden": "false",
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
    "children": "Option",
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
    "children": "Option",
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
    "children": "Option",
    "className": "sdn-text-label sdn-text-label--xohb"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-listbox", props.className))
const rootAttrs = { "role": sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const listboxOptionProps = computed(() => mergeSlot(sdn.listboxOption, props.listboxOption, props.seldonRefs))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const textLabelProps = computed(() => mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs))
const listboxOption2Props = computed(() => mergeSlot(sdn.listboxOption2, props.listboxOption2, props.seldonRefs))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2, props.seldonRefs))
const textLabel2Props = computed(() => mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs))
const listboxOption3Props = computed(() => mergeSlot(sdn.listboxOption3, props.listboxOption3, props.seldonRefs))
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3, props.seldonRefs))
const textLabel3Props = computed(() => mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <ListboxOption v-if="listboxOptionProps !== null" v-bind="listboxOptionProps">
          <Icon v-if="iconProps !== null" v-bind="iconProps" />
          <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
        </ListboxOption>
        <ListboxOption v-if="listboxOption2Props !== null" v-bind="listboxOption2Props">
          <Icon v-if="icon2Props !== null" v-bind="icon2Props" />
          <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
        </ListboxOption>
        <ListboxOption v-if="listboxOption3Props !== null" v-bind="listboxOption3Props">
          <Icon v-if="icon3Props !== null" v-bind="icon3Props" />
          <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
        </ListboxOption>
      </slot>
    </div>
</template>
