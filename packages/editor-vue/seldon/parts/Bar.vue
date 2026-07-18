<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Button from "../elements/Button.vue"
import ButtonIconic from "../elements/ButtonIconic.vue"
import Icon from "../primitives/Icon.vue"
import TextLabel from "../primitives/TextLabel.vue"
import TextTitle from "../primitives/TextTitle.vue"

const props = defineProps<{
  className?: string
  textTitle?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  button?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
}>()

const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-bar",
  "textTitle": {
    "className": "sdn-text-title sdn-text-title--qbtu"
  },
  "buttonIconic": {
    "className": "sdn-button-iconic sdn-button-iconic--pgsr"
  },
  "icon": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--rezm"
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
  }
}

const rootClassName = computed(() => combineClassNames("sdn-bar", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const textTitleProps = computed(() => mergeSlot(sdn.textTitle, props.textTitle))
const buttonIconicProps = computed(() => mergeSlot(sdn.buttonIconic, props.buttonIconic))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const buttonProps = computed(() => mergeSlot(sdn.button, props.button))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <TextTitle v-if="textTitle && textTitleProps" v-bind="textTitleProps" />
        <ButtonIconic v-if="buttonIconicProps !== null" v-bind="buttonIconicProps" :icon="iconProps" />
        <Button v-if="buttonProps !== null" v-bind="buttonProps">
          <Icon v-if="icon2 && icon2Props" v-bind="icon2Props" />
          <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
        </Button>
      </slot>
    </div>
</template>
