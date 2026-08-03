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
 * Panel: PanelToken
 * Level: Module
 * Intent: Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.
 * Tags: panel, dialog, modal, ui, overlay, popup, interaction, alert
 * Type: Inline
 *
 * Structure:
 *   ChipAssist               chipAssist
 *     TextLabel              textLabel
 *     Icon                   icon
 *   Frame                    frame
 *     TokenControls          tokenControls
 *       FormControlCombobox  formControlCombobox
 *         ComboboxField      comboboxField
 *           Icon             icon2
 *           Input            input
 *           ButtonIconic     buttonIconic
 *             Icon           icon3
 *
 * @example
 * ```vue
 * <PanelToken
 *   role="dialog"
 *   aria-hidden="false"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import ChipAssist from "../elements/ChipAssist.vue"
import FormControlCombobox from "../elements/FormControlCombobox.vue"
import Frame from "../frames/Frame.vue"
import Icon from "../primitives/Icon.vue"
import TextLabel from "../primitives/TextLabel.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  chipAssist?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  frame?: Record<string, unknown> | null
  tokenControls?: Record<string, unknown> | null
  formControlCombobox?: Record<string, unknown> | null
  comboboxField?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  input?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  role: "dialog",
  "aria-hidden": "false",
  chipAssist: {
    className: "sdn-chip sdn-chip-assist--1bvt",
  },
  textLabel: {
    children: "TokenName",
    className: "sdn-text-label sdn-text-label--299x",
  },
  icon: {
    icon: "seldon-theme",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  frame: {
    wrapperElement: "div",
    role: "dialog",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--tnni",
  },
  tokenControls: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-token-controls sdn-token-controls--jakc",
  },
  formControlCombobox: {
    className: "sdn-form-control sdn-form-control-combobox--ujby",
  },
  comboboxField: {
    "aria-hidden": "false",
    className: "sdn-combobox-field sdn-combobox-field--2lb1",
  },
  icon2: {
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
  icon3: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--qwbk",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-panel-token", props.className))
const rootAttrs = { role: sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const chipAssistProps = computed(() =>
  mergeOptionalSlot(sdn.chipAssist, props.chipAssist, props.seldonRefs),
)
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const tokenControlsProps = computed(() =>
  mergeSlot(sdn.tokenControls, props.tokenControls, props.seldonRefs),
)
const formControlComboboxProps = computed(() =>
  mergeOptionalSlot(sdn.formControlCombobox, props.formControlCombobox, props.seldonRefs),
)
const comboboxFieldProps = computed(() =>
  mergeSlot(sdn.comboboxField, props.comboboxField, props.seldonRefs),
)
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2, props.seldonRefs))
const inputProps = computed(() => mergeSlot(sdn.input, props.input, props.seldonRefs))
const buttonIconicProps = computed(() =>
  mergeSlot(sdn.buttonIconic, props.buttonIconic, props.seldonRefs),
)
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3, props.seldonRefs))
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <ChipAssist v-if="chipAssistProps !== null" v-bind="chipAssistProps">
        <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
        <Icon v-if="iconProps !== null" v-bind="iconProps" />
      </ChipAssist>
      <Frame v-bind="frameProps">
        <Frame v-bind="tokenControlsProps" v-if="tokenControlsProps !== null">
          <FormControlCombobox
            v-if="formControlComboboxProps !== null"
            v-bind="formControlComboboxProps"
            :comboboxField="comboboxFieldProps"
            :icon="icon2Props"
            :input="inputProps"
            :buttonIconic="buttonIconicProps"
            :icon2="icon3Props"
            :textLabel="null"
          />
        </Frame>
      </Frame>
    </slot>
  </div>
</template>
