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

/**
 * Article Card: ArticleCard
 * Level: Part
 * Intent: Content preview card with a featured image, headline, short excerpt, and author metadata to drive click-throughs.
 * Tags: card, article, blog, preview, excerpt, author, content, UI
 * Type: Inline
 *
 * Structure:
 *   Image              image
 *   Frame              frame
 *     Chip             chip
 *       TextLabel      textLabel
 *     TextHeading      textHeading
 *     TextDescription  textDescription
 *     Frame            frame2
 *       Avatar         avatar
 *         Image        image2
 *       Frame          frame3
 *         TextLabel    textLabel2
 *         TextLabel    textLabel3
 *       ButtonSimple   buttonSimple
 *         TextLabel    textLabel4
 *
 * @example
 * ```vue
 * <ArticleCard
 *   aria-hidden="false"
 *   image="/image.jpg"
 *   frame="{}"
 *   chip="{}"
 *   textLabel="{}"
 *   textHeading="{}"
 *   textDescription2="{}"
 *   avatar="/image.jpg"
 *   textLabel2="{}"
 *   buttonSimple={() => {}}
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot, mergeOptionalSlot } from "../utils/class-names"
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
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
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
    "children": "Design",
    "className": "sdn-text-label sdn-text-label--lug5"
  },
  "textHeading": {
    "children": "How to design better cards",
    "className": "sdn-text-heading sdn-text-heading--xkk9"
  },
  "textDescription": {
    "children": "A short, two-line excerpt written for the card earns the click without giving everything away.",
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
    "children": "Sir Bentley",
    "className": "sdn-text-label sdn-text-label--f3ym"
  },
  "textLabel3": {
    "children": "Mar 30 · 5 min read",
    "className": "sdn-text-label sdn-text-label--yqnd"
  },
  "buttonSimple": {
    "className": "sdn-button-simple sdn-button-iconic--8tzd"
  },
  "textLabel4": {
    "children": "Read more",
    "className": "sdn-text-label sdn-text-label--gtwp"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-article-card", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const imageProps = computed(() => mergeSlot(sdn.image, props.image, props.seldonRefs))
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const chipProps = computed(() => mergeOptionalSlot(sdn.chip, props.chip, props.seldonRefs))
const textLabelProps = computed(() => mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs))
const textHeadingProps = computed(() => mergeOptionalSlot(sdn.textHeading, props.textHeading, props.seldonRefs))
const textDescriptionProps = computed(() => mergeOptionalSlot(sdn.textDescription, props.textDescription, props.seldonRefs))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const avatarProps = computed(() => mergeOptionalSlot(sdn.avatar, props.avatar, props.seldonRefs))
const image2Props = computed(() => mergeSlot(sdn.image2, props.image2, props.seldonRefs))
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3, props.seldonRefs))
const textLabel2Props = computed(() => mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs))
const textLabel3Props = computed(() => mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs))
const buttonSimpleProps = computed(() => mergeOptionalSlot(sdn.buttonSimple, props.buttonSimple, props.seldonRefs))
const textLabel4Props = computed(() => mergeOptionalSlot(sdn.textLabel4, props.textLabel4, props.seldonRefs))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Image v-if="imageProps !== null" v-bind="imageProps" />
        <Frame v-bind="frameProps">
          <Chip v-if="chipProps !== null" v-bind="chipProps">
            <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
          </Chip>
          <TextHeading v-if="textHeadingProps !== null" v-bind="textHeadingProps" />
          <TextDescription v-if="textDescriptionProps !== null" v-bind="textDescriptionProps" />
          <Frame v-bind="frame2Props" v-if="frame2Props !== null">
            <Avatar v-if="avatarProps !== null" v-bind="avatarProps" :image="image2Props" />
            <Frame v-bind="frame3Props" v-if="frame3Props !== null">
              <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
              <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
            </Frame>
            <ButtonSimple v-if="buttonSimpleProps !== null" v-bind="buttonSimpleProps">
              <TextLabel v-if="textLabel4Props !== null" v-bind="textLabel4Props" />
            </ButtonSimple>
          </Frame>
        </Frame>
      </slot>
    </div>
</template>
