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
 * Combobox: Combobox
 * Level: Part
 * Intent: Editable field paired with a listbox of options to choose from.
 * Tags: combobox, select, dropdown, input, part, UI
 * Type: Default
 *
 * Structure:
 *   ComboboxField   comboboxField
 *     Icon          icon
 *     Input         input
 *     ButtonIconic  buttonIconic
 *       Icon        icon2
 *
 * @example
 * ```vue
 * <Combobox
 *   aria-hidden="false"
 *   comboboxField="{}"
 *   icon="material-star"
 *   input="{}"
 *   buttonIconic={() => {}}
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import ComboboxField from "../elements/ComboboxField.vue"
import { combineClassNames, mergeOptionalSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  comboboxField?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  input?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  comboboxField: {
    className: "sdn-combobox-field sdn-combobox-field--z3a0",
  },
  icon: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--xi68",
  },
  input: {
    placeholder: "Placeholder text",
    className: "sdn-input sdn-input--yoqi",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon2: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--vsau",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-combobox", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const comboboxFieldProps = computed(() =>
  mergeOptionalSlot(sdn.comboboxField, props.comboboxField, props.seldonRefs),
)
const iconProps = computed(() => mergeOptionalSlot(sdn.icon, props.icon, props.seldonRefs))
const inputProps = computed(() => mergeOptionalSlot(sdn.input, props.input, props.seldonRefs))
const buttonIconicProps = computed(() =>
  mergeOptionalSlot(sdn.buttonIconic, props.buttonIconic, props.seldonRefs),
)
const icon2Props = computed(() => mergeOptionalSlot(sdn.icon2, props.icon2, props.seldonRefs))
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <ComboboxField
        v-if="comboboxFieldProps !== null"
        v-bind="comboboxFieldProps"
        :icon="iconProps"
        :input="inputProps"
        :buttonIconic="buttonIconicProps"
        :icon2="icon2Props"
      />
    </slot>
  </div>
</template>
