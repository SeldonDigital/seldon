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
 * Card: CardStacked
 * Level: Part
 * Intent: Defines a vertically stacked card layout with support for headers, content blocks, and action elements.
 * Tags: card, stacked, vertical, ui, block, layout, cta, content
 * Type: Inline
 *
 * Structure:
 *   Header           header
 *     Avatar         avatar
 *       Image        image
 *     Button         button
 *       Icon         icon
 *       TextLabel    textLabel
 *   Image            image2
 *   Frame            frame
 *     TextTitle      textTitle
 *     TextSubtitle   textSubtitle
 *   TextDescription  textDescription
 *   BarButtons       barButtons
 *     Frame          frame2
 *       Button       button2
 *         Icon       icon2
 *         TextLabel  textLabel2
 *       Button       button3
 *         Icon       icon3
 *         TextLabel  textLabel3
 *       Button       button4
 *         Icon       icon4
 *         TextLabel  textLabel4
 *     Frame          frame3
 *       Button       button5
 *         Icon       icon5
 *         TextLabel  textLabel5
 *       Button       button6
 *         Icon       icon6
 *         TextLabel  textLabel6
 *
 * @example
 * ```vue
 * <CardStacked
 *   aria-hidden="false"
 *   header="{}"
 *   avatar="/image.jpg"
 *   image="/image.jpg"
 *   button={() => {}}
 *   icon="material-star"
 *   textLabel="{}"
 *   frame="{}"
 *   textTitle="Product Title"
 *   textSubtitle2="Product Title"
 *   textDescription="{}"
 *   barButtons="{}"
 *   button2={() => {}}
 *   button3={() => {}}
 *   frame2="{}"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import Button from "../elements/Button.vue"
import Header from "../elements/Header.vue"
import Frame from "../frames/Frame.vue"
import BarButtons from "../parts/BarButtons.vue"
import Icon from "../primitives/Icon.vue"
import Image from "../primitives/Image.vue"
import TextDescription from "../primitives/TextDescription.vue"
import TextLabel from "../primitives/TextLabel.vue"
import TextSubtitle from "../primitives/TextSubtitle.vue"
import TextTitle from "../primitives/TextTitle.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  header?: Record<string, unknown> | null
  avatar?: Record<string, unknown> | null
  image?: Record<string, unknown> | null
  button?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  image2?: Record<string, unknown> | null
  frame?: Record<string, unknown> | null
  textTitle?: Record<string, unknown> | null
  textSubtitle?: Record<string, unknown> | null
  textDescription?: Record<string, unknown> | null
  barButtons?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  button2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  button3?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  button4?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  textLabel4?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
  button5?: Record<string, unknown> | null
  icon5?: Record<string, unknown> | null
  textLabel5?: Record<string, unknown> | null
  button6?: Record<string, unknown> | null
  icon6?: Record<string, unknown> | null
  textLabel6?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  header: {
    "aria-hidden": "false",
    className: "sdn-header sdn-header--qqif",
  },
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
  image2: {
    src: "https://static.seldon.app/background-default-dark.jpg",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--w46q",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--auwd",
  },
  textTitle: {
    children: "Title",
    className: "sdn-text-title sdn-text-label--yqnd",
  },
  textSubtitle: {
    children: "Subtitle",
    className: "sdn-text-subtitle sdn-text-subtitle--pyri",
  },
  textDescription: {
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus. Donec euismod in fringilla.",
    className: "sdn-text-description sdn-text-description--qqmc",
  },
  barButtons: {
    "aria-hidden": "false",
    className: "sdn-bar-buttons sdn-bar-buttons--icjh",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ysu5",
  },
  button2: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon2: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel2: {
    children: "Button",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button3: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon3: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel3: {
    children: "Button",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button4: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon4: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel4: {
    children: "Button",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nzij",
  },
  button5: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon5: {
    icon: "seldon-none",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel5: {
    children: "Cancel",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button6: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon6: {
    icon: "material-check",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel6: {
    children: "OK",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-card-stacked", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const headerProps = computed(() => mergeSlot(sdn.header, props.header, props.seldonRefs))
const avatarProps = computed(() => mergeSlot(sdn.avatar, props.avatar, props.seldonRefs))
const imageProps = computed(() => mergeSlot(sdn.image, props.image, props.seldonRefs))
const buttonProps = computed(() => mergeSlot(sdn.button, props.button, props.seldonRefs))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const image2Props = computed(() => mergeSlot(sdn.image2, props.image2, props.seldonRefs))
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const textTitleProps = computed(() =>
  mergeOptionalSlot(sdn.textTitle, props.textTitle, props.seldonRefs),
)
const textSubtitleProps = computed(() =>
  mergeOptionalSlot(sdn.textSubtitle, props.textSubtitle, props.seldonRefs),
)
const textDescriptionProps = computed(() =>
  mergeOptionalSlot(sdn.textDescription, props.textDescription, props.seldonRefs),
)
const barButtonsProps = computed(() =>
  mergeSlot(sdn.barButtons, props.barButtons, props.seldonRefs),
)
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const button2Props = computed(() => mergeOptionalSlot(sdn.button2, props.button2, props.seldonRefs))
const icon2Props = computed(() => mergeOptionalSlot(sdn.icon2, props.icon2, props.seldonRefs))
const textLabel2Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs),
)
const button3Props = computed(() => mergeOptionalSlot(sdn.button3, props.button3, props.seldonRefs))
const icon3Props = computed(() => mergeOptionalSlot(sdn.icon3, props.icon3, props.seldonRefs))
const textLabel3Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs),
)
const button4Props = computed(() => mergeOptionalSlot(sdn.button4, props.button4, props.seldonRefs))
const icon4Props = computed(() => mergeOptionalSlot(sdn.icon4, props.icon4, props.seldonRefs))
const textLabel4Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel4, props.textLabel4, props.seldonRefs),
)
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3, props.seldonRefs))
const button5Props = computed(() => mergeOptionalSlot(sdn.button5, props.button5, props.seldonRefs))
const icon5Props = computed(() => mergeSlot(sdn.icon5, props.icon5, props.seldonRefs))
const textLabel5Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel5, props.textLabel5, props.seldonRefs),
)
const button6Props = computed(() => mergeOptionalSlot(sdn.button6, props.button6, props.seldonRefs))
const icon6Props = computed(() => mergeSlot(sdn.icon6, props.icon6, props.seldonRefs))
const textLabel6Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel6, props.textLabel6, props.seldonRefs),
)
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Header
        v-if="headerProps !== null"
        v-bind="headerProps"
        :avatar="avatarProps"
        :image="imageProps"
        :button="buttonProps"
        :icon="iconProps"
        :textLabel="textLabelProps"
      />
      <Image v-if="image2Props !== null" v-bind="image2Props" />
      <Frame v-bind="frameProps">
        <TextTitle v-if="textTitleProps !== null" v-bind="textTitleProps" />
        <TextSubtitle v-if="textSubtitleProps !== null" v-bind="textSubtitleProps" />
      </Frame>
      <TextDescription v-if="textDescriptionProps !== null" v-bind="textDescriptionProps" />
      <BarButtons v-if="barButtonsProps !== null" v-bind="barButtonsProps">
        <Frame v-bind="frame2Props" v-if="frame2Props !== null">
          <Button v-if="button2Props !== null" v-bind="button2Props">
            <Icon v-if="icon2Props !== null" v-bind="icon2Props" />
            <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
          </Button>
          <Button v-if="button3Props !== null" v-bind="button3Props">
            <Icon v-if="icon3Props !== null" v-bind="icon3Props" />
            <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
          </Button>
          <Button v-if="button4Props !== null" v-bind="button4Props">
            <Icon v-if="icon4Props !== null" v-bind="icon4Props" />
            <TextLabel v-if="textLabel4Props !== null" v-bind="textLabel4Props" />
          </Button>
        </Frame>
        <Frame v-bind="frame3Props" v-if="frame3Props !== null">
          <Button v-if="button5Props !== null" v-bind="button5Props">
            <Icon v-if="icon5Props !== null" v-bind="icon5Props" />
            <TextLabel v-if="textLabel5Props !== null" v-bind="textLabel5Props" />
          </Button>
          <Button v-if="button6Props !== null" v-bind="button6Props">
            <Icon v-if="icon6Props !== null" v-bind="icon6Props" />
            <TextLabel v-if="textLabel6Props !== null" v-bind="textLabel6Props" />
          </Button>
        </Frame>
      </BarButtons>
    </slot>
  </div>
</template>
