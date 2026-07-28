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
 * Fieldset: FieldsetRadioButtonFieldset
 * Level: Part
 * Intent: Generic form field grouping component schema used to logically separate sections within forms.
 * Tags: form, fieldset, ui, group, input, layout, section, fields
 * Type: Custom
 *
 * Structure:
 *   Legend                         legend
 *   FormControlRadioButtonControl  formControlRadioButtonControl
 *     InputRadioButton             inputRadioButton
 *     TextLabel                    textLabel
 *   FormControlRadioButtonControl  formControlRadioButtonControl2
 *     InputRadioButton             inputRadioButton2
 *     TextLabel                    textLabel2
 *   FormControlRadioButtonControl  formControlRadioButtonControl3
 *     InputRadioButton             inputRadioButton3
 *     TextLabel                    textLabel3
 *
 * @example
 * ```vue
 * <FieldsetRadioButtonFieldset
 *   aria-hidden="false"
 *   legend="{}"
 *   formControlRadioButtonControl="{}"
 *   inputRadioButton="{}"
 *   textLabel="{}"
 *   formControlRadioButtonControl2="{}"
 *   formControlRadioButtonControl3="{}"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot, mergeOptionalSlot } from "../utils/class-names"
import FormControlRadioButtonControl from "../elements/FormControlRadioButtonControl.vue"
import InputRadioButton from "../primitives/InputRadioButton.vue"
import Legend from "../primitives/Legend.vue"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  legend?: Record<string, unknown> | null
  formControlRadioButtonControl?: Record<string, unknown> | null
  inputRadioButton?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  formControlRadioButtonControl2?: Record<string, unknown> | null
  inputRadioButton2?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  formControlRadioButtonControl3?: Record<string, unknown> | null
  inputRadioButton3?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "legend": {
    "children": "Legend",
    "aria-hidden": "false",
    "className": "sdn-legend sdn-legend--o30d"
  },
  "formControlRadioButtonControl": {
    "aria-hidden": "false",
    "className": "sdn-form-control sdn-form-control--vmxp"
  },
  "inputRadioButton": {
    "className": "sdn-input-checkbox sdn-input-checkbox--vajr"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--a3jd"
  },
  "formControlRadioButtonControl2": {
    "aria-hidden": "false",
    "className": "sdn-form-control sdn-form-control--vmxp"
  },
  "inputRadioButton2": {
    "className": "sdn-input-checkbox sdn-input-checkbox--vajr"
  },
  "textLabel2": {
    "className": "sdn-text-label sdn-text-label--a3jd"
  },
  "formControlRadioButtonControl3": {
    "aria-hidden": "false",
    "className": "sdn-form-control sdn-form-control--vmxp"
  },
  "inputRadioButton3": {
    "className": "sdn-input-checkbox sdn-input-checkbox--vajr"
  },
  "textLabel3": {
    "className": "sdn-text-label sdn-text-label--a3jd"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-fieldset", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const legendProps = computed(() => mergeSlot(sdn.legend, props.legend, props.seldonRefs))
const formControlRadioButtonControlProps = computed(() => mergeSlot(sdn.formControlRadioButtonControl, props.formControlRadioButtonControl, props.seldonRefs))
const inputRadioButtonProps = computed(() => mergeOptionalSlot(sdn.inputRadioButton, props.inputRadioButton, props.seldonRefs))
const textLabelProps = computed(() => mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs))
const formControlRadioButtonControl2Props = computed(() => mergeSlot(sdn.formControlRadioButtonControl2, props.formControlRadioButtonControl2, props.seldonRefs))
const inputRadioButton2Props = computed(() => mergeOptionalSlot(sdn.inputRadioButton2, props.inputRadioButton2, props.seldonRefs))
const textLabel2Props = computed(() => mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs))
const formControlRadioButtonControl3Props = computed(() => mergeSlot(sdn.formControlRadioButtonControl3, props.formControlRadioButtonControl3, props.seldonRefs))
const inputRadioButton3Props = computed(() => mergeOptionalSlot(sdn.inputRadioButton3, props.inputRadioButton3, props.seldonRefs))
const textLabel3Props = computed(() => mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs))
</script>

<template>
    <fieldset :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Legend v-if="legendProps !== null" v-bind="legendProps" />
        <FormControlRadioButtonControl v-if="formControlRadioButtonControlProps !== null" v-bind="formControlRadioButtonControlProps">
          <InputRadioButton v-if="inputRadioButtonProps !== null" v-bind="inputRadioButtonProps" />
          <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
        </FormControlRadioButtonControl>
        <FormControlRadioButtonControl v-if="formControlRadioButtonControl2Props !== null" v-bind="formControlRadioButtonControl2Props">
          <InputRadioButton v-if="inputRadioButton2Props !== null" v-bind="inputRadioButton2Props" />
          <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
        </FormControlRadioButtonControl>
        <FormControlRadioButtonControl v-if="formControlRadioButtonControl3Props !== null" v-bind="formControlRadioButtonControl3Props">
          <InputRadioButton v-if="inputRadioButton3Props !== null" v-bind="inputRadioButton3Props" />
          <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
        </FormControlRadioButtonControl>
      </slot>
    </fieldset>
</template>
