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
 * Form Control: FormControlRadioButtonControl
 * Level: Element
 * Intent: Captures plain text input from the user for forms or interactions.
 * Tags: UI, UI control, binary, boolean, checkbox, choice, control, decorated, dropdown, editable, exclusive, field, form, icon, input, menu, options, query, radio, search, select, single choice, text, toggle, user entry
 * Type: Custom
 *
 * Structure:
 *   InputRadioButton  inputRadioButton
 *   TextLabel         textLabel
 *
 * @example
 * ```vue
 * <FormControlRadioButtonControl
 *   aria-hidden="false"
 *   inputRadioButton="{}"
 *   textLabel="{}"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import InputRadioButton from "../primitives/InputRadioButton.vue"
import TextLabel from "../primitives/TextLabel.vue"
import { combineClassNames, mergeOptionalSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  inputRadioButton?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  inputRadioButton: {
    placeholder: "Placeholder text",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel: {
    children: "Label",
    className: "sdn-text-label sdn-text-label--o9nd",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-form-control", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const inputRadioButtonProps = computed(() =>
  mergeOptionalSlot(sdn.inputRadioButton, props.inputRadioButton, props.seldonRefs),
)
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <InputRadioButton v-if="inputRadioButtonProps !== null" v-bind="inputRadioButtonProps" />
      <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
    </slot>
  </div>
</template>
