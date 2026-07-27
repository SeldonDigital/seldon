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
 * Item: ItemToDoItem
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Custom
 *
 * @example
 * ```vue
 * <ItemToDoItem
 *   aria-hidden="false"
 *   inputCheckbox="{}"
 *   textLabel="{}"
 *   chip="{}"
 *   icon="material-star"
 *   chip2="{}"
 *   chip3="{}"
 * />
 * ```
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Chip from "../elements/Chip.vue"
import Icon from "../primitives/Icon.vue"
import InputCheckbox from "../primitives/InputCheckbox.vue"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  inputCheckbox?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  chip?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  chip2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  chip3?: Record<string, unknown> | null
  textLabel4?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-item",
  "inputCheckbox": {
    "className": "sdn-input-checkbox sdn-input-checkbox--vajr"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text--s4kj"
  },
  "chip": {
    "aria-hidden": "false",
    "className": "sdn-chip sdn-chip--o0xb"
  },
  "icon": {
    "className": "sdn-icon sdn-icon--eyw9"
  },
  "textLabel2": {
    "className": "sdn-text-label sdn-text-label--lug5"
  },
  "chip2": {
    "aria-hidden": "false",
    "className": "sdn-chip sdn-chip--o0xb"
  },
  "icon2": {
    "className": "sdn-icon sdn-icon--eyw9"
  },
  "textLabel3": {
    "className": "sdn-text-label sdn-text-label--lug5"
  },
  "chip3": {
    "aria-hidden": "false",
    "className": "sdn-chip sdn-chip--o0xb"
  },
  "textLabel4": {
    "className": "sdn-text-label sdn-text-label--lug5"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-item", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const inputCheckboxProps = computed(() => mergeSlot(sdn.inputCheckbox, props.inputCheckbox))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const chipProps = computed(() => mergeSlot(sdn.chip, props.chip))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const textLabel2Props = computed(() => mergeSlot(sdn.textLabel2, props.textLabel2))
const chip2Props = computed(() => mergeSlot(sdn.chip2, props.chip2))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2))
const textLabel3Props = computed(() => mergeSlot(sdn.textLabel3, props.textLabel3))
const chip3Props = computed(() => mergeSlot(sdn.chip3, props.chip3))
const textLabel4Props = computed(() => mergeSlot(sdn.textLabel4, props.textLabel4))
</script>

<template>
    <li :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <InputCheckbox v-if="inputCheckbox && inputCheckboxProps" v-bind="inputCheckboxProps" />
        <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
        <Chip v-if="chipProps !== null" v-bind="chipProps">
          <Icon v-if="icon && iconProps" v-bind="iconProps" />
          <TextLabel v-if="textLabel2 && textLabel2Props" v-bind="textLabel2Props" />
        </Chip>
        <Chip v-if="chip2Props !== null" v-bind="chip2Props">
          <Icon v-if="icon2 && icon2Props" v-bind="icon2Props" />
          <TextLabel v-if="textLabel3 && textLabel3Props" v-bind="textLabel3Props" />
        </Chip>
        <Chip v-if="chip3Props !== null" v-bind="chip3Props">
          <TextLabel v-if="textLabel4 && textLabel4Props" v-bind="textLabel4Props" />
        </Chip>
      </slot>
    </li>
</template>
