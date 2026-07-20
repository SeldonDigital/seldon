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

/*****
 * Article Card: ArticleCardMinimal
 * Level: Part
 * Intent: Content preview card with a featured image, headline, short excerpt, and author metadata to drive click-throughs.
 * Tags: card, article, blog, preview, excerpt, author, content, UI
 * Type: Inline
 *
 * @example
 * ```vue
 * <ArticleCardMinimal
 *   aria-hidden="false"
 *   image="/image.jpg"
 *   frame="{}"
 *   chip="{}"
 *   textLabel="{}"
 *   textHeading="{}"
 * />
 * ```
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Frame from "../frames/Frame.vue"
import Chip from "../elements/Chip.vue"
import Image from "../primitives/Image.vue"
import TextHeading from "../primitives/TextHeading.vue"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  image?: Record<string, unknown> | null
  frame?: Record<string, unknown> | null
  chip?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  textHeading?: Record<string, unknown> | null
}>()

//
// Default property values
//
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
    "className": "sdn-text-heading sdn-text-label--yqnd"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-article-card", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const imageProps = computed(() => mergeSlot(sdn.image, props.image))
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame))
const chipProps = computed(() => mergeSlot(sdn.chip, props.chip))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const textHeadingProps = computed(() => mergeSlot(sdn.textHeading, props.textHeading))
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
        </Frame>
      </slot>
    </div>
</template>
