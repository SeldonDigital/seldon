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
 * Part: TokenControlsAlignment
 * Level: Part
 * Intent: HUD like controls for adjusting related properties directly on the canvas
 * Tags:
 * Type: Inline
 *
 * Structure:
 *   FormControlCombobox  formControlCombobox
 *     ComboboxField      comboboxField
 *       Icon             icon
 *       Input            input
 *       ButtonIconic     buttonIconic
 *         Icon           icon2
 *   Frame                frame
 *     Icon               icon3
 *     ToggleSwitch       toggleSwitch
 *   Frame                frame2
 *     Icon               icon4
 *     ToggleSwitch       toggleSwitch2
 *
 * @example
 * ```vue
 * <TokenControlsAlignment
 *   aria-hidden="false"
 *   formControlCombobox="{}"
 *   comboboxField="{}"
 *   icon="material-star"
 *   input="{}"
 *   buttonIconic={() => {}}
 *   frame="{}"
 *   toggleSwitch="{}"
 *   frame2="{}"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import FormControlCombobox from "../elements/FormControlCombobox.vue"
import Frame from "../frames/Frame.vue"
import Icon from "../primitives/Icon.vue"
import ToggleSwitch from "../primitives/ToggleSwitch.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  formControlCombobox?: Record<string, unknown> | null
  comboboxField?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  input?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  frame?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  toggleSwitch?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  toggleSwitch2?: Record<string, unknown> | null
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
    icon: "seldon-positionTopLeft",
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
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--8wkg",
  },
  icon3: {
    icon: "material-desktopLandscape",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rdh1",
  },
  toggleSwitch: {
    role: "switch",
    "aria-checked": "false",
    className: "sdn-toggle-switch sdn-toggle-switch--pelh",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--8wkg",
  },
  icon4: {
    icon: "material-wrapText",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rdh1",
  },
  toggleSwitch2: {
    role: "switch",
    "aria-checked": "false",
    className: "sdn-toggle-switch sdn-toggle-switch--pelh",
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
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const icon3Props = computed(() => mergeOptionalSlot(sdn.icon3, props.icon3, props.seldonRefs))
const toggleSwitchProps = computed(() =>
  mergeOptionalSlot(sdn.toggleSwitch, props.toggleSwitch, props.seldonRefs),
)
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const icon4Props = computed(() => mergeOptionalSlot(sdn.icon4, props.icon4, props.seldonRefs))
const toggleSwitch2Props = computed(() =>
  mergeOptionalSlot(sdn.toggleSwitch2, props.toggleSwitch2, props.seldonRefs),
)
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
      <Frame v-bind="frameProps">
        <Icon v-if="icon3Props !== null" v-bind="icon3Props" />
        <ToggleSwitch v-if="toggleSwitchProps !== null" v-bind="toggleSwitchProps" />
      </Frame>
      <Frame v-bind="frame2Props">
        <Icon v-if="icon4Props !== null" v-bind="icon4Props" />
        <ToggleSwitch v-if="toggleSwitch2Props !== null" v-bind="toggleSwitch2Props" />
      </Frame>
    </slot>
  </div>
</template>
