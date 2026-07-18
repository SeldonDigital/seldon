<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Frame from "../frames/Frame.vue"
import ButtonIconic from "../elements/ButtonIconic.vue"
import Icon from "../primitives/Icon.vue"
import TextDescription from "../primitives/TextDescription.vue"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  textDescription?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  textDescription2?: Record<string, unknown> | null
}>()

const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-message-tools sdn-message",
  "frame": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--ieew"
  },
  "buttonIconic": {
    "className": "sdn-button-iconic sdn-button-iconic--iklu"
  },
  "icon": {
    "icon": "material-chevronDown",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--bmas"
  },
  "textDescription": {
    "className": "sdn-text-description sdn-text-description--71gg"
  },
  "frame2": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--rstc",
    "data-seldon-ref": "tool"
  },
  "icon2": {
    "className": "sdn-icon sdn-icon--9ouj"
  },
  "textDescription2": {
    "className": "sdn-text-description sdn-text-description--hqun"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-message-tools", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame))
const buttonIconicProps = computed(() => mergeSlot(sdn.buttonIconic, props.buttonIconic))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const textDescriptionProps = computed(() => mergeSlot(sdn.textDescription, props.textDescription))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2))
const textDescription2Props = computed(() => mergeSlot(sdn.textDescription2, props.textDescription2))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Frame v-bind="frameProps">
          <ButtonIconic v-if="buttonIconic && buttonIconicProps" v-bind="buttonIconicProps" :icon="iconProps" />
          <TextDescription v-if="textDescription && textDescriptionProps" v-bind="textDescriptionProps" />
        </Frame>
        <Frame v-bind="frame2Props">
          <Icon v-if="icon2 && icon2Props" v-bind="icon2Props" />
          <TextDescription v-if="textDescription2 && textDescription2Props" v-bind="textDescription2Props" />
        </Frame>
      </slot>
    </div>
</template>
