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
 * Fieldset: Fieldset
 * Level: Part
 * Intent: Generic form field grouping component schema used to logically separate sections within forms.
 * Tags: form, fieldset, ui, group, input, layout, section, fields
 * Type: Default
 *
 * Structure:
 *   Legend                      legend
 *   FormControl                 formControl
 *     TextLabel                 textLabel
 *     Input                     input
 *   FormControl                 formControl2
 *     TextLabel                 textLabel2
 *     Input                     input2
 *   FormControlDropdownControl  formControlDropdownControl
 *     TextLabel                 textLabel3
 *     Select                    select
 *       TextOption              textOption
 *       TextOption              textOption2
 *       TextOption              textOption3
 *
 * @example
 * ```vue
 * <Fieldset
 *   aria-hidden="false"
 *   legend="{}"
 *   formControl="{}"
 *   textLabel="{}"
 *   input="{}"
 *   formControl2="{}"
 *   formControlDropdownControl3="{}"
 *   select="{}"
 *   textOption="{}"
 *   textOption2="{}"
 *   textOption3="{}"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import FormControl from "../elements/FormControl.vue"
import FormControlDropdownControl from "../elements/FormControlDropdownControl.vue"
import Select from "../elements/Select.vue"
import Input from "../primitives/Input.vue"
import Legend from "../primitives/Legend.vue"
import TextLabel from "../primitives/TextLabel.vue"
import TextOption from "../primitives/TextOption.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  legend?: Record<string, unknown> | null
  formControl?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  input?: Record<string, unknown> | null
  formControl2?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  input2?: Record<string, unknown> | null
  formControlDropdownControl?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  select?: Record<string, unknown> | null
  textOption?: Record<string, unknown> | null
  textOption2?: Record<string, unknown> | null
  textOption3?: Record<string, unknown> | null
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
  formControl: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--vmxp",
  },
  textLabel: {
    children: "Label",
    className: "sdn-text-label sdn-text-label--u1gw",
  },
  input: {
    placeholder: "Placeholder text",
    type: "text",
    className: "sdn-input sdn-input--ahdh",
  },
  formControl2: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--vmxp",
  },
  textLabel2: {
    children: "Label",
    className: "sdn-text-label sdn-text-label--u1gw",
  },
  input2: {
    placeholder: "Placeholder text",
    type: "text",
    className: "sdn-input sdn-input--ahdh",
  },
  formControlDropdownControl: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--vmxp",
  },
  textLabel3: {
    children: "Label",
    className: "sdn-text-label sdn-text-label--u1gw",
  },
  select: {
    "aria-hidden": "false",
    className: "sdn-select sdn-select--7bom",
  },
  textOption: {
    children: "Option 01",
    className: "sdn-text-option sdn-text-title--drqy",
  },
  textOption2: {
    children: "Option 02",
    className: "sdn-text-option sdn-text-title--drqy",
  },
  textOption3: {
    children: "Option 03",
    className: "sdn-text-option sdn-text-title--drqy",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-fieldset", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const legendProps = computed(() => mergeSlot(sdn.legend, props.legend, props.seldonRefs))
const formControlProps = computed(() =>
  mergeSlot(sdn.formControl, props.formControl, props.seldonRefs),
)
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const inputProps = computed(() => mergeSlot(sdn.input, props.input, props.seldonRefs))
const formControl2Props = computed(() =>
  mergeSlot(sdn.formControl2, props.formControl2, props.seldonRefs),
)
const textLabel2Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs),
)
const input2Props = computed(() => mergeSlot(sdn.input2, props.input2, props.seldonRefs))
const formControlDropdownControlProps = computed(() =>
  mergeSlot(sdn.formControlDropdownControl, props.formControlDropdownControl, props.seldonRefs),
)
const textLabel3Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs),
)
const selectProps = computed(() => mergeSlot(sdn.select, props.select, props.seldonRefs))
const textOptionProps = computed(() =>
  mergeOptionalSlot(sdn.textOption, props.textOption, props.seldonRefs),
)
const textOption2Props = computed(() =>
  mergeOptionalSlot(sdn.textOption2, props.textOption2, props.seldonRefs),
)
const textOption3Props = computed(() =>
  mergeOptionalSlot(sdn.textOption3, props.textOption3, props.seldonRefs),
)
</script>

<template>
  <fieldset :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Legend v-if="legendProps !== null" v-bind="legendProps" />
      <FormControl v-if="formControlProps !== null" v-bind="formControlProps">
        <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
        <Input v-if="inputProps !== null" v-bind="inputProps" />
      </FormControl>
      <FormControl v-if="formControl2Props !== null" v-bind="formControl2Props">
        <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
        <Input v-if="input2Props !== null" v-bind="input2Props" />
      </FormControl>
      <FormControlDropdownControl
        v-if="formControlDropdownControlProps !== null"
        v-bind="formControlDropdownControlProps"
      >
        <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
        <Select v-if="selectProps !== null" v-bind="selectProps">
          <TextOption v-if="textOptionProps !== null" v-bind="textOptionProps" />
          <TextOption v-if="textOption2Props !== null" v-bind="textOption2Props" />
          <TextOption v-if="textOption3Props !== null" v-bind="textOption3Props" />
        </Select>
      </FormControlDropdownControl>
    </slot>
  </fieldset>
</template>
