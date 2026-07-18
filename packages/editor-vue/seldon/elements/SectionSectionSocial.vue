<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Button from "../elements/Button.vue"
import Icon from "../primitives/Icon.vue"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  button?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  button2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  button3?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
}>()

const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-section",
  "button": {
    "className": "sdn-button sdn-button--vd3d"
  },
  "icon": {
    "icon": "seldon-iconSocialTwitter",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--eyw9"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--zk5o"
  },
  "button2": {
    "className": "sdn-button sdn-button--vd3d"
  },
  "icon2": {
    "icon": "seldon-iconSocialLinkedin",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--eyw9"
  },
  "textLabel2": {
    "className": "sdn-text-label sdn-text-label--zk5o"
  },
  "button3": {
    "className": "sdn-button sdn-button--vd3d"
  },
  "icon3": {
    "icon": "seldon-iconSocialInstagram",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--eyw9"
  },
  "textLabel3": {
    "className": "sdn-text-label sdn-text-label--zk5o"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-section", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const buttonProps = computed(() => mergeSlot(sdn.button, props.button))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const button2Props = computed(() => mergeSlot(sdn.button2, props.button2))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2))
const textLabel2Props = computed(() => mergeSlot(sdn.textLabel2, props.textLabel2))
const button3Props = computed(() => mergeSlot(sdn.button3, props.button3))
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3))
const textLabel3Props = computed(() => mergeSlot(sdn.textLabel3, props.textLabel3))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Button v-if="buttonProps !== null" v-bind="buttonProps">
          <Icon v-if="icon && iconProps" v-bind="iconProps" />
          <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
        </Button>
        <Button v-if="button2Props !== null" v-bind="button2Props">
          <Icon v-if="icon2 && icon2Props" v-bind="icon2Props" />
          <TextLabel v-if="textLabel2 && textLabel2Props" v-bind="textLabel2Props" />
        </Button>
        <Button v-if="button3Props !== null" v-bind="button3Props">
          <Icon v-if="icon3 && icon3Props" v-bind="icon3Props" />
          <TextLabel v-if="textLabel3 && textLabel3Props" v-bind="textLabel3Props" />
        </Button>
      </slot>
    </div>
</template>
