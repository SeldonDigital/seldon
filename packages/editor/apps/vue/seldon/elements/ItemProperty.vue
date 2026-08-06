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
 * Item: ItemProperty
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Custom
 *
 * Structure:
 *   ButtonIconic         buttonIconic         -> propertyDisclosure
 *     Icon               icon                 -> propertyDisclosureIcon
 *   FormControlCombobox  formControlCombobox  -> propertyRow
 *     Input              input                -> propertyLabel
 *     ComboboxField      comboboxField        -> propertyValueField
 *       Icon             icon2                -> propertyValueIcon
 *       Input            input2               -> propertyValueLabel
 *       ButtonIconic     buttonIconic2        -> propertyValueMenu
 *         Icon           icon3                -> propertyValueMenuIcon
 *   ButtonIconic         buttonIconic3        -> propertyActions
 *     Icon               icon4
 *
 * @example
 * ```vue
 * <ItemProperty
 *   aria-hidden="false"
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   formControlCombobox="{}"
 *   input="{}"
 *   comboboxField="{}"
 *   buttonIconic2={() => {}}
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import ButtonIconic from "../elements/ButtonIconic.vue"
import ComboboxField from "../elements/ComboboxField.vue"
import FormControlCombobox from "../elements/FormControlCombobox.vue"
import Input from "../primitives/Input.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  buttonIconic?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  formControlCombobox?: Record<string, unknown> | null
  input?: Record<string, unknown> | null
  comboboxField?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  input2?: Record<string, unknown> | null
  buttonIconic2?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  buttonIconic3?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "propertyDisclosure",
  },
  icon: {
    icon: "material-keyboardArrowDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
    "data-seldon-ref": "propertyDisclosureIcon",
  },
  formControlCombobox: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-combobox--qmop",
    "data-seldon-ref": "propertyRow",
  },
  input: {
    placeholder: "Property Name",
    className: "sdn-input sdn-input--jvsw",
    "data-seldon-ref": "propertyLabel",
  },
  comboboxField: {
    "aria-hidden": "false",
    className: "sdn-combobox-field sdn-combobox-field--j44i",
    "data-seldon-ref": "propertyValueField",
  },
  icon2: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "propertyValueIcon",
  },
  input2: {
    placeholder: "Value",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--9vqu",
    "data-seldon-ref": "propertyValueLabel",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "propertyValueMenu",
  },
  icon3: {
    icon: "material-keyboardArrowDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "propertyValueMenuIcon",
  },
  buttonIconic3: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "propertyActions",
  },
  icon4: {
    icon: "seldon-more",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-item-property", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const buttonIconicProps = computed(() =>
  mergeSlot(sdn.buttonIconic, props.buttonIconic, props.seldonRefs),
)
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const formControlComboboxProps = computed(() =>
  mergeSlot(sdn.formControlCombobox, props.formControlCombobox, props.seldonRefs),
)
const inputProps = computed(() => mergeOptionalSlot(sdn.input, props.input, props.seldonRefs))
const comboboxFieldProps = computed(() =>
  mergeSlot(sdn.comboboxField, props.comboboxField, props.seldonRefs),
)
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2, props.seldonRefs))
const input2Props = computed(() => mergeSlot(sdn.input2, props.input2, props.seldonRefs))
const buttonIconic2Props = computed(() =>
  mergeSlot(sdn.buttonIconic2, props.buttonIconic2, props.seldonRefs),
)
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3, props.seldonRefs))
const buttonIconic3Props = computed(() =>
  mergeSlot(sdn.buttonIconic3, props.buttonIconic3, props.seldonRefs),
)
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4, props.seldonRefs))
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
        <ComboboxField
          v-if="comboboxFieldProps !== null"
          v-bind="comboboxFieldProps"
          :icon="icon2Props"
          :input="input2Props"
          :buttonIconic="buttonIconic2Props"
          :icon2="icon3Props"
        />
      </FormControlCombobox>
      <ButtonIconic
        v-if="buttonIconic3Props !== null"
        v-bind="buttonIconic3Props"
        :icon="icon4Props"
      />
    </slot>
  </li>
</template>
