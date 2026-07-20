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
 * Section: SectionBrand
 * Level: Element
 * Intent: Navigation section containing links to important pages. Can be used in footers, headers, sidebars, or any other layout context. Follows Material Design navigation patterns.
 * Tags: section, navigation, links, menu, element, layout, header, footer, sidebar
 * Type: Custom
 *
 * @example
 * ```vue
 * <SectionSectionBrand
 *   aria-hidden="false"
 *   image="/image.jpg"
 *   textTitle="Product Title"
 *   textDescription2="{}"
 * />
 * ```
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Image from "../primitives/Image.vue"
import TextDescription from "../primitives/TextDescription.vue"
import TextTitle from "../primitives/TextTitle.vue"

const props = defineProps<{
  className?: string
  image?: Record<string, unknown> | null
  textTitle?: Record<string, unknown> | null
  textDescription?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-section",
  "image": {
    "src": "https://static.seldon.app/logo.svg",
    "aria-hidden": "false",
    "className": "sdn-image sdn-image--wxaq"
  },
  "textTitle": {
    "className": "sdn-text-title sdn-text-title--unrf"
  },
  "textDescription": {
    "className": "sdn-text-description sdn-text-title--unrf"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-section", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const imageProps = computed(() => mergeSlot(sdn.image, props.image))
const textTitleProps = computed(() => mergeSlot(sdn.textTitle, props.textTitle))
const textDescriptionProps = computed(() => mergeSlot(sdn.textDescription, props.textDescription))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Image v-if="imageProps !== null" v-bind="imageProps" />
        <TextTitle v-if="textTitle && textTitleProps" v-bind="textTitleProps" />
        <TextDescription v-if="textDescription && textDescriptionProps" v-bind="textDescriptionProps" />
      </slot>
    </div>
</template>
