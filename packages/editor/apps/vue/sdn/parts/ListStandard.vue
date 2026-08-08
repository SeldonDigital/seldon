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
 * List: Standard
 * Level: Part
 * Intent: General-purpose vertical list schema for rendering repeated content items such as posts, links, or summaries.
 * Tags: list, standard, vertical, ui, content, items, generic, repeater
 * Type: Default
 *
 * Structure:
 *   Item              item
 *     InputCheckbox   inputCheckbox
 *     Frame           frame
 *       TextTitle     textTitle
 *       TextSubtitle  textSubtitle
 *     Button          button
 *       Icon          icon
 *       TextLabel     textLabel
 *   Item              item2
 *     InputCheckbox   inputCheckbox2
 *     Frame           frame2
 *       TextTitle     textTitle2
 *       TextSubtitle  textSubtitle2
 *     Button          button2
 *       Icon          icon2
 *       TextLabel     textLabel2
 *   Item              item3
 *     InputCheckbox   inputCheckbox3
 *     Frame           frame3
 *       TextTitle     textTitle3
 *       TextSubtitle  textSubtitle3
 *     Button          button3
 *       Icon          icon3
 *       TextLabel     textLabel3
 *
 * @example
 * ```vue
 * <ListStandard
 *   aria-hidden="false"
 *   item="{}"
 *   inputCheckbox="{}"
 *   frame="{}"
 *   textTitle="Product Title"
 *   textSubtitle2="Product Title"
 *   button={() => {}}
 *   icon="material-star"
 *   textLabel="{}"
 *   item2="{}"
 *   item3="{}"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import Button from "../elements/Button.vue"
import Item from "../elements/Item.vue"
import Frame from "../frames/Frame.vue"
import Icon from "../primitives/Icon.vue"
import InputCheckbox from "../primitives/InputCheckbox.vue"
import TextLabel from "../primitives/TextLabel.vue"
import TextSubtitle from "../primitives/TextSubtitle.vue"
import TextTitle from "../primitives/TextTitle.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  item?: Record<string, unknown> | null
  inputCheckbox?: Record<string, unknown> | null
  frame?: Record<string, unknown> | null
  textTitle?: Record<string, unknown> | null
  textSubtitle?: Record<string, unknown> | null
  button?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  item2?: Record<string, unknown> | null
  inputCheckbox2?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  textTitle2?: Record<string, unknown> | null
  textSubtitle2?: Record<string, unknown> | null
  button2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  item3?: Record<string, unknown> | null
  inputCheckbox3?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
  textTitle3?: Record<string, unknown> | null
  textSubtitle3?: Record<string, unknown> | null
  button3?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  item: {
    "aria-hidden": "false",
    className: "sdn-item sdn-item--vvmc",
  },
  inputCheckbox: {
    placeholder: "Placeholder text",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle: {
    children: "Title",
    className: "sdn-text-title sdn-text-title--drqy",
  },
  textSubtitle: {
    children: "Subtitle",
    className: "sdn-text-subtitle sdn-text-subtitle--pyri",
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
  item2: {
    "aria-hidden": "false",
    className: "sdn-item sdn-item--vvmc",
  },
  inputCheckbox2: {
    placeholder: "Placeholder text",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle2: {
    children: "Title",
    className: "sdn-text-title sdn-text-title--drqy",
  },
  textSubtitle2: {
    children: "Subtitle",
    className: "sdn-text-subtitle sdn-text-subtitle--pyri",
  },
  button2: {
    className: "sdn-button sdn-button-iconic--pgsr",
  },
  icon2: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
  },
  textLabel2: {
    children: "Button",
    className: "sdn-text-label sdn-text-label--ylte",
  },
  item3: {
    "aria-hidden": "false",
    className: "sdn-item sdn-item--7egk",
  },
  inputCheckbox3: {
    placeholder: "Placeholder text",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle3: {
    children: "Title",
    className: "sdn-text-title sdn-text-title--drqy",
  },
  textSubtitle3: {
    children: "Subtitle",
    className: "sdn-text-subtitle sdn-text-subtitle--pyri",
  },
  button3: {
    className: "sdn-button sdn-button-iconic--pgsr",
  },
  icon3: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
  },
  textLabel3: {
    children: "Button",
    className: "sdn-text-label sdn-text-label--ylte",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-list-standard", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const itemProps = computed(() => mergeSlot(sdn.item, props.item, props.seldonRefs))
const inputCheckboxProps = computed(() =>
  mergeOptionalSlot(sdn.inputCheckbox, props.inputCheckbox, props.seldonRefs),
)
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const textTitleProps = computed(() =>
  mergeOptionalSlot(sdn.textTitle, props.textTitle, props.seldonRefs),
)
const textSubtitleProps = computed(() =>
  mergeOptionalSlot(sdn.textSubtitle, props.textSubtitle, props.seldonRefs),
)
const buttonProps = computed(() => mergeSlot(sdn.button, props.button, props.seldonRefs))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const item2Props = computed(() => mergeSlot(sdn.item2, props.item2, props.seldonRefs))
const inputCheckbox2Props = computed(() =>
  mergeOptionalSlot(sdn.inputCheckbox2, props.inputCheckbox2, props.seldonRefs),
)
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const textTitle2Props = computed(() =>
  mergeOptionalSlot(sdn.textTitle2, props.textTitle2, props.seldonRefs),
)
const textSubtitle2Props = computed(() =>
  mergeOptionalSlot(sdn.textSubtitle2, props.textSubtitle2, props.seldonRefs),
)
const button2Props = computed(() => mergeSlot(sdn.button2, props.button2, props.seldonRefs))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2, props.seldonRefs))
const textLabel2Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs),
)
const item3Props = computed(() => mergeSlot(sdn.item3, props.item3, props.seldonRefs))
const inputCheckbox3Props = computed(() =>
  mergeOptionalSlot(sdn.inputCheckbox3, props.inputCheckbox3, props.seldonRefs),
)
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3, props.seldonRefs))
const textTitle3Props = computed(() =>
  mergeOptionalSlot(sdn.textTitle3, props.textTitle3, props.seldonRefs),
)
const textSubtitle3Props = computed(() =>
  mergeOptionalSlot(sdn.textSubtitle3, props.textSubtitle3, props.seldonRefs),
)
const button3Props = computed(() => mergeSlot(sdn.button3, props.button3, props.seldonRefs))
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3, props.seldonRefs))
const textLabel3Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs),
)
</script>

<template>
  <ul :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Item v-if="itemProps !== null" v-bind="itemProps">
        <InputCheckbox v-if="inputCheckboxProps !== null" v-bind="inputCheckboxProps" />
        <Frame v-bind="frameProps" v-if="frameProps !== null">
          <TextTitle v-if="textTitleProps !== null" v-bind="textTitleProps" />
          <TextSubtitle v-if="textSubtitleProps !== null" v-bind="textSubtitleProps" />
        </Frame>
        <Button v-if="buttonProps !== null" v-bind="buttonProps">
          <Icon v-if="iconProps !== null" v-bind="iconProps" />
          <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
        </Button>
      </Item>
      <Item v-if="item2Props !== null" v-bind="item2Props">
        <InputCheckbox v-if="inputCheckbox2Props !== null" v-bind="inputCheckbox2Props" />
        <Frame v-bind="frame2Props" v-if="frame2Props !== null">
          <TextTitle v-if="textTitle2Props !== null" v-bind="textTitle2Props" />
          <TextSubtitle v-if="textSubtitle2Props !== null" v-bind="textSubtitle2Props" />
        </Frame>
        <Button v-if="button2Props !== null" v-bind="button2Props">
          <Icon v-if="icon2Props !== null" v-bind="icon2Props" />
          <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
        </Button>
      </Item>
      <Item v-if="item3Props !== null" v-bind="item3Props">
        <InputCheckbox v-if="inputCheckbox3Props !== null" v-bind="inputCheckbox3Props" />
        <Frame v-bind="frame3Props" v-if="frame3Props !== null">
          <TextTitle v-if="textTitle3Props !== null" v-bind="textTitle3Props" />
          <TextSubtitle v-if="textSubtitle3Props !== null" v-bind="textSubtitle3Props" />
        </Frame>
        <Button v-if="button3Props !== null" v-bind="button3Props">
          <Icon v-if="icon3Props !== null" v-bind="icon3Props" />
          <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
        </Button>
      </Item>
    </slot>
  </ul>
</template>
