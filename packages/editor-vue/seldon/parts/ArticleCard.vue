<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Frame from "../frames/Frame.vue"
import Avatar from "../elements/Avatar.vue"
import ButtonSimple from "../elements/ButtonSimple.vue"
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
  frame2?: Record<string, unknown> | null
  avatar?: Record<string, unknown> | null
  image2?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  buttonSimple?: Record<string, unknown> | null
  textLabel4?: Record<string, unknown> | null
}>()

const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-article-card",
  "image": {
    "src": "https://static.seldon.app/background-default-light.jpg",
    "aria-hidden": "false",
    "className": "sdn-image sdn-image--j9of"
  },
  "frame": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--mclm"
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
  },
  "frame2": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--l25c"
  },
  "avatar": {
    "className": "sdn-avatar sdn-avatar--a890"
  },
  "image2": {
    "src": "/avatar-bentley.png",
    "aria-hidden": "false",
    "className": "sdn-image sdn-image--to5v"
  },
  "frame3": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--blp5"
  },
  "textLabel2": {
    "className": "sdn-text-label sdn-text-label--f3ym"
  },
  "textLabel3": {
    "className": "sdn-text-label sdn-text-label--yqnd"
  },
  "buttonSimple": {
    "className": "sdn-button-simple sdn-button-iconic--8tzd"
  },
  "textLabel4": {
    "className": "sdn-text-label sdn-text-label--gtwp"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-article-card", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const imageProps = computed(() => mergeSlot(sdn.image, props.image))
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame))
const chipProps = computed(() => mergeSlot(sdn.chip, props.chip))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const textHeadingProps = computed(() => mergeSlot(sdn.textHeading, props.textHeading))
const textDescriptionProps = computed(() => mergeSlot(sdn.textDescription, props.textDescription))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2))
const avatarProps = computed(() => mergeSlot(sdn.avatar, props.avatar))
const image2Props = computed(() => mergeSlot(sdn.image2, props.image2))
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3))
const textLabel2Props = computed(() => mergeSlot(sdn.textLabel2, props.textLabel2))
const textLabel3Props = computed(() => mergeSlot(sdn.textLabel3, props.textLabel3))
const buttonSimpleProps = computed(() => mergeSlot(sdn.buttonSimple, props.buttonSimple))
const textLabel4Props = computed(() => mergeSlot(sdn.textLabel4, props.textLabel4))
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
          <Frame v-bind="frame2Props" v-if="frame2">
            <Avatar v-if="avatar && avatarProps" v-bind="avatarProps" :image="image2Props" />
            <Frame v-bind="frame3Props" v-if="frame3">
              <TextLabel v-if="textLabel2 && textLabel2Props" v-bind="textLabel2Props" />
              <TextLabel v-if="textLabel3 && textLabel3Props" v-bind="textLabel3Props" />
            </Frame>
            <ButtonSimple v-if="buttonSimple && buttonSimpleProps" v-bind="buttonSimpleProps">
              <TextLabel v-if="textLabel4 && textLabel4Props" v-bind="textLabel4Props" />
            </ButtonSimple>
          </Frame>
        </Frame>
      </slot>
    </div>
</template>
