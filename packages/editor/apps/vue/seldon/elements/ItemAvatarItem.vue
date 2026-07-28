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
 * Item: ItemAvatarItem
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Inline
 *
 * Structure:
 *   InputCheckbox   inputCheckbox
 *   AvatarRounded   avatarRounded
 *     Image         image
 *   Frame           frame
 *     TextTitle     textTitle
 *     TextSubtitle  textSubtitle
 *   Button          button
 *     Icon          icon
 *     TextLabel     textLabel
 *
 * @example
 * ```vue
 * <ItemAvatarItem
 *   aria-hidden="false"
 *   inputCheckbox="{}"
 *   avatarRounded="/image.jpg"
 *   image="/image.jpg"
 *   frame="{}"
 *   textTitle="Product Title"
 *   textSubtitle2="Product Title"
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
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"
import Frame from "../frames/Frame.vue"
import AvatarRounded from "../elements/AvatarRounded.vue"
import Button from "../elements/Button.vue"
import Icon from "../primitives/Icon.vue"
import InputCheckbox from "../primitives/InputCheckbox.vue"
import TextLabel from "../primitives/TextLabel.vue"
import TextSubtitle from "../primitives/TextSubtitle.vue"
import TextTitle from "../primitives/TextTitle.vue"

const props = defineProps<{
  className?: string
  inputCheckbox?: Record<string, unknown> | null
  avatarRounded?: Record<string, unknown> | null
  image?: Record<string, unknown> | null
  frame?: Record<string, unknown> | null
  textTitle?: Record<string, unknown> | null
  textSubtitle?: Record<string, unknown> | null
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
  "inputCheckbox": {
    "className": "sdn-input-checkbox sdn-input-checkbox--vajr"
  },
  "avatarRounded": {
    "aria-hidden": "false",
    "className": "sdn-avatar sdn-avatar--a890"
  },
  "image": {
    "src": "/avatar-user.png",
    "aria-hidden": "false",
    "className": "sdn-image sdn-image--zjyq"
  },
  "frame": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--nhfs"
  },
  "textTitle": {
    "className": "sdn-text-title sdn-text-title--ulqm"
  },
  "textSubtitle": {
    "className": "sdn-text-subtitle sdn-text-subtitle--nxwj"
  },
  "button": {
    "className": "sdn-button sdn-button-iconic--pgsr"
  },
  "icon": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--umgs"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--ylte"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-item", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const inputCheckboxProps = computed(() => mergeOptionalSlot(sdn.inputCheckbox, props.inputCheckbox, props.seldonRefs))
const avatarRoundedProps = computed(() => mergeSlot(sdn.avatarRounded, props.avatarRounded, props.seldonRefs))
const imageProps = computed(() => mergeSlot(sdn.image, props.image, props.seldonRefs))
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const textTitleProps = computed(() => mergeOptionalSlot(sdn.textTitle, props.textTitle, props.seldonRefs))
const textSubtitleProps = computed(() => mergeOptionalSlot(sdn.textSubtitle, props.textSubtitle, props.seldonRefs))
const buttonProps = computed(() => mergeSlot(sdn.button, props.button, props.seldonRefs))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const textLabelProps = computed(() => mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs))
</script>

<template>
    <li :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <InputCheckbox v-if="inputCheckboxProps !== null" v-bind="inputCheckboxProps" />
        <AvatarRounded v-if="avatarRoundedProps !== null" v-bind="avatarRoundedProps" :image="imageProps" />
        <Frame v-bind="frameProps">
          <TextTitle v-if="textTitleProps !== null" v-bind="textTitleProps" />
          <TextSubtitle v-if="textSubtitleProps !== null" v-bind="textSubtitleProps" />
        </Frame>
        <Button v-if="buttonProps !== null" v-bind="buttonProps">
          <Icon v-if="iconProps !== null" v-bind="iconProps" />
          <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
        </Button>
      </slot>
    </li>
</template>
