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
 * Item: ItemPropertyToggle
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Custom
 *
 * Structure:
 *   ButtonIconic         buttonIconic         -> propertyToggleDisclosure
 *     Icon               icon                 -> propertyToggleDisclosureIcon
 *   FormControlCombobox  formControlCombobox
 *     Input              input                -> propertyToggleLabel
 *     Frame              frame
 *       Icon             icon2                -> propertyToggleIcon
 *       ToggleSwitch     toggleSwitch         -> propertyToggleSwitch
 *   ButtonIconic         buttonIconic2        -> propertyToggleActions
 *     Icon               icon3
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
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import ButtonIconic from "../elements/ButtonIconic.vue"
import FormControlCombobox from "../elements/FormControlCombobox.vue"
import Frame from "../frames/Frame.vue"
import Icon from "../primitives/Icon.vue"
import Input from "../primitives/Input.vue"
import ToggleSwitch from "../primitives/ToggleSwitch.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

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
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "propertyToggleDisclosure",
  },
  icon: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
    "data-seldon-ref": "propertyToggleDisclosureIcon",
  },
  formControlCombobox: {
    className: "sdn-form-control sdn-form-control-combobox--qmop",
  },
  input: {
    placeholder: "Property Name",
    className: "sdn-input sdn-input--jvsw",
    "data-seldon-ref": "propertyToggleLabel",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--inf3",
  },
  icon2: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "propertyToggleIcon",
  },
  toggleSwitch: {
    className: "sdn-toggle-switch sdn-toggle-switch--pelh",
    "data-seldon-ref": "propertyToggleSwitch",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "propertyToggleActions",
  },
  icon3: {
    icon: "seldon-more",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-item-property", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const buttonIconicProps = computed(() =>
  mergeOptionalSlot(sdn.buttonIconic, props.buttonIconic, props.seldonRefs),
)
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const formControlComboboxProps = computed(() =>
  mergeOptionalSlot(sdn.formControlCombobox, props.formControlCombobox, props.seldonRefs),
)
const inputProps = computed(() => mergeOptionalSlot(sdn.input, props.input, props.seldonRefs))
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const icon2Props = computed(() => mergeOptionalSlot(sdn.icon2, props.icon2, props.seldonRefs))
const toggleSwitchProps = computed(() =>
  mergeOptionalSlot(sdn.toggleSwitch, props.toggleSwitch, props.seldonRefs),
)
const buttonIconic2Props = computed(() =>
  mergeOptionalSlot(sdn.buttonIconic2, props.buttonIconic2, props.seldonRefs),
)
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3, props.seldonRefs))
</script>

<template>
  <li :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <ButtonIconic
        v-if="buttonIconicProps !== null"
        v-bind="buttonIconicProps"
        :icon="iconProps"
      />
      <FormControlCombobox
        v-if="formControlComboboxProps !== null"
        v-bind="formControlComboboxProps"
      >
        <Input v-if="inputProps !== null" v-bind="inputProps" />
        <Frame v-bind="frameProps" v-if="frameProps !== null">
          <Icon v-if="icon2Props !== null" v-bind="icon2Props" />
          <ToggleSwitch v-if="toggleSwitchProps !== null" v-bind="toggleSwitchProps" />
        </Frame>
      </FormControlCombobox>
      <ButtonIconic
        v-if="buttonIconic2Props !== null"
        v-bind="buttonIconic2Props"
        :icon="icon3Props"
      />
    </slot>
  </li>
</template>
