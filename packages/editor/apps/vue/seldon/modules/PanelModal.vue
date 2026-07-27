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
 * Panel: PanelModal
 * Level: Module
 * Intent: Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.
 * Tags: panel, dialog, modal, ui, overlay, popup, interaction, alert
 * Type: Inline
 *
 * @example
 * ```vue
 * <PanelModal
 *   role="dialog"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Frame from "../frames/Frame.vue"
import Bar from "../parts/Bar.vue"
import BarButtons from "../parts/BarButtons.vue"
import Button from "../elements/Button.vue"
import ComboboxFieldSearch from "../elements/ComboboxFieldSearch.vue"
import Icon from "../primitives/Icon.vue"
import TextLabel from "../primitives/TextLabel.vue"
import TextTitle from "../primitives/TextTitle.vue"

const props = defineProps<{
  className?: string
  bar?: Record<string, unknown> | null
  textTitle?: Record<string, unknown> | null
  comboboxFieldSearch?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  input?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  frame?: Record<string, unknown> | null
  barButtons?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
  button?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  button2?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "role": "dialog",
  "aria-hidden": "false",
  "className": "sdn-panel-modal sdn-panel",
  "bar": {
    "aria-hidden": "false",
    "className": "sdn-bar sdn-bar--zhvk"
  },
  "textTitle": {
    "className": "sdn-text-title sdn-text-title--eodu"
  },
  "comboboxFieldSearch": {
    "className": "sdn-combobox-field-search sdn-combobox-field-search--jaw4"
  },
  "icon": {
    "icon": "material-search",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--ucf5"
  },
  "input": {
    "placeholder": "Search for...",
    "type": "text",
    "role": "combobox",
    "aria-haspopup": "listbox",
    "className": "sdn-input sdn-input--icju"
  },
  "buttonIconic": {
    "className": "sdn-button-iconic sdn-button-iconic--pgsr"
  },
  "icon2": {
    "icon": "material-close",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--rezm"
  },
  "frame": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--zjuk"
  },
  "barButtons": {
    "aria-hidden": "false",
    "className": "sdn-bar-buttons sdn-bar-buttons--0pge"
  },
  "frame2": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--ysu5"
  },
  "frame3": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--ysu5"
  },
  "button": {
    "className": "sdn-button sdn-button--wjtm"
  },
  "icon3": {
    "icon": "seldon-none",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--gh8m"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--wxqf"
  },
  "button2": {
    "className": "sdn-button sdn-button--wjtm"
  },
  "icon4": {
    "icon": "material-check",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--gh8m"
  },
  "textLabel2": {
    "className": "sdn-text-label sdn-text-label--wxqf"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-panel-modal", props.className))
const rootAttrs = { "role": sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const barProps = computed(() => mergeSlot(sdn.bar, props.bar))
const textTitleProps = computed(() => mergeSlot(sdn.textTitle, props.textTitle))
const comboboxFieldSearchProps = computed(() => mergeSlot(sdn.comboboxFieldSearch, props.comboboxFieldSearch))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const inputProps = computed(() => mergeSlot(sdn.input, props.input))
const buttonIconicProps = computed(() => mergeSlot(sdn.buttonIconic, props.buttonIconic))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2))
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame))
const barButtonsProps = computed(() => mergeSlot(sdn.barButtons, props.barButtons))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2))
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3))
const buttonProps = computed(() => mergeSlot(sdn.button, props.button))
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const button2Props = computed(() => mergeSlot(sdn.button2, props.button2))
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4))
const textLabel2Props = computed(() => mergeSlot(sdn.textLabel2, props.textLabel2))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Bar v-if="barProps !== null" v-bind="barProps">
          <TextTitle v-if="textTitle && textTitleProps" v-bind="textTitleProps" />
          <ComboboxFieldSearch v-if="comboboxFieldSearch && comboboxFieldSearchProps" v-bind="comboboxFieldSearchProps" :icon="iconProps" :input="inputProps" :buttonIconic="buttonIconicProps" :icon2="icon2Props" />
        </Bar>
        <Frame v-bind="frameProps">
        </Frame>
        <BarButtons v-if="barButtonsProps !== null" v-bind="barButtonsProps">
          <Frame v-bind="frame2Props" v-if="frame2">
          </Frame>
          <Frame v-bind="frame3Props" v-if="frame3">
          </Frame>
          <Button v-if="buttonProps !== null" v-bind="buttonProps">
            <Icon v-if="icon3Props !== null" v-bind="icon3Props" />
            <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
          </Button>
          <Button v-if="button2Props !== null" v-bind="button2Props">
            <Icon v-if="icon4Props !== null" v-bind="icon4Props" />
            <TextLabel v-if="textLabel2 && textLabel2Props" v-bind="textLabel2Props" />
          </Button>
        </BarButtons>
      </slot>
    </div>
</template>
