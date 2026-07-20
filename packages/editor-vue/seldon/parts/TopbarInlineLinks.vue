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
 * Topbar: TopbarInlineLinks
 * Level: Part
 * Intent: Site header that pairs a brand logo and wordmark with primary navigation and a call-to-action.
 * Tags: topbar, navbar, header, navigation, brand, menu, part, UI
 * Type: Inline
 *
 * @example
 * ```vue
 * <TopbarInlineLinks
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
import Button from "../elements/Button.vue"
import Image from "../primitives/Image.vue"
import LinkPlain from "../primitives/LinkPlain.vue"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  linkPlain?: Record<string, unknown> | null
  linkPlain2?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  linkPlain3?: Record<string, unknown> | null
  button?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  image?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "role": "banner",
  "aria-hidden": "false",
  "className": "sdn-topbar",
  "frame": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--rclo"
  },
  "linkPlain": {
    "className": "sdn-link-plain sdn-link-plain--hnhh"
  },
  "linkPlain2": {
    "className": "sdn-link-plain sdn-link-plain--hnhh"
  },
  "frame2": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--az2m"
  },
  "linkPlain3": {
    "className": "sdn-link-plain sdn-link-plain--yc40"
  },
  "button": {
    "className": "sdn-button sdn-button--aket"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--fcuq"
  },
  "image": {
    "className": "sdn-image sdn-image--guh3"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-topbar", props.className))
const rootAttrs = { "role": sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame))
const linkPlainProps = computed(() => mergeSlot(sdn.linkPlain, props.linkPlain))
const linkPlain2Props = computed(() => mergeSlot(sdn.linkPlain2, props.linkPlain2))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2))
const linkPlain3Props = computed(() => mergeSlot(sdn.linkPlain3, props.linkPlain3))
const buttonProps = computed(() => mergeSlot(sdn.button, props.button))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const imageProps = computed(() => mergeSlot(sdn.image, props.image))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Frame v-bind="frameProps">
          <LinkPlain v-if="linkPlain && linkPlainProps" v-bind="linkPlainProps" />
          <LinkPlain v-if="linkPlain2 && linkPlain2Props" v-bind="linkPlain2Props" />
        </Frame>
        <Frame v-bind="frame2Props">
          <LinkPlain v-if="linkPlain3 && linkPlain3Props" v-bind="linkPlain3Props" />
          <Button v-if="button && buttonProps" v-bind="buttonProps">
            <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
          </Button>
          <Image v-if="image && imageProps" v-bind="imageProps" />
        </Frame>
      </slot>
    </div>
</template>
