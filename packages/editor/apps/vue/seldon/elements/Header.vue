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
 * Header: Header
 * Level: Element
 * Intent: Arranges header content. The card variant groups identity and a primary action; the action variant groups title text with a set of action controls.
 * Tags: header, card, actions, layout, UI, group, toolbar, summary
 * Type: Default
 *
 * Structure:
 *   Avatar       avatar
 *     Image      image
 *   Button       button
 *     Icon       icon
 *     TextLabel  textLabel
 *
 * @example
 * ```vue
 * <Header
 *   aria-hidden="false"
 *   avatar="/image.jpg"
 *   image="/image.jpg"
 *   button={() => {}}
 *   icon="material-star"
 *   textLabel="{}"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import Avatar from "../elements/Avatar.vue"
import Button from "../elements/Button.vue"
import Icon from "../primitives/Icon.vue"
import TextLabel from "../primitives/TextLabel.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  avatar?: Record<string, unknown> | null
  image?: Record<string, unknown> | null
  button?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  avatar: {
    "aria-hidden": "false",
    className: "sdn-avatar sdn-avatar--zukr",
  },
  image: {
    src: "/avatar-user.png",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--to5v",
  },
  button: {
    className: "sdn-button sdn-button-iconic--pgsr",
  },
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
  },
  textLabel: {
    children: "Button",
    className: "sdn-text-label sdn-text-label--ylte",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-header", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const avatarProps = computed(() => mergeSlot(sdn.avatar, props.avatar, props.seldonRefs))
const imageProps = computed(() => mergeSlot(sdn.image, props.image, props.seldonRefs))
const buttonProps = computed(() => mergeSlot(sdn.button, props.button, props.seldonRefs))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Avatar v-if="avatarProps !== null" v-bind="avatarProps" :image="imageProps" />
      <Button v-if="buttonProps !== null" v-bind="buttonProps">
        <Icon v-if="iconProps !== null" v-bind="iconProps" />
        <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
      </Button>
    </slot>
  </div>
</template>
