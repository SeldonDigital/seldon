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
 * Topbar: Topbar
 * Level: Part
 * Intent: Site header that pairs a brand logo and wordmark with primary navigation and a call-to-action.
 * Tags: topbar, navbar, header, navigation, brand, menu, part, UI
 * Type: Inline
 *
 * Structure:
 *   Frame          frame
 *     Image        image
 *     Image        image2
 *   Frame          frame2
 *     Button       button
 *       TextLabel  textLabel
 *       Icon       icon
 *     LinkPlain    linkPlain
 *     LinkPlain    linkPlain2
 *     LinkPlain    linkPlain3
 *     Button       button2
 *       Icon       icon2
 *       TextLabel  textLabel2
 *
 * @example
 * ```vue
 * <Topbar
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
    "children": "Expertise",
    "className": "sdn-text-label sdn-text-label--lbxv"
  },
  "icon": {
    "icon": "material-expandMore",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--xi68"
  },
  "linkPlain": {
    "children": "Services",
    "className": "sdn-link-plain sdn-link-plain--hnhh"
  },
  "linkPlain2": {
    "children": "Study Case",
    "className": "sdn-link-plain sdn-link-plain--hnhh"
  },
  "linkPlain3": {
    "children": "About",
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
    "children": "Contact",
    "className": "sdn-text-label sdn-text-label--d65z"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-topbar", props.className))
const rootAttrs = { "role": sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const imageProps = computed(() => mergeOptionalSlot(sdn.image, props.image, props.seldonRefs))
const image2Props = computed(() => mergeOptionalSlot(sdn.image2, props.image2, props.seldonRefs))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const buttonProps = computed(() => mergeOptionalSlot(sdn.button, props.button, props.seldonRefs))
const textLabelProps = computed(() => mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const linkPlainProps = computed(() => mergeOptionalSlot(sdn.linkPlain, props.linkPlain, props.seldonRefs))
const linkPlain2Props = computed(() => mergeOptionalSlot(sdn.linkPlain2, props.linkPlain2, props.seldonRefs))
const linkPlain3Props = computed(() => mergeOptionalSlot(sdn.linkPlain3, props.linkPlain3, props.seldonRefs))
const button2Props = computed(() => mergeOptionalSlot(sdn.button2, props.button2, props.seldonRefs))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2, props.seldonRefs))
const textLabel2Props = computed(() => mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Frame v-bind="frameProps">
          <Image v-if="imageProps !== null" v-bind="imageProps" />
          <Image v-if="image2Props !== null" v-bind="image2Props" />
        </Frame>
        <Frame v-bind="frame2Props">
          <Button v-if="buttonProps !== null" v-bind="buttonProps">
            <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
            <Icon v-if="iconProps !== null" v-bind="iconProps" />
          </Button>
          <LinkPlain v-if="linkPlainProps !== null" v-bind="linkPlainProps" />
          <LinkPlain v-if="linkPlain2Props !== null" v-bind="linkPlain2Props" />
          <LinkPlain v-if="linkPlain3Props !== null" v-bind="linkPlain3Props" />
          <Button v-if="button2Props !== null" v-bind="button2Props">
            <Icon v-if="icon2Props !== null" v-bind="icon2Props" />
            <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
          </Button>
        </Frame>
      </slot>
    </div>
</template>
