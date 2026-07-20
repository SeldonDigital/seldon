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
 * Form Control: FormControl
 * Level: Element
 * Intent: Captures plain text input from the user for forms or interactions.
 * Tags: UI, UI control, binary, boolean, checkbox, choice, control, decorated, dropdown, editable, exclusive, field, form, icon, input, menu, options, query, radio, search, select, single choice, text, toggle, user entry
 * Type: Default
 *
 * @example
 * ```vue
 * <FormControl
 *   aria-hidden="false"
 *   textLabel="{}"
 *   input="{}"
 * />
 * ```
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Input from "../primitives/Input.vue"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  textLabel?: Record<string, unknown> | null
  input?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-form-control",
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--fwkw"
  },
  "input": {
    "placeholder": "Placeholder text",
    "type": "text",
    "className": "sdn-input sdn-input--8ux3"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-form-control", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const inputProps = computed(() => mergeSlot(sdn.input, props.input))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
        <Input v-if="inputProps !== null" v-bind="inputProps" />
      </slot>
    </div>
</template>
