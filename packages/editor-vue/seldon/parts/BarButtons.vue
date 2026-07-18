<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Frame from "../frames/Frame.vue"
import Button from "../elements/Button.vue"
import Icon from "../primitives/Icon.vue"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  button?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  button2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  button3?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  button4?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  textLabel4?: Record<string, unknown> | null
  button5?: Record<string, unknown> | null
  icon5?: Record<string, unknown> | null
  textLabel5?: Record<string, unknown> | null
}>()

const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-bar-buttons sdn-bar",
  "frame": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--ysu5"
  },
  "button": {
    "className": "sdn-button sdn-button--wjtm"
  },
  "icon": {
    "className": "sdn-icon sdn-icon--gh8m"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--wxqf"
  },
  "button2": {
    "className": "sdn-button sdn-button--wjtm"
  },
  "icon2": {
    "className": "sdn-icon sdn-icon--gh8m"
  },
  "textLabel2": {
    "className": "sdn-text-label sdn-text-label--wxqf"
  },
  "button3": {
    "className": "sdn-button sdn-button--wjtm"
  },
  "icon3": {
    "className": "sdn-icon sdn-icon--gh8m"
  },
  "textLabel3": {
    "className": "sdn-text-label sdn-text-label--wxqf"
  },
  "frame2": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--nzij"
  },
  "button4": {
    "className": "sdn-button sdn-button--wjtm"
  },
  "icon4": {
    "icon": "seldon-none",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--gh8m"
  },
  "textLabel4": {
    "className": "sdn-text-label sdn-text-label--wxqf"
  },
  "button5": {
    "className": "sdn-button sdn-button--wjtm"
  },
  "icon5": {
    "icon": "material-check",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--gh8m"
  },
  "textLabel5": {
    "className": "sdn-text-label sdn-text-label--wxqf"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-bar-buttons", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame))
const buttonProps = computed(() => mergeSlot(sdn.button, props.button))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const button2Props = computed(() => mergeSlot(sdn.button2, props.button2))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2))
const textLabel2Props = computed(() => mergeSlot(sdn.textLabel2, props.textLabel2))
const button3Props = computed(() => mergeSlot(sdn.button3, props.button3))
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3))
const textLabel3Props = computed(() => mergeSlot(sdn.textLabel3, props.textLabel3))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2))
const button4Props = computed(() => mergeSlot(sdn.button4, props.button4))
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4))
const textLabel4Props = computed(() => mergeSlot(sdn.textLabel4, props.textLabel4))
const button5Props = computed(() => mergeSlot(sdn.button5, props.button5))
const icon5Props = computed(() => mergeSlot(sdn.icon5, props.icon5))
const textLabel5Props = computed(() => mergeSlot(sdn.textLabel5, props.textLabel5))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Frame v-bind="frameProps" v-if="frame">
          <Button v-if="button && buttonProps" v-bind="buttonProps">
            <Icon v-if="icon && iconProps" v-bind="iconProps" />
            <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
          </Button>
          <Button v-if="button2 && button2Props" v-bind="button2Props">
            <Icon v-if="icon2 && icon2Props" v-bind="icon2Props" />
            <TextLabel v-if="textLabel2 && textLabel2Props" v-bind="textLabel2Props" />
          </Button>
          <Button v-if="button3 && button3Props" v-bind="button3Props">
            <Icon v-if="icon3 && icon3Props" v-bind="icon3Props" />
            <TextLabel v-if="textLabel3 && textLabel3Props" v-bind="textLabel3Props" />
          </Button>
        </Frame>
        <Frame v-bind="frame2Props" v-if="frame2">
          <Button v-if="button4 && button4Props" v-bind="button4Props">
            <Icon v-if="icon4 && icon4Props" v-bind="icon4Props" />
            <TextLabel v-if="textLabel4 && textLabel4Props" v-bind="textLabel4Props" />
          </Button>
          <Button v-if="button5 && button5Props" v-bind="button5Props">
            <Icon v-if="icon5 && icon5Props" v-bind="icon5Props" />
            <TextLabel v-if="textLabel5 && textLabel5Props" v-bind="textLabel5Props" />
          </Button>
        </Frame>
      </slot>
    </div>
</template>
