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
 * List: Standard
 * Level: Part
 * Intent: General-purpose vertical list schema for rendering repeated content items such as posts, links, or summaries.
 * Tags: list, standard, vertical, ui, content, items, generic, repeater
 * Type: Default
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
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Frame from "../frames/Frame.vue"
import Button from "../elements/Button.vue"
import Icon from "../primitives/Icon.vue"
import InputCheckbox from "../primitives/InputCheckbox.vue"
import Item from "../elements/Item.vue"
import TextLabel from "../primitives/TextLabel.vue"
import TextSubtitle from "../primitives/TextSubtitle.vue"
import TextTitle from "../primitives/TextTitle.vue"

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
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-list-standard",
  "item": {
    "aria-hidden": "false",
    "className": "sdn-item sdn-item--vvmc"
  },
  "inputCheckbox": {
    "className": "sdn-input-checkbox sdn-input-checkbox--vajr"
  },
  "frame": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--nhfs"
  },
  "textTitle": {
    "className": "sdn-text-title sdn-text-label--yqnd"
  },
  "textSubtitle": {
    "className": "sdn-text-subtitle sdn-text-subtitle--pyri"
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
  },
  "item2": {
    "aria-hidden": "false",
    "className": "sdn-item sdn-item--vvmc"
  },
  "inputCheckbox2": {
    "className": "sdn-input-checkbox sdn-input-checkbox--vajr"
  },
  "frame2": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--nhfs"
  },
  "textTitle2": {
    "className": "sdn-text-title sdn-text-label--yqnd"
  },
  "textSubtitle2": {
    "className": "sdn-text-subtitle sdn-text-subtitle--pyri"
  },
  "button2": {
    "className": "sdn-button sdn-button-iconic--pgsr"
  },
  "icon2": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--umgs"
  },
  "textLabel2": {
    "className": "sdn-text-label sdn-text-label--ylte"
  },
  "item3": {
    "aria-hidden": "false",
    "className": "sdn-item sdn-item--7egk"
  },
  "inputCheckbox3": {
    "className": "sdn-input-checkbox sdn-input-checkbox--vajr"
  },
  "frame3": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--nhfs"
  },
  "textTitle3": {
    "className": "sdn-text-title sdn-text-label--yqnd"
  },
  "textSubtitle3": {
    "className": "sdn-text-subtitle sdn-text-subtitle--pyri"
  },
  "button3": {
    "className": "sdn-button sdn-button-iconic--pgsr"
  },
  "icon3": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--umgs"
  },
  "textLabel3": {
    "className": "sdn-text-label sdn-text-label--ylte"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-list-standard", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const itemProps = computed(() => mergeSlot(sdn.item, props.item))
const inputCheckboxProps = computed(() => mergeSlot(sdn.inputCheckbox, props.inputCheckbox))
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame))
const textTitleProps = computed(() => mergeSlot(sdn.textTitle, props.textTitle))
const textSubtitleProps = computed(() => mergeSlot(sdn.textSubtitle, props.textSubtitle))
const buttonProps = computed(() => mergeSlot(sdn.button, props.button))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const item2Props = computed(() => mergeSlot(sdn.item2, props.item2))
const inputCheckbox2Props = computed(() => mergeSlot(sdn.inputCheckbox2, props.inputCheckbox2))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2))
const textTitle2Props = computed(() => mergeSlot(sdn.textTitle2, props.textTitle2))
const textSubtitle2Props = computed(() => mergeSlot(sdn.textSubtitle2, props.textSubtitle2))
const button2Props = computed(() => mergeSlot(sdn.button2, props.button2))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2))
const textLabel2Props = computed(() => mergeSlot(sdn.textLabel2, props.textLabel2))
const item3Props = computed(() => mergeSlot(sdn.item3, props.item3))
const inputCheckbox3Props = computed(() => mergeSlot(sdn.inputCheckbox3, props.inputCheckbox3))
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3))
const textTitle3Props = computed(() => mergeSlot(sdn.textTitle3, props.textTitle3))
const textSubtitle3Props = computed(() => mergeSlot(sdn.textSubtitle3, props.textSubtitle3))
const button3Props = computed(() => mergeSlot(sdn.button3, props.button3))
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3))
const textLabel3Props = computed(() => mergeSlot(sdn.textLabel3, props.textLabel3))
</script>

<template>
    <ul :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Item v-if="itemProps !== null" v-bind="itemProps">
          <InputCheckbox v-if="inputCheckbox && inputCheckboxProps" v-bind="inputCheckboxProps" />
          <Frame v-bind="frameProps" v-if="frame">
            <TextTitle v-if="textTitle && textTitleProps" v-bind="textTitleProps" />
            <TextSubtitle v-if="textSubtitle && textSubtitleProps" v-bind="textSubtitleProps" />
          </Frame>
          <Button v-if="buttonProps !== null" v-bind="buttonProps">
            <Icon v-if="iconProps !== null" v-bind="iconProps" />
            <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
          </Button>
        </Item>
        <Item v-if="item2Props !== null" v-bind="item2Props">
          <InputCheckbox v-if="inputCheckbox2 && inputCheckbox2Props" v-bind="inputCheckbox2Props" />
          <Frame v-bind="frame2Props" v-if="frame2">
            <TextTitle v-if="textTitle2 && textTitle2Props" v-bind="textTitle2Props" />
            <TextSubtitle v-if="textSubtitle2 && textSubtitle2Props" v-bind="textSubtitle2Props" />
          </Frame>
          <Button v-if="button2Props !== null" v-bind="button2Props">
            <Icon v-if="icon2Props !== null" v-bind="icon2Props" />
            <TextLabel v-if="textLabel2 && textLabel2Props" v-bind="textLabel2Props" />
          </Button>
        </Item>
        <Item v-if="item3Props !== null" v-bind="item3Props">
          <InputCheckbox v-if="inputCheckbox3 && inputCheckbox3Props" v-bind="inputCheckbox3Props" />
          <Frame v-bind="frame3Props" v-if="frame3">
            <TextTitle v-if="textTitle3 && textTitle3Props" v-bind="textTitle3Props" />
            <TextSubtitle v-if="textSubtitle3 && textSubtitle3Props" v-bind="textSubtitle3Props" />
          </Frame>
          <Button v-if="button3Props !== null" v-bind="button3Props">
            <Icon v-if="icon3Props !== null" v-bind="icon3Props" />
            <TextLabel v-if="textLabel3 && textLabel3Props" v-bind="textLabel3Props" />
          </Button>
        </Item>
      </slot>
    </ul>
</template>
