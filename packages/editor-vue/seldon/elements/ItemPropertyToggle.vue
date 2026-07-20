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
 * Item: ItemPropertyToggle
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Custom
 *
 * @example
 * ```vue
 * <ItemPropertyToggle
 *   aria-hidden="false"
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   formControlCombobox="{}"
 *   input="{}"
 *   frame="{}"
 *   toggleSwitch="{}"
 *   buttonIconic2={() => {}}
 * />
 * ```
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Frame from "../frames/Frame.vue"
import ButtonIconic from "../elements/ButtonIconic.vue"
import FormControlCombobox from "../elements/FormControlCombobox.vue"
import Icon from "../primitives/Icon.vue"
import Input from "../primitives/Input.vue"
import ToggleSwitch from "../primitives/ToggleSwitch.vue"

const props = defineProps<{
  className?: string
  buttonIconic?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  formControlCombobox?: Record<string, unknown> | null
  input?: Record<string, unknown> | null
  frame?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  toggleSwitch?: Record<string, unknown> | null
  buttonIconic2?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-item-property sdn-item",
  "buttonIconic": {
    "className": "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "propertyToggle"
  },
  "icon": {
    "icon": "material-chevronDown",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--vsau",
    "data-seldon-ref": "propertyToggleIcon"
  },
  "formControlCombobox": {
    "className": "sdn-form-control sdn-form-control-combobox--qmop"
  },
  "input": {
    "className": "sdn-input sdn-input--jvsw",
    "data-seldon-ref": "propertyLabel"
  },
  "frame": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--inf3"
  },
  "icon2": {
    "className": "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "toggleIcon"
  },
  "toggleSwitch": {
    "className": "sdn-toggle-switch sdn-toggle-switch--pelh",
    "data-seldon-ref": "toggleValue"
  },
  "buttonIconic2": {
    "className": "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "propertyActions"
  },
  "icon3": {
    "icon": "seldon-more",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--xi68"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-item-property", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const buttonIconicProps = computed(() => mergeSlot(sdn.buttonIconic, props.buttonIconic))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const formControlComboboxProps = computed(() => mergeSlot(sdn.formControlCombobox, props.formControlCombobox))
const inputProps = computed(() => mergeSlot(sdn.input, props.input))
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2))
const toggleSwitchProps = computed(() => mergeSlot(sdn.toggleSwitch, props.toggleSwitch))
const buttonIconic2Props = computed(() => mergeSlot(sdn.buttonIconic2, props.buttonIconic2))
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3))
</script>

<template>
    <li :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <ButtonIconic v-if="buttonIconic && buttonIconicProps" v-bind="buttonIconicProps" :icon="iconProps" />
        <FormControlCombobox v-if="formControlCombobox && formControlComboboxProps" v-bind="formControlComboboxProps">
          <Input v-if="input && inputProps" v-bind="inputProps" />
          <Frame v-bind="frameProps" v-if="frame">
            <Icon v-if="icon2 && icon2Props" v-bind="icon2Props" />
            <ToggleSwitch v-if="toggleSwitch && toggleSwitchProps" v-bind="toggleSwitchProps" />
          </Frame>
        </FormControlCombobox>
        <ButtonIconic v-if="buttonIconic2 && buttonIconic2Props" v-bind="buttonIconic2Props" :icon="icon3Props" />
      </slot>
    </li>
</template>
