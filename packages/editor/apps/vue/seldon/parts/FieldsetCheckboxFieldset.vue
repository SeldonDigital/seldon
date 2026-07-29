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
 * Fieldset: FieldsetCheckboxFieldset
 * Level: Part
 * Intent: Generic form field grouping component schema used to logically separate sections within forms.
 * Tags: form, fieldset, ui, group, input, layout, section, fields
 * Type: Custom
 *
 * Structure:
 *   Legend                      legend
 *   FormControlCheckboxControl  formControlCheckboxControl
 *     InputCheckbox             inputCheckbox
 *     TextLabel                 textLabel
 *   FormControlCheckboxControl  formControlCheckboxControl2
 *     InputCheckbox             inputCheckbox2
 *     TextLabel                 textLabel2
 *   FormControlCheckboxControl  formControlCheckboxControl3
 *     InputCheckbox             inputCheckbox3
 *     TextLabel                 textLabel3
 *
 * @example
 * ```vue
 * <FieldsetCheckboxFieldset
 *   aria-hidden="false"
 *   legend="{}"
 *   formControlCheckboxControl="{}"
 *   inputCheckbox="{}"
 *   textLabel="{}"
 *   formControlCheckboxControl2="{}"
 *   formControlCheckboxControl3="{}"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import FormControlCheckboxControl from "../elements/FormControlCheckboxControl.vue"
import InputCheckbox from "../primitives/InputCheckbox.vue"
import Legend from "../primitives/Legend.vue"
import TextLabel from "../primitives/TextLabel.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  legend?: Record<string, unknown> | null
  formControlCheckboxControl?: Record<string, unknown> | null
  inputCheckbox?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  formControlCheckboxControl2?: Record<string, unknown> | null
  inputCheckbox2?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  formControlCheckboxControl3?: Record<string, unknown> | null
  inputCheckbox3?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  legend: {
    children: "Legend",
    "aria-hidden": "false",
    className: "sdn-legend sdn-legend--o30d",
  },
  formControlCheckboxControl: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--vmxp",
  },
  inputCheckbox: {
    placeholder: "Placeholder text",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel: {
    children: "Label",
    className: "sdn-text-label sdn-text-label--a3jd",
  },
  formControlCheckboxControl2: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--vmxp",
  },
  inputCheckbox2: {
    placeholder: "Placeholder text",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel2: {
    children: "Label",
    className: "sdn-text-label sdn-text-label--a3jd",
  },
  formControlCheckboxControl3: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--vmxp",
  },
  inputCheckbox3: {
    placeholder: "Placeholder text",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel3: {
    children: "Label",
    className: "sdn-text-label sdn-text-label--a3jd",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-fieldset", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const legendProps = computed(() => mergeSlot(sdn.legend, props.legend, props.seldonRefs))
const formControlCheckboxControlProps = computed(() =>
  mergeSlot(sdn.formControlCheckboxControl, props.formControlCheckboxControl, props.seldonRefs),
)
const inputCheckboxProps = computed(() =>
  mergeOptionalSlot(sdn.inputCheckbox, props.inputCheckbox, props.seldonRefs),
)
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const formControlCheckboxControl2Props = computed(() =>
  mergeSlot(sdn.formControlCheckboxControl2, props.formControlCheckboxControl2, props.seldonRefs),
)
const inputCheckbox2Props = computed(() =>
  mergeOptionalSlot(sdn.inputCheckbox2, props.inputCheckbox2, props.seldonRefs),
)
const textLabel2Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs),
)
const formControlCheckboxControl3Props = computed(() =>
  mergeSlot(sdn.formControlCheckboxControl3, props.formControlCheckboxControl3, props.seldonRefs),
)
const inputCheckbox3Props = computed(() =>
  mergeOptionalSlot(sdn.inputCheckbox3, props.inputCheckbox3, props.seldonRefs),
)
const textLabel3Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs),
)
</script>

<template>
  <fieldset :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Legend v-if="legendProps !== null" v-bind="legendProps" />
      <FormControlCheckboxControl
        v-if="formControlCheckboxControlProps !== null"
        v-bind="formControlCheckboxControlProps"
      >
        <InputCheckbox v-if="inputCheckboxProps !== null" v-bind="inputCheckboxProps" />
        <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
      </FormControlCheckboxControl>
      <FormControlCheckboxControl
        v-if="formControlCheckboxControl2Props !== null"
        v-bind="formControlCheckboxControl2Props"
      >
        <InputCheckbox v-if="inputCheckbox2Props !== null" v-bind="inputCheckbox2Props" />
        <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
      </FormControlCheckboxControl>
      <FormControlCheckboxControl
        v-if="formControlCheckboxControl3Props !== null"
        v-bind="formControlCheckboxControl3Props"
      >
        <InputCheckbox v-if="inputCheckbox3Props !== null" v-bind="inputCheckbox3Props" />
        <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
      </FormControlCheckboxControl>
    </slot>
  </fieldset>
</template>
