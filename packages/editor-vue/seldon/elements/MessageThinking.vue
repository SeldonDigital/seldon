<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Frame from "../frames/Frame.vue"
import ButtonIconic from "../elements/ButtonIconic.vue"
import TextDescription from "../primitives/TextDescription.vue"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  textDescription?: Record<string, unknown> | null
  textDescription2?: Record<string, unknown> | null
  textDescription3?: Record<string, unknown> | null
}>()

const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-message-thinking sdn-message",
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
    "className": "sdn-icon sdn-icon--kzy9"
  },
  "textDescription": {
    "className": "sdn-text-description sdn-text-description--0r1j"
  },
  "textDescription2": {
    "className": "sdn-text-description sdn-text-description--aeeo"
  },
  "textDescription3": {
    "className": "sdn-text-description sdn-text-description--choa"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-message-thinking", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame))
const buttonIconicProps = computed(() => mergeSlot(sdn.buttonIconic, props.buttonIconic))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const textDescriptionProps = computed(() => mergeSlot(sdn.textDescription, props.textDescription))
const textDescription2Props = computed(() => mergeSlot(sdn.textDescription2, props.textDescription2))
const textDescription3Props = computed(() => mergeSlot(sdn.textDescription3, props.textDescription3))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Frame v-bind="frameProps">
          <ButtonIconic v-if="buttonIconic && buttonIconicProps" v-bind="buttonIconicProps" :icon="iconProps" />
          <TextDescription v-if="textDescription && textDescriptionProps" v-bind="textDescriptionProps" />
          <TextDescription v-if="textDescription2 && textDescription2Props" v-bind="textDescription2Props" />
        </Frame>
        <TextDescription v-if="textDescription3 && textDescription3Props" v-bind="textDescription3Props" />
      </slot>
    </div>
</template>
