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
 * Form Control: FormControlRadio
 * Level: Element
 * Intent: Captures plain text input from the user for forms or interactions.
 * Tags: UI, UI control, binary, boolean, checkbox, choice, control, decorated, dropdown, editable, exclusive, field, form, icon, input, menu, options, query, radio, search, select, single choice, text, toggle, user entry
 * Type: Inline
 *
 * Structure:
 *   TextLabel                        textLabel
 *   Frame                            frame
 *     FormControlRadioButtonControl  formControlRadioButtonControl
 *       InputRadioButton             inputRadioButton
 *       TextLabel                    textLabel2
 *     FormControlRadioButtonControl  formControlRadioButtonControl2
 *       InputRadioButton             inputRadioButton2
 *       TextLabel                    textLabel3
 *
 * @example
 * ```vue
 * <FormControlRadio
 *   aria-hidden="false"
 *   textLabel="{}"
 *   frame="{}"
 *   formControlRadioButtonControl="{}"
 *   inputRadioButton="{}"
 *   formControlRadioButtonControl2="{}"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import FormControlRadioButtonControl from "../elements/FormControlRadioButtonControl.vue"
import Frame from "../frames/Frame.vue"
import InputRadioButton from "../primitives/InputRadioButton.vue"
import TextLabel from "../primitives/TextLabel.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  textLabel?: Record<string, unknown> | null
  frame?: Record<string, unknown> | null
  formControlRadioButtonControl?: Record<string, unknown> | null
  inputRadioButton?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  formControlRadioButtonControl2?: Record<string, unknown> | null
  inputRadioButton2?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  textLabel: {
    children: "Label",
    className: "sdn-text-label sdn-text-label--fwkw",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--33uo",
  },
  formControlRadioButtonControl: {
    className: "sdn-form-control sdn-form-control-radio-button-control--0acl",
  },
  inputRadioButton: {
    placeholder: "Placeholder text",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel2: {
    children: "Yes",
    className: "sdn-text-label sdn-text-label--uqg6",
  },
  formControlRadioButtonControl2: {
    className: "sdn-form-control sdn-form-control-radio-button-control--0acl",
  },
  inputRadioButton2: {
    placeholder: "Placeholder text",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel3: {
    children: "No",
    className: "sdn-text-label sdn-text-label--uqg6",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-form-control", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const formControlRadioButtonControlProps = computed(() =>
  mergeOptionalSlot(
    sdn.formControlRadioButtonControl,
    props.formControlRadioButtonControl,
    props.seldonRefs,
  ),
)
const inputRadioButtonProps = computed(() =>
  mergeOptionalSlot(sdn.inputRadioButton, props.inputRadioButton, props.seldonRefs),
)
const textLabel2Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs),
)
const formControlRadioButtonControl2Props = computed(() =>
  mergeOptionalSlot(
    sdn.formControlRadioButtonControl2,
    props.formControlRadioButtonControl2,
    props.seldonRefs,
  ),
)
const inputRadioButton2Props = computed(() =>
  mergeOptionalSlot(sdn.inputRadioButton2, props.inputRadioButton2, props.seldonRefs),
)
const textLabel3Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs),
)
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
      <Frame v-bind="frameProps" v-if="frameProps !== null">
        <FormControlRadioButtonControl
          v-if="formControlRadioButtonControlProps !== null"
          v-bind="formControlRadioButtonControlProps"
        >
          <InputRadioButton v-if="inputRadioButtonProps !== null" v-bind="inputRadioButtonProps" />
          <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
        </FormControlRadioButtonControl>
        <FormControlRadioButtonControl
          v-if="formControlRadioButtonControl2Props !== null"
          v-bind="formControlRadioButtonControl2Props"
        >
          <InputRadioButton
            v-if="inputRadioButton2Props !== null"
            v-bind="inputRadioButton2Props"
          />
          <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
        </FormControlRadioButtonControl>
      </Frame>
    </slot>
  </div>
</template>
