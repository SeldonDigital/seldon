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
 * Topbar: TopbarMenu
 * Level: Part
 * Intent: Site header that pairs a brand logo and wordmark with primary navigation and a call-to-action.
 * Tags: topbar, navbar, header, navigation, brand, menu, part, UI
 * Type: Inline
 *
 * Structure:
 *   Frame          frame
 *     Button       button
 *       Icon       icon
 *       TextLabel  textLabel
 *   Frame          frame2
 *     Image        image
 *     Image        image2
 *   Frame          frame3
 *     Button       button2
 *       Icon       icon2
 *       TextLabel  textLabel2
 *
 * @example
 * ```vue
 * <TopbarMenu
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
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  button?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  image?: Record<string, unknown> | null
  image2?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
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
  "button": {
    "className": "sdn-button sdn-button--l9rb"
  },
  "icon": {
    "icon": "material-menu",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--xi68"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--jc8n"
  },
  "frame2": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--fr7r"
  },
  "image": {
    "className": "sdn-image sdn-image--guh3"
  },
  "image2": {
    "className": "sdn-image sdn-image--guh3"
  },
  "frame3": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--0lrb"
  },
  "button2": {
    "className": "sdn-button sdn-button--l9rb"
  },
  "icon2": {
    "icon": "material-phone",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--tdud"
  },
  "textLabel2": {
    "className": "sdn-text-label sdn-text-label--my9r"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-topbar", props.className))
const rootAttrs = { "role": sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const buttonProps = computed(() => mergeOptionalSlot(sdn.button, props.button, props.seldonRefs))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const textLabelProps = computed(() => mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const imageProps = computed(() => mergeOptionalSlot(sdn.image, props.image, props.seldonRefs))
const image2Props = computed(() => mergeOptionalSlot(sdn.image2, props.image2, props.seldonRefs))
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3, props.seldonRefs))
const button2Props = computed(() => mergeOptionalSlot(sdn.button2, props.button2, props.seldonRefs))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2, props.seldonRefs))
const textLabel2Props = computed(() => mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Frame v-bind="frameProps">
          <Button v-if="buttonProps !== null" v-bind="buttonProps">
            <Icon v-if="iconProps !== null" v-bind="iconProps" />
            <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
          </Button>
        </Frame>
        <Frame v-bind="frame2Props">
          <Image v-if="imageProps !== null" v-bind="imageProps" />
          <Image v-if="image2Props !== null" v-bind="image2Props" />
        </Frame>
        <Frame v-bind="frame3Props">
          <Button v-if="button2Props !== null" v-bind="button2Props">
            <Icon v-if="icon2Props !== null" v-bind="icon2Props" />
            <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
          </Button>
        </Frame>
      </slot>
    </div>
</template>
