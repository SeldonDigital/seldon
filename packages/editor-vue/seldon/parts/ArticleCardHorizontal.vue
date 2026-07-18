<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Frame from "../frames/Frame.vue"
import Chip from "../elements/Chip.vue"
import Image from "../primitives/Image.vue"
import TextDescription from "../primitives/TextDescription.vue"
import TextHeading from "../primitives/TextHeading.vue"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  image?: Record<string, unknown> | null
  frame?: Record<string, unknown> | null
  chip?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  textHeading?: Record<string, unknown> | null
  textDescription?: Record<string, unknown> | null
}>()

const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-article-card-horizontal sdn-article-card",
  "image": {
    "src": "https://static.seldon.app/background-default-light.jpg",
    "aria-hidden": "false",
    "className": "sdn-image sdn-image--oqk2"
  },
  "frame": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--sjq9"
  },
  "chip": {
    "className": "sdn-chip sdn-chip--o0xb"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--lug5"
  },
  "textHeading": {
    "className": "sdn-text-heading sdn-text-heading--xkk9"
  },
  "textDescription": {
    "className": "sdn-text-description sdn-text-description--w5ys"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-article-card-horizontal", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const imageProps = computed(() => mergeSlot(sdn.image, props.image))
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame))
const chipProps = computed(() => mergeSlot(sdn.chip, props.chip))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const textHeadingProps = computed(() => mergeSlot(sdn.textHeading, props.textHeading))
const textDescriptionProps = computed(() => mergeSlot(sdn.textDescription, props.textDescription))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Image v-if="imageProps !== null" v-bind="imageProps" />
        <Frame v-bind="frameProps">
          <Chip v-if="chip && chipProps" v-bind="chipProps">
            <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
          </Chip>
          <TextHeading v-if="textHeading && textHeadingProps" v-bind="textHeadingProps" />
          <TextDescription v-if="textDescription && textDescriptionProps" v-bind="textDescriptionProps" />
        </Frame>
      </slot>
    </div>
</template>
