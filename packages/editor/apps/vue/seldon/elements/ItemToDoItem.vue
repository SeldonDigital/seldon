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
 * Item: ItemToDoItem
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Custom
 *
 * Structure:
 *   InputCheckbox  inputCheckbox
 *   TextLabel      textLabel
 *   Chip           chip
 *     Icon         icon
 *     TextLabel    textLabel2
 *   Chip           chip2
 *     Icon         icon2
 *     TextLabel    textLabel3
 *   Chip           chip3
 *     TextLabel    textLabel4
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
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import Chip from "../elements/Chip.vue"
import Icon from "../primitives/Icon.vue"
import InputCheckbox from "../primitives/InputCheckbox.vue"
import TextLabel from "../primitives/TextLabel.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

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
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  inputCheckbox: {
    placeholder: "Placeholder text",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel: {
    children: "Label",
    className: "sdn-text-label sdn-text--s4kj",
  },
  chip: {
    "aria-hidden": "false",
    className: "sdn-chip sdn-chip--o0xb",
  },
  icon: {
    icon: "seldon-plus",
    className: "sdn-icon sdn-icon--eyw9",
  },
  textLabel2: {
    children: "Add",
    className: "sdn-text-label sdn-text-label--lug5",
  },
  chip2: {
    "aria-hidden": "false",
    className: "sdn-chip sdn-chip--o0xb",
  },
  icon2: {
    icon: "seldon-minus",
    className: "sdn-icon sdn-icon--eyw9",
  },
  textLabel3: {
    children: "Remove",
    className: "sdn-text-label sdn-text-label--lug5",
  },
  chip3: {
    "aria-hidden": "false",
    className: "sdn-chip sdn-chip--o0xb",
  },
  textLabel4: {
    children: "999",
    className: "sdn-text-label sdn-text-label--lug5",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-item", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const inputCheckboxProps = computed(() =>
  mergeOptionalSlot(sdn.inputCheckbox, props.inputCheckbox, props.seldonRefs),
)
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const chipProps = computed(() => mergeSlot(sdn.chip, props.chip, props.seldonRefs))
const iconProps = computed(() => mergeOptionalSlot(sdn.icon, props.icon, props.seldonRefs))
const textLabel2Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs),
)
const chip2Props = computed(() => mergeSlot(sdn.chip2, props.chip2, props.seldonRefs))
const icon2Props = computed(() => mergeOptionalSlot(sdn.icon2, props.icon2, props.seldonRefs))
const textLabel3Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs),
)
const chip3Props = computed(() => mergeSlot(sdn.chip3, props.chip3, props.seldonRefs))
const textLabel4Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel4, props.textLabel4, props.seldonRefs),
)
</script>

<template>
  <li :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <InputCheckbox v-if="inputCheckboxProps !== null" v-bind="inputCheckboxProps" />
      <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
      <Chip v-if="chipProps !== null" v-bind="chipProps">
        <Icon v-if="iconProps !== null" v-bind="iconProps" />
        <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
      </Chip>
      <Chip v-if="chip2Props !== null" v-bind="chip2Props">
        <Icon v-if="icon2Props !== null" v-bind="icon2Props" />
        <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
      </Chip>
      <Chip v-if="chip3Props !== null" v-bind="chip3Props">
        <TextLabel v-if="textLabel4Props !== null" v-bind="textLabel4Props" />
      </Chip>
    </slot>
  </li>
</template>
