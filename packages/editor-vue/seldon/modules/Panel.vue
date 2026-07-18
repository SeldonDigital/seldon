<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Frame from "../frames/Frame.vue"
import Bar from "../parts/Bar.vue"
import BarButtons from "../parts/BarButtons.vue"
import Button from "../elements/Button.vue"
import ButtonIconic from "../elements/ButtonIconic.vue"
import Icon from "../primitives/Icon.vue"
import TextLabel from "../primitives/TextLabel.vue"
import TextTitle from "../primitives/TextTitle.vue"

const props = defineProps<{
  className?: string
  bar?: Record<string, unknown> | null
  textTitle?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  button?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  frame?: Record<string, unknown> | null
  barButtons?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  button2?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  button3?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  button4?: Record<string, unknown> | null
  icon5?: Record<string, unknown> | null
  textLabel4?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
  button5?: Record<string, unknown> | null
  icon6?: Record<string, unknown> | null
  textLabel5?: Record<string, unknown> | null
  button6?: Record<string, unknown> | null
  icon7?: Record<string, unknown> | null
  textLabel6?: Record<string, unknown> | null
}>()

const sdn: Record<string, any> = {
  "role": "dialog",
  "aria-hidden": "false",
  "className": "sdn-panel",
  "bar": {
    "aria-hidden": "false",
    "className": "sdn-bar sdn-bar--yje0"
  },
  "textTitle": {
    "className": "sdn-text-title sdn-text-title--8ah1"
  },
  "buttonIconic": {
    "className": "sdn-button-iconic sdn-button-iconic--pgsr"
  },
  "icon": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--taul"
  },
  "button": {
    "className": "sdn-button sdn-button-iconic--pgsr"
  },
  "icon2": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--umgs"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--ylte"
  },
  "frame": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--88jo"
  },
  "barButtons": {
    "aria-hidden": "false",
    "className": "sdn-bar-buttons sdn-bar-buttons--dabm"
  },
  "frame2": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--ysu5"
  },
  "button2": {
    "className": "sdn-button sdn-button--wjtm"
  },
  "icon3": {
    "className": "sdn-icon sdn-icon--gh8m"
  },
  "textLabel2": {
    "className": "sdn-text-label sdn-text-label--wxqf"
  },
  "button3": {
    "className": "sdn-button sdn-button--wjtm"
  },
  "icon4": {
    "className": "sdn-icon sdn-icon--gh8m"
  },
  "textLabel3": {
    "className": "sdn-text-label sdn-text-label--wxqf"
  },
  "button4": {
    "className": "sdn-button sdn-button--wjtm"
  },
  "icon5": {
    "className": "sdn-icon sdn-icon--gh8m"
  },
  "textLabel4": {
    "className": "sdn-text-label sdn-text-label--wxqf"
  },
  "frame3": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--nzij"
  },
  "button5": {
    "className": "sdn-button sdn-button--wjtm"
  },
  "icon6": {
    "icon": "seldon-none",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--gh8m"
  },
  "textLabel5": {
    "className": "sdn-text-label sdn-text-label--wxqf"
  },
  "button6": {
    "className": "sdn-button sdn-button--wjtm"
  },
  "icon7": {
    "icon": "material-check",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--gh8m"
  },
  "textLabel6": {
    "className": "sdn-text-label sdn-text-label--wxqf"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-panel", props.className))
const rootAttrs = { "role": sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const barProps = computed(() => mergeSlot(sdn.bar, props.bar))
const textTitleProps = computed(() => mergeSlot(sdn.textTitle, props.textTitle))
const buttonIconicProps = computed(() => mergeSlot(sdn.buttonIconic, props.buttonIconic))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const buttonProps = computed(() => mergeSlot(sdn.button, props.button))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame))
const barButtonsProps = computed(() => mergeSlot(sdn.barButtons, props.barButtons))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2))
const button2Props = computed(() => mergeSlot(sdn.button2, props.button2))
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3))
const textLabel2Props = computed(() => mergeSlot(sdn.textLabel2, props.textLabel2))
const button3Props = computed(() => mergeSlot(sdn.button3, props.button3))
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4))
const textLabel3Props = computed(() => mergeSlot(sdn.textLabel3, props.textLabel3))
const button4Props = computed(() => mergeSlot(sdn.button4, props.button4))
const icon5Props = computed(() => mergeSlot(sdn.icon5, props.icon5))
const textLabel4Props = computed(() => mergeSlot(sdn.textLabel4, props.textLabel4))
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3))
const button5Props = computed(() => mergeSlot(sdn.button5, props.button5))
const icon6Props = computed(() => mergeSlot(sdn.icon6, props.icon6))
const textLabel5Props = computed(() => mergeSlot(sdn.textLabel5, props.textLabel5))
const button6Props = computed(() => mergeSlot(sdn.button6, props.button6))
const icon7Props = computed(() => mergeSlot(sdn.icon7, props.icon7))
const textLabel6Props = computed(() => mergeSlot(sdn.textLabel6, props.textLabel6))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Bar v-if="barProps !== null" v-bind="barProps">
          <TextTitle v-if="textTitle && textTitleProps" v-bind="textTitleProps" />
          <ButtonIconic v-if="buttonIconic && buttonIconicProps" v-bind="buttonIconicProps" :icon="iconProps" />
          <Button v-if="button && buttonProps" v-bind="buttonProps">
            <Icon v-if="icon2 && icon2Props" v-bind="icon2Props" />
            <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
          </Button>
        </Bar>
        <Frame v-bind="frameProps">
        </Frame>
        <BarButtons v-if="barButtonsProps !== null" v-bind="barButtonsProps">
          <Frame v-bind="frame2Props" v-if="frame2">
            <Button v-if="button2 && button2Props" v-bind="button2Props">
              <Icon v-if="icon3 && icon3Props" v-bind="icon3Props" />
              <TextLabel v-if="textLabel2 && textLabel2Props" v-bind="textLabel2Props" />
            </Button>
            <Button v-if="button3 && button3Props" v-bind="button3Props">
              <Icon v-if="icon4 && icon4Props" v-bind="icon4Props" />
              <TextLabel v-if="textLabel3 && textLabel3Props" v-bind="textLabel3Props" />
            </Button>
            <Button v-if="button4 && button4Props" v-bind="button4Props">
              <Icon v-if="icon5 && icon5Props" v-bind="icon5Props" />
              <TextLabel v-if="textLabel4 && textLabel4Props" v-bind="textLabel4Props" />
            </Button>
          </Frame>
          <Frame v-bind="frame3Props" v-if="frame3">
            <Button v-if="button5 && button5Props" v-bind="button5Props">
              <Icon v-if="icon6 && icon6Props" v-bind="icon6Props" />
              <TextLabel v-if="textLabel5 && textLabel5Props" v-bind="textLabel5Props" />
            </Button>
            <Button v-if="button6 && button6Props" v-bind="button6Props">
              <Icon v-if="icon7 && icon7Props" v-bind="icon7Props" />
              <TextLabel v-if="textLabel6 && textLabel6Props" v-bind="textLabel6Props" />
            </Button>
          </Frame>
        </BarButtons>
      </slot>
    </div>
</template>
