/***** * * This code was generated using Seldon (https://github.com/SeldonDigital/seldon) * *
License: https://github.com/SeldonDigital/seldon/blob/main/LICENSE.md * Do not redistribute or
sublicense without permission. * * You may not use this software, or any derivative works of it, in
whole or in part, * for the purposes of training, fine-tuning, or otherwise improving (directly or
indirectly) * any machine learning or artificial intelligence system without written permission. *
*****/

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
 * Topbar: TopbarSpread
 * Level: Part
 * Intent: Site header that pairs a brand logo and wordmark with primary navigation and a call-to-action.
 * Tags: topbar, navbar, header, navigation, brand, menu, part, UI
 * Type: Inline
 *
 * Structure:
 *   Frame        frame
 *     Image      image
 *     Image      image2
 *   Frame        frame2
 *     LinkPlain  linkPlain
 *     LinkPlain  linkPlain2
 *     LinkPlain  linkPlain3
 *   Frame        frame3
 *     LinkPlain  linkPlain4
 *     Text       text
 *     LinkPlain  linkPlain5
 *
 * @example
 * ```vue
 * <TopbarSpread
 *   role="banner"
 *   aria-hidden="false"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import Frame from "../frames/Frame.vue"
import Image from "../primitives/Image.vue"
import LinkPlain from "../primitives/LinkPlain.vue"
import Text from "../primitives/Text.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

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
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  role: "banner",
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--3jq4",
  },
  image: {
    className: "sdn-image sdn-image--guh3",
  },
  image2: {
    className: "sdn-image sdn-image--guh3",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--tv9y",
  },
  linkPlain: {
    children: "What We Do",
    className: "sdn-link-plain sdn-link-plain--q3fs",
  },
  linkPlain2: {
    children: "Project",
    className: "sdn-link-plain sdn-link-plain--q3fs",
  },
  linkPlain3: {
    children: "Contact",
    className: "sdn-link-plain sdn-link-plain--q3fs",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--eicl",
  },
  linkPlain4: {
    children: "EN",
    className: "sdn-link-plain sdn-link-plain--1tic",
  },
  text: {
    children: " | ",
    className: "sdn-text sdn-text--s4kj",
  },
  linkPlain5: {
    children: "JP",
    className: "sdn-link-plain sdn-link-plain--q3fs",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-topbar-spread", props.className))
const rootAttrs = { role: sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const imageProps = computed(() => mergeOptionalSlot(sdn.image, props.image, props.seldonRefs))
const image2Props = computed(() => mergeOptionalSlot(sdn.image2, props.image2, props.seldonRefs))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const linkPlainProps = computed(() =>
  mergeOptionalSlot(sdn.linkPlain, props.linkPlain, props.seldonRefs),
)
const linkPlain2Props = computed(() =>
  mergeOptionalSlot(sdn.linkPlain2, props.linkPlain2, props.seldonRefs),
)
const linkPlain3Props = computed(() =>
  mergeOptionalSlot(sdn.linkPlain3, props.linkPlain3, props.seldonRefs),
)
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3, props.seldonRefs))
const linkPlain4Props = computed(() =>
  mergeOptionalSlot(sdn.linkPlain4, props.linkPlain4, props.seldonRefs),
)
const textProps = computed(() => mergeOptionalSlot(sdn.text, props.text, props.seldonRefs))
const linkPlain5Props = computed(() =>
  mergeOptionalSlot(sdn.linkPlain5, props.linkPlain5, props.seldonRefs),
)
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Frame v-bind="frameProps">
        <Image v-if="imageProps !== null" v-bind="imageProps" />
        <Image v-if="image2Props !== null" v-bind="image2Props" />
      </Frame>
      <Frame v-bind="frame2Props">
        <LinkPlain v-if="linkPlainProps !== null" v-bind="linkPlainProps" />
        <LinkPlain v-if="linkPlain2Props !== null" v-bind="linkPlain2Props" />
        <LinkPlain v-if="linkPlain3Props !== null" v-bind="linkPlain3Props" />
      </Frame>
      <Frame v-bind="frame3Props">
        <LinkPlain v-if="linkPlain4Props !== null" v-bind="linkPlain4Props" />
        <Text v-if="textProps !== null" v-bind="textProps" />
        <LinkPlain v-if="linkPlain5Props !== null" v-bind="linkPlain5Props" />
      </Frame>
    </slot>
  </div>
</template>
