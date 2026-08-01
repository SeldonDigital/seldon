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
 * Intent: Editable field paired with a menu of options to choose from.
 * Tags: combobox, select, dropdown, input, part, UI
 * Type: Default
 *
 * Structure:
 *   ComboboxField     comboboxField
 *     Icon            icon
 *     Input           input
 *     ButtonIconic    buttonIconic
 *       Icon          icon2
 *   MenuOptions       menuOptions
 *     MenuItemOption  menuItemOption
 *       Icon          icon3
 *       TextLabel     textLabel
 *       TextLabel     textLabel2
 *     MenuItemOption  menuItemOption2
 *       Icon          icon4
 *       TextLabel     textLabel3
 *       TextLabel     textLabel4
 *     MenuItemOption  menuItemOption3
 *       Icon          icon5
 *       TextLabel     textLabel5
 *       TextLabel     textLabel6
 *
 * @example
 * ```vue
 * <Combobox
 *   aria-hidden="false"
 *   comboboxField="{}"
 *   icon="material-star"
 *   input="{}"
 *   buttonIconic={() => {}}
 *   menuOptions="{}"
 *   menuItemOption="{}"
 *   textLabel="{}"
 *   textLabel2="{}"
 *   menuItemOption2="{}"
 *   menuItemOption3="{}"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import ComboboxField from "../elements/ComboboxField.vue"
import MenuOptions from "../parts/MenuOptions.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  comboboxField?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  input?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  menuOptions?: Record<string, unknown> | null
  menuItemOption?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  menuItemOption2?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  textLabel4?: Record<string, unknown> | null
  menuItemOption3?: Record<string, unknown> | null
  icon5?: Record<string, unknown> | null
  textLabel5?: Record<string, unknown> | null
  textLabel6?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  comboboxField: {
    "aria-hidden": "false",
    className: "sdn-combobox-field sdn-combobox-field--z3a0",
  },
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  input: {
    placeholder: "Placeholder text",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--yoqi",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon2: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  menuOptions: {
    role: "listbox",
    "aria-hidden": "false",
    className: "sdn-menu-options sdn-menu-options--4wpg",
  },
  menuItemOption: {
    role: "option",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-option--6dxl",
  },
  icon3: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  textLabel: {
    children: "Option",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  textLabel2: {
    children: "Annotation",
    className: "sdn-text-label sdn-text-label--lqmh",
  },
  menuItemOption2: {
    role: "option",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-option--6dxl",
  },
  icon4: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  textLabel3: {
    children: "Option",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  textLabel4: {
    children: "Annotation",
    className: "sdn-text-label sdn-text-label--lqmh",
  },
  menuItemOption3: {
    role: "option",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-option--6dxl",
  },
  icon5: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  textLabel5: {
    children: "Option",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  textLabel6: {
    children: "Annotation",
    className: "sdn-text-label sdn-text-label--lqmh",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-combobox", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const comboboxFieldProps = computed(() =>
  mergeSlot(sdn.comboboxField, props.comboboxField, props.seldonRefs),
)
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const inputProps = computed(() => mergeSlot(sdn.input, props.input, props.seldonRefs))
const buttonIconicProps = computed(() =>
  mergeSlot(sdn.buttonIconic, props.buttonIconic, props.seldonRefs),
)
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2, props.seldonRefs))
const menuOptionsProps = computed(() =>
  mergeSlot(sdn.menuOptions, props.menuOptions, props.seldonRefs),
)
const menuItemOptionProps = computed(() =>
  mergeSlot(sdn.menuItemOption, props.menuItemOption, props.seldonRefs),
)
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3, props.seldonRefs))
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const textLabel2Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs),
)
const menuItemOption2Props = computed(() =>
  mergeSlot(sdn.menuItemOption2, props.menuItemOption2, props.seldonRefs),
)
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4, props.seldonRefs))
const textLabel3Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs),
)
const textLabel4Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel4, props.textLabel4, props.seldonRefs),
)
const menuItemOption3Props = computed(() =>
  mergeSlot(sdn.menuItemOption3, props.menuItemOption3, props.seldonRefs),
)
const icon5Props = computed(() => mergeSlot(sdn.icon5, props.icon5, props.seldonRefs))
const textLabel5Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel5, props.textLabel5, props.seldonRefs),
)
const textLabel6Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel6, props.textLabel6, props.seldonRefs),
)
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
      <MenuOptions
        v-if="menuOptionsProps !== null"
        v-bind="menuOptionsProps"
        :menuItemOption="menuItemOptionProps"
        :icon="icon3Props"
        :textLabel="textLabelProps"
        :textLabel2="textLabel2Props"
        :menuItemOption2="menuItemOption2Props"
        :icon2="icon4Props"
        :textLabel3="textLabel3Props"
        :textLabel4="textLabel4Props"
        :menuItemOption3="menuItemOption3Props"
        :icon3="icon5Props"
        :textLabel5="textLabel5Props"
        :textLabel6="textLabel6Props"
      />
    </slot>
  </div>
</template>
