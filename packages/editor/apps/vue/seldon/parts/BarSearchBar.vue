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
 * Bar: BarSearchBar
 * Level: Part
 * Intent: Groups related controls in a horizontal bar with buttons, navigation, or tabs layouts.
 * Tags: bar, controls, buttons, navigation, tabs, UI, layout, group
 * Type: Custom
 *
 * @example
 * ```vue
 * <BarSearchBar
 *   aria-hidden="false"
 *   comboboxFieldSearch="{}"
 *   icon="material-star"
 *   input="{}"
 *   buttonIconic={() => {}}
 * />
 * ```
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import ComboboxFieldSearch from "../elements/ComboboxFieldSearch.vue"

const props = defineProps<{
  className?: string
  comboboxFieldSearch?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  input?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-bar",
  "comboboxFieldSearch": {
    "aria-hidden": "false",
    "className": "sdn-combobox-field-search sdn-combobox-field-search--vbyg"
  },
  "icon": {
    "icon": "material-search",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--ucf5"
  },
  "input": {
    "placeholder": "Search for...",
    "type": "text",
    "role": "combobox",
    "aria-haspopup": "listbox",
    "className": "sdn-input sdn-input--stob"
  },
  "buttonIconic": {
    "className": "sdn-button-iconic sdn-button-iconic--pgsr"
  },
  "icon2": {
    "icon": "material-close",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--rezm"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-bar", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const comboboxFieldSearchProps = computed(() => mergeSlot(sdn.comboboxFieldSearch, props.comboboxFieldSearch))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const inputProps = computed(() => mergeSlot(sdn.input, props.input))
const buttonIconicProps = computed(() => mergeSlot(sdn.buttonIconic, props.buttonIconic))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <ComboboxFieldSearch v-if="comboboxFieldSearchProps !== null" v-bind="comboboxFieldSearchProps" :icon="iconProps" :input="inputProps" :buttonIconic="buttonIconicProps" :icon2="icon2Props" />
      </slot>
    </div>
</template>
