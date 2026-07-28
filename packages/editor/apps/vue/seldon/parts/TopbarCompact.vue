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
 * Topbar: TopbarCompact
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
 *     LinkPlain  linkPlain4
 *   Frame        frame3
 *     LinkPlain  linkPlain5
 *     Text       text
 *     LinkPlain  linkPlain6
 *   Button       button
 *     TextLabel  textLabel
 *
 * @example
 * ```vue
 * <TopbarCompact
 *   role="banner"
 *   aria-hidden="false"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot, mergeOptionalSlot } from "../utils/class-names"
import Frame from "../frames/Frame.vue"
import Button from "../elements/Button.vue"
import Image from "../primitives/Image.vue"
import LinkPlain from "../primitives/LinkPlain.vue"
import Text from "../primitives/Text.vue"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  image?: Record<string, unknown> | null
  image2?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  linkPlain?: Record<string, unknown> | null
  linkPlain2?: Record<string, unknown> | null
  linkPlain3?: Record<string, unknown> | null
  linkPlain4?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
  linkPlain5?: Record<string, unknown> | null
  text?: Record<string, unknown> | null
  linkPlain6?: Record<string, unknown> | null
  button?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "role": "banner",
  "aria-hidden": "false",
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
    "className": "sdn-frame sdn-frame--cbw3"
  },
  "linkPlain": {
    "className": "sdn-link-plain sdn-link-plain--hnhh"
  },
  "linkPlain2": {
    "className": "sdn-link-plain sdn-link-plain--hnhh"
  },
  "linkPlain3": {
    "className": "sdn-link-plain sdn-link-plain--yexk"
  },
  "linkPlain4": {
    "className": "sdn-link-plain sdn-link-plain--hnhh"
  },
  "frame3": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--adqt"
  },
  "linkPlain5": {
    "className": "sdn-link-plain sdn-link-plain--67at"
  },
  "text": {
    "className": "sdn-text sdn-text--s4kj"
  },
  "linkPlain6": {
    "className": "sdn-link-plain sdn-link-plain--yc40"
  },
  "button": {
    "className": "sdn-button sdn-button--aket"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--wxqf"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-topbar", props.className))
const rootAttrs = { "role": sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const imageProps = computed(() => mergeOptionalSlot(sdn.image, props.image, props.seldonRefs))
const image2Props = computed(() => mergeOptionalSlot(sdn.image2, props.image2, props.seldonRefs))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const linkPlainProps = computed(() => mergeOptionalSlot(sdn.linkPlain, props.linkPlain, props.seldonRefs))
const linkPlain2Props = computed(() => mergeOptionalSlot(sdn.linkPlain2, props.linkPlain2, props.seldonRefs))
const linkPlain3Props = computed(() => mergeOptionalSlot(sdn.linkPlain3, props.linkPlain3, props.seldonRefs))
const linkPlain4Props = computed(() => mergeOptionalSlot(sdn.linkPlain4, props.linkPlain4, props.seldonRefs))
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3, props.seldonRefs))
const linkPlain5Props = computed(() => mergeOptionalSlot(sdn.linkPlain5, props.linkPlain5, props.seldonRefs))
const textProps = computed(() => mergeOptionalSlot(sdn.text, props.text, props.seldonRefs))
const linkPlain6Props = computed(() => mergeOptionalSlot(sdn.linkPlain6, props.linkPlain6, props.seldonRefs))
const buttonProps = computed(() => mergeSlot(sdn.button, props.button, props.seldonRefs))
const textLabelProps = computed(() => mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs))
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
          <LinkPlain v-if="linkPlain4Props !== null" v-bind="linkPlain4Props" />
        </Frame>
        <Frame v-bind="frame3Props">
          <LinkPlain v-if="linkPlain5Props !== null" v-bind="linkPlain5Props" />
          <Text v-if="textProps !== null" v-bind="textProps" />
          <LinkPlain v-if="linkPlain6Props !== null" v-bind="linkPlain6Props" />
        </Frame>
        <Button v-if="buttonProps !== null" v-bind="buttonProps">
          <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
        </Button>
      </slot>
    </div>
</template>
