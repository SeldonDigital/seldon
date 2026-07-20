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
 * Combobox Field: ComboboxField
 * Level: Element
 * Intent: Field box that holds the combobox input and opens its listbox.
 * Tags: combobox, trigger, input, field, select, element, UI
 * Type: Default
 *
 * @example
 * ```vue
 * <ComboboxField
 *   aria-hidden="false"
 *   icon="material-star"
 *   input="{}"
 *   buttonIconic={() => {}}
 * />
 * ```
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import ButtonIconic from "../elements/ButtonIconic.vue"
import Icon from "../primitives/Icon.vue"
import Input from "../primitives/Input.vue"

const props = defineProps<{
  className?: string
  icon?: Record<string, unknown> | null
  input?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-combobox-field",
  "icon": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--xi68"
  },
  "input": {
    "placeholder": "Placeholder text",
    "type": "text",
    "role": "combobox",
    "aria-haspopup": "listbox",
    "className": "sdn-input sdn-input--yoqi"
  },
  "buttonIconic": {
    "className": "sdn-button-iconic sdn-button-iconic--pgsr"
  },
  "icon2": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--vsau"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-combobox-field", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const inputProps = computed(() => mergeSlot(sdn.input, props.input))
const buttonIconicProps = computed(() => mergeSlot(sdn.buttonIconic, props.buttonIconic))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Icon v-if="iconProps !== null" v-bind="iconProps" />
        <Input v-if="inputProps !== null" v-bind="inputProps" />
        <ButtonIconic v-if="buttonIconicProps !== null" v-bind="buttonIconicProps" :icon="icon2Props" />
      </slot>
    </div>
</template>
