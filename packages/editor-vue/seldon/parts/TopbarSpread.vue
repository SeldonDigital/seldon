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
 * Topbar: TopbarSpread
 * Level: Part
 * Intent: Site header that pairs a brand logo and wordmark with primary navigation and a call-to-action.
 * Tags: topbar, navbar, header, navigation, brand, menu, part, UI
 * Type: Inline
 *
 * @example
 * ```vue
 * <TopbarSpread
 *   role="banner"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Frame from "../frames/Frame.vue"
import Image from "../primitives/Image.vue"
import LinkPlain from "../primitives/LinkPlain.vue"
import Text from "../primitives/Text.vue"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  image?: Record<string, unknown> | null
  image2?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  linkPlain?: Record<string, unknown> | null
  linkPlain2?: Record<string, unknown> | null
  linkPlain3?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
  linkPlain4?: Record<string, unknown> | null
  text?: Record<string, unknown> | null
  linkPlain5?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "role": "banner",
  "aria-hidden": "false",
  "className": "sdn-topbar-spread sdn-topbar",
  "frame": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--3jq4"
  },
  "image": {
    "className": "sdn-image sdn-image--guh3"
  },
  "image2": {
    "className": "sdn-image sdn-image--guh3"
  },
  "frame2": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--tv9y"
  },
  "linkPlain": {
    "className": "sdn-link-plain sdn-link-plain--q3fs"
  },
  "linkPlain2": {
    "className": "sdn-link-plain sdn-link-plain--q3fs"
  },
  "linkPlain3": {
    "className": "sdn-link-plain sdn-link-plain--q3fs"
  },
  "frame3": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--eicl"
  },
  "linkPlain4": {
    "className": "sdn-link-plain sdn-link-plain--1tic"
  },
  "text": {
    "className": "sdn-text sdn-text--s4kj"
  },
  "linkPlain5": {
    "className": "sdn-link-plain sdn-link-plain--q3fs"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-topbar-spread", props.className))
const rootAttrs = { "role": sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame))
const imageProps = computed(() => mergeSlot(sdn.image, props.image))
const image2Props = computed(() => mergeSlot(sdn.image2, props.image2))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2))
const linkPlainProps = computed(() => mergeSlot(sdn.linkPlain, props.linkPlain))
const linkPlain2Props = computed(() => mergeSlot(sdn.linkPlain2, props.linkPlain2))
const linkPlain3Props = computed(() => mergeSlot(sdn.linkPlain3, props.linkPlain3))
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3))
const linkPlain4Props = computed(() => mergeSlot(sdn.linkPlain4, props.linkPlain4))
const textProps = computed(() => mergeSlot(sdn.text, props.text))
const linkPlain5Props = computed(() => mergeSlot(sdn.linkPlain5, props.linkPlain5))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Frame v-bind="frameProps">
          <Image v-if="image && imageProps" v-bind="imageProps" />
          <Image v-if="image2 && image2Props" v-bind="image2Props" />
        </Frame>
        <Frame v-bind="frame2Props">
          <LinkPlain v-if="linkPlain && linkPlainProps" v-bind="linkPlainProps" />
          <LinkPlain v-if="linkPlain2 && linkPlain2Props" v-bind="linkPlain2Props" />
          <LinkPlain v-if="linkPlain3 && linkPlain3Props" v-bind="linkPlain3Props" />
        </Frame>
        <Frame v-bind="frame3Props">
          <LinkPlain v-if="linkPlain4 && linkPlain4Props" v-bind="linkPlain4Props" />
          <Text v-if="text && textProps" v-bind="textProps" />
          <LinkPlain v-if="linkPlain5 && linkPlain5Props" v-bind="linkPlain5Props" />
        </Frame>
      </slot>
    </div>
</template>
