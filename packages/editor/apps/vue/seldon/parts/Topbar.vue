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
 * Topbar: Topbar
 * Level: Part
 * Intent: Site header that pairs a brand logo and wordmark with primary navigation and a call-to-action.
 * Tags: topbar, navbar, header, navigation, brand, menu, part, UI
 * Type: Inline
 *
 * @example
 * ```vue
 * <Topbar
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
import Icon from "../primitives/Icon.vue"
import Image from "../primitives/Image.vue"
import LinkPlain from "../primitives/LinkPlain.vue"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  image?: Record<string, unknown> | null
  image2?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  button?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  linkPlain?: Record<string, unknown> | null
  linkPlain2?: Record<string, unknown> | null
  linkPlain3?: Record<string, unknown> | null
  button2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
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
    "className": "sdn-frame sdn-frame--ypwq"
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
    "className": "sdn-frame sdn-frame--qvz9"
  },
  "button": {
    "className": "sdn-button sdn-button--l9rb"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--lbxv"
  },
  "icon": {
    "icon": "material-expandMore",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--xi68"
  },
  "linkPlain": {
    "className": "sdn-link-plain sdn-link-plain--hnhh"
  },
  "linkPlain2": {
    "className": "sdn-link-plain sdn-link-plain--hnhh"
  },
  "linkPlain3": {
    "className": "sdn-link-plain sdn-link-plain--hnhh"
  },
  "button2": {
    "className": "sdn-button sdn-button--l9rb"
  },
  "icon2": {
    "icon": "material-email",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--tdud"
  },
  "textLabel2": {
    "className": "sdn-text-label sdn-text-label--d65z"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-topbar", props.className))
const rootAttrs = { "role": sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame))
const imageProps = computed(() => mergeSlot(sdn.image, props.image))
const image2Props = computed(() => mergeSlot(sdn.image2, props.image2))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2))
const buttonProps = computed(() => mergeSlot(sdn.button, props.button))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const linkPlainProps = computed(() => mergeSlot(sdn.linkPlain, props.linkPlain))
const linkPlain2Props = computed(() => mergeSlot(sdn.linkPlain2, props.linkPlain2))
const linkPlain3Props = computed(() => mergeSlot(sdn.linkPlain3, props.linkPlain3))
const button2Props = computed(() => mergeSlot(sdn.button2, props.button2))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2))
const textLabel2Props = computed(() => mergeSlot(sdn.textLabel2, props.textLabel2))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Frame v-bind="frameProps">
          <Image v-if="image && imageProps" v-bind="imageProps" />
          <Image v-if="image2 && image2Props" v-bind="image2Props" />
        </Frame>
        <Frame v-bind="frame2Props">
          <Button v-if="button && buttonProps" v-bind="buttonProps">
            <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
            <Icon v-if="iconProps !== null" v-bind="iconProps" />
          </Button>
          <LinkPlain v-if="linkPlain && linkPlainProps" v-bind="linkPlainProps" />
          <LinkPlain v-if="linkPlain2 && linkPlain2Props" v-bind="linkPlain2Props" />
          <LinkPlain v-if="linkPlain3 && linkPlain3Props" v-bind="linkPlain3Props" />
          <Button v-if="button2 && button2Props" v-bind="button2Props">
            <Icon v-if="icon2Props !== null" v-bind="icon2Props" />
            <TextLabel v-if="textLabel2 && textLabel2Props" v-bind="textLabel2Props" />
          </Button>
        </Frame>
      </slot>
    </div>
</template>
