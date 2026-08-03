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
 * Part: TokenControlsSpacing
 * Level: Part
 * Intent: HUD like controls for adjusting related properties directly on the canvas
 * Tags:
 * Type: Custom
 *
 * Structure:
 *   FormControlCombobox  formControlCombobox
 *     ComboboxField      comboboxField
 *       Icon             icon
 *       Input            input
 *       ButtonIconic     buttonIconic
 *         Icon           icon2
 *   FormControlCombobox  formControlCombobox2
 *     ComboboxField      comboboxField2
 *       Icon             icon3
 *       Input            input2
 *       ButtonIconic     buttonIconic2
 *         Icon           icon4
 *   FormControlCombobox  formControlCombobox3
 *     ComboboxField      comboboxField3
 *       Icon             icon5
 *       Input            input3
 *       ButtonIconic     buttonIconic3
 *         Icon           icon6
 *
 * @example
 * ```vue
 * <TokenControlsSpacing
 *   aria-hidden="false"
 *   formControlCombobox="{}"
 *   comboboxField="{}"
 *   icon="material-star"
 *   input="{}"
 *   buttonIconic={() => {}}
 *   formControlCombobox2="{}"
 *   formControlCombobox3="{}"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import FormControlCombobox from "../elements/FormControlCombobox.vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  formControlCombobox?: Record<string, unknown> | null
  comboboxField?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  input?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  formControlCombobox2?: Record<string, unknown> | null
  comboboxField2?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  input2?: Record<string, unknown> | null
  buttonIconic2?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  formControlCombobox3?: Record<string, unknown> | null
  comboboxField3?: Record<string, unknown> | null
  icon5?: Record<string, unknown> | null
  input3?: Record<string, unknown> | null
  buttonIconic3?: Record<string, unknown> | null
  icon6?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  formControlCombobox: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-combobox--ujby",
  },
  comboboxField: {
    "aria-hidden": "false",
    className: "sdn-combobox-field sdn-combobox-field--2lb1",
  },
  icon: {
    icon: "material-padding",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rdh1",
  },
  input: {
    placeholder: "Placeholder text",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--iocq",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon2: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--qwbk",
  },
  formControlCombobox2: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-combobox--ujby",
  },
  comboboxField2: {
    "aria-hidden": "false",
    className: "sdn-combobox-field sdn-combobox-field--2lb1",
  },
  icon3: {
    icon: "seldon-gap",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rdh1",
  },
  input2: {
    placeholder: "Placeholder text",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--iocq",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon4: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--qwbk",
  },
  formControlCombobox3: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-combobox--ujby",
  },
  comboboxField3: {
    "aria-hidden": "false",
    className: "sdn-combobox-field sdn-combobox-field--2lb1",
  },
  icon5: {
    icon: "material-margin",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rdh1",
  },
  input3: {
    placeholder: "Placeholder text",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--iocq",
  },
  buttonIconic3: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon6: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--qwbk",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-token-controls", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const formControlComboboxProps = computed(() =>
  mergeSlot(sdn.formControlCombobox, props.formControlCombobox, props.seldonRefs),
)
const comboboxFieldProps = computed(() =>
  mergeSlot(sdn.comboboxField, props.comboboxField, props.seldonRefs),
)
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const inputProps = computed(() => mergeSlot(sdn.input, props.input, props.seldonRefs))
const buttonIconicProps = computed(() =>
  mergeSlot(sdn.buttonIconic, props.buttonIconic, props.seldonRefs),
)
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2, props.seldonRefs))
const formControlCombobox2Props = computed(() =>
  mergeSlot(sdn.formControlCombobox2, props.formControlCombobox2, props.seldonRefs),
)
const comboboxField2Props = computed(() =>
  mergeSlot(sdn.comboboxField2, props.comboboxField2, props.seldonRefs),
)
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3, props.seldonRefs))
const input2Props = computed(() => mergeSlot(sdn.input2, props.input2, props.seldonRefs))
const buttonIconic2Props = computed(() =>
  mergeSlot(sdn.buttonIconic2, props.buttonIconic2, props.seldonRefs),
)
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4, props.seldonRefs))
const formControlCombobox3Props = computed(() =>
  mergeSlot(sdn.formControlCombobox3, props.formControlCombobox3, props.seldonRefs),
)
const comboboxField3Props = computed(() =>
  mergeSlot(sdn.comboboxField3, props.comboboxField3, props.seldonRefs),
)
const icon5Props = computed(() => mergeSlot(sdn.icon5, props.icon5, props.seldonRefs))
const input3Props = computed(() => mergeSlot(sdn.input3, props.input3, props.seldonRefs))
const buttonIconic3Props = computed(() =>
  mergeSlot(sdn.buttonIconic3, props.buttonIconic3, props.seldonRefs),
)
const icon6Props = computed(() => mergeSlot(sdn.icon6, props.icon6, props.seldonRefs))
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <FormControlCombobox
        v-if="formControlComboboxProps !== null"
        v-bind="formControlComboboxProps"
        :comboboxField="comboboxFieldProps"
        :icon="iconProps"
        :input="inputProps"
        :buttonIconic="buttonIconicProps"
        :icon2="icon2Props"
        :textLabel="null"
      />
      <FormControlCombobox
        v-if="formControlCombobox2Props !== null"
        v-bind="formControlCombobox2Props"
        :comboboxField="comboboxField2Props"
        :icon="icon3Props"
        :input="input2Props"
        :buttonIconic="buttonIconic2Props"
        :icon2="icon4Props"
        :textLabel="null"
      />
      <FormControlCombobox
        v-if="formControlCombobox3Props !== null"
        v-bind="formControlCombobox3Props"
        :comboboxField="comboboxField3Props"
        :icon="icon5Props"
        :input="input3Props"
        :buttonIconic="buttonIconic3Props"
        :icon2="icon6Props"
        :textLabel="null"
      />
    </slot>
  </div>
</template>
