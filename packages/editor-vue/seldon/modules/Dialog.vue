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
 * Module: Dialog
 * Level: Module
 * Intent: 
 * Tags: 
 * Type: Inline
 *
 * @example
 * ```vue
 * <Dialog
 *   aria-hidden="false"
 *   bar="{}"
 *   textTitle="Product Title"
 *   comboboxFieldSearch="{}"
 *   icon="material-star"
 *   input="{}"
 *   buttonIconic={() => {}}
 *   frame="{}"
 *   barButtons2="{}"
 *   button={() => {}}
 *   textLabel="{}"
 *   button2={() => {}}
 *   button3={() => {}}
 *   frame2="{}"
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
  button?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  button2?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  button3?: Record<string, unknown> | null
  icon5?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
  button4?: Record<string, unknown> | null
  icon6?: Record<string, unknown> | null
  textLabel4?: Record<string, unknown> | null
  button5?: Record<string, unknown> | null
  icon7?: Record<string, unknown> | null
  textLabel5?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-dialog",
  "bar": {
    "aria-hidden": "false",
    "className": "sdn-bar sdn-bar--zhvk"
  },
  "textTitle": {
    "children": "Dialog",
    "htmlElement": "h4",
    "aria-hidden": "false",
    "className": "sdn-text-title sdn-text-title--eodu"
  },
  "comboboxFieldSearch": {
    "aria-hidden": "false",
    "className": "sdn-combobox-field-search sdn-combobox-field-search--9jd5"
  },
  "icon": {
    "icon": "material-search",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--xi68"
  },
  "input": {
    "placeholder": "Search for...",
    "type": "text",
    "role": "combobox",
    "aria-haspopup": "listbox",
    "className": "sdn-input sdn-input--twyx"
  },
  "buttonIconic": {
    "className": "sdn-button-iconic sdn-button-iconic--pgsr"
  },
  "icon2": {
    "icon": "material-close",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--vsau"
  },
  "frame": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--rbpu"
  },
  "barButtons": {
    "aria-hidden": "false",
    "className": "sdn-bar-buttons sdn-bar-buttons--ymyq"
  },
  "frame2": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--ysu5"
  },
  "button": {
    "className": "sdn-button sdn-button--wjtm"
  },
  "icon3": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--gh8m"
  },
  "textLabel": {
    "children": "Button",
    "htmlElement": "label",
    "aria-hidden": "false",
    "className": "sdn-text-label sdn-text-label--wxqf"
  },
  "button2": {
    "className": "sdn-button sdn-button--ls8f"
  },
  "icon4": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--gh8m"
  },
  "textLabel2": {
    "children": "Button",
    "htmlElement": "label",
    "aria-hidden": "false",
    "className": "sdn-text-label sdn-text-label--wxqf"
  },
  "button3": {
    "className": "sdn-button sdn-button--ls8f"
  },
  "icon5": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--gh8m"
  },
  "textLabel3": {
    "children": "Button",
    "htmlElement": "label",
    "aria-hidden": "false",
    "className": "sdn-text-label sdn-text-label--wxqf"
  },
  "frame3": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--nzij"
  },
  "button4": {
    "className": "sdn-button sdn-button--wjtm"
  },
  "icon6": {
    "icon": "seldon-none",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--gh8m"
  },
  "textLabel4": {
    "children": "Cancel",
    "htmlElement": "label",
    "aria-hidden": "false",
    "className": "sdn-text-label sdn-text-label--wxqf"
  },
  "button5": {
    "className": "sdn-button sdn-button--upjl"
  },
  "icon7": {
    "icon": "material-check",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--gh8m"
  },
  "textLabel5": {
    "children": "OK",
    "htmlElement": "label",
    "aria-hidden": "false",
    "className": "sdn-text-label sdn-text-label--wxqf"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-dialog", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
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
const buttonProps = computed(() => mergeSlot(sdn.button, props.button))
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const button2Props = computed(() => mergeSlot(sdn.button2, props.button2))
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4))
const textLabel2Props = computed(() => mergeSlot(sdn.textLabel2, props.textLabel2))
const button3Props = computed(() => mergeSlot(sdn.button3, props.button3))
const icon5Props = computed(() => mergeSlot(sdn.icon5, props.icon5))
const textLabel3Props = computed(() => mergeSlot(sdn.textLabel3, props.textLabel3))
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3))
const button4Props = computed(() => mergeSlot(sdn.button4, props.button4))
const icon6Props = computed(() => mergeSlot(sdn.icon6, props.icon6))
const textLabel4Props = computed(() => mergeSlot(sdn.textLabel4, props.textLabel4))
const button5Props = computed(() => mergeSlot(sdn.button5, props.button5))
const icon7Props = computed(() => mergeSlot(sdn.icon7, props.icon7))
const textLabel5Props = computed(() => mergeSlot(sdn.textLabel5, props.textLabel5))
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
            <Button v-if="button && buttonProps" v-bind="buttonProps">
              <Icon v-if="icon3 && icon3Props" v-bind="icon3Props" />
              <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
            </Button>
            <Button v-if="button2 && button2Props" v-bind="button2Props">
              <Icon v-if="icon4Props !== null" v-bind="icon4Props" />
              <TextLabel v-if="textLabel2 && textLabel2Props" v-bind="textLabel2Props" />
            </Button>
            <Button v-if="button3 && button3Props" v-bind="button3Props">
              <Icon v-if="icon5Props !== null" v-bind="icon5Props" />
              <TextLabel v-if="textLabel3 && textLabel3Props" v-bind="textLabel3Props" />
            </Button>
          </Frame>
          <Frame v-bind="frame3Props" v-if="frame3">
            <Button v-if="button4 && button4Props" v-bind="button4Props">
              <Icon v-if="icon6Props !== null" v-bind="icon6Props" />
              <TextLabel v-if="textLabel4 && textLabel4Props" v-bind="textLabel4Props" />
            </Button>
            <Button v-if="button5 && button5Props" v-bind="button5Props">
              <Icon v-if="icon7Props !== null" v-bind="icon7Props" />
              <TextLabel v-if="textLabel5 && textLabel5Props" v-bind="textLabel5Props" />
            </Button>
          </Frame>
        </BarButtons>
      </slot>
    </div>
</template>
