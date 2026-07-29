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
 * Article Card: ArticleCardHorizontal
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
 *
 * @example
 * ```vue
 * <ArticleCardHorizontal
 *   aria-hidden="false"
 *   image="/image.jpg"
 *   frame="{}"
 *   chip="{}"
 *   textLabel="{}"
 *   textHeading="{}"
 *   textDescription2="{}"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot, mergeOptionalSlot } from "../utils/class-names"
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
  }
}

const rootClassName = computed(() => combineClassNames("sdn-article-card-horizontal", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const imageProps = computed(() => mergeSlot(sdn.image, props.image, props.seldonRefs))
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const chipProps = computed(() => mergeOptionalSlot(sdn.chip, props.chip, props.seldonRefs))
const textLabelProps = computed(() => mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs))
const textHeadingProps = computed(() => mergeOptionalSlot(sdn.textHeading, props.textHeading, props.seldonRefs))
const textDescriptionProps = computed(() => mergeOptionalSlot(sdn.textDescription, props.textDescription, props.seldonRefs))
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
        </Frame>
      </slot>
    </div>
</template>
