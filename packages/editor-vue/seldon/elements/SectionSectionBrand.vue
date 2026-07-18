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
