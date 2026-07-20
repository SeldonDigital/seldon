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
 * List: StandardCatalog
 * Level: Part
 * Intent: General-purpose vertical list schema for rendering repeated content items such as posts, links, or summaries.
 * Tags: list, standard, vertical, ui, content, items, generic, repeater
 * Type: Inline
 *
 * @example
 * ```vue
 * <ListStandardCatalog
 *   aria-hidden="false"
 *   textSubtitle="Product Title"
 *   container="{}"
 *   itemCatalog="{}"
 *   icon="material-star"
 *   frame="{}"
 *   textTitle="Product Title"
 *   textSubtitle2="Product Title"
 *   itemCatalog2="{}"
 *   itemCatalog3="{}"
 *   itemCatalog4="{}"
 * />
 * ```
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Frame from "../frames/Frame.vue"
import Icon from "../primitives/Icon.vue"
import ItemCatalog from "../elements/ItemCatalog.vue"
import TextSubtitle from "../primitives/TextSubtitle.vue"
import TextTitle from "../primitives/TextTitle.vue"

const props = defineProps<{
  className?: string
  textSubtitle?: Record<string, unknown> | null
  container?: Record<string, unknown> | null
  itemCatalog?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  frame?: Record<string, unknown> | null
  textTitle?: Record<string, unknown> | null
  textSubtitle2?: Record<string, unknown> | null
  itemCatalog2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  textTitle2?: Record<string, unknown> | null
  textSubtitle3?: Record<string, unknown> | null
  itemCatalog3?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
  textTitle3?: Record<string, unknown> | null
  textSubtitle4?: Record<string, unknown> | null
  itemCatalog4?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  frame4?: Record<string, unknown> | null
  textTitle4?: Record<string, unknown> | null
  textSubtitle5?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-list-standard-catalog sdn-list-standard",
  "textSubtitle": {
    "className": "sdn-text-subtitle sdn-text-label--yqnd"
  },
  "container": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--x52o",
    "data-seldon-ref": "catalogItems"
  },
  "itemCatalog": {
    "className": "sdn-item-catalog sdn-item-catalog--ieif"
  },
  "icon": {
    "className": "sdn-icon sdn-icon--km45"
  },
  "frame": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--nhfs"
  },
  "textTitle": {
    "className": "sdn-text-title sdn-text-title--dr0a"
  },
  "textSubtitle2": {
    "className": "sdn-text-subtitle sdn-text-subtitle--uv0m"
  },
  "itemCatalog2": {
    "className": "sdn-item-catalog sdn-item-catalog--ieif"
  },
  "icon2": {
    "className": "sdn-icon sdn-icon--km45"
  },
  "frame2": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--nhfs"
  },
  "textTitle2": {
    "className": "sdn-text-title sdn-text-title--matt"
  },
  "textSubtitle3": {
    "className": "sdn-text-subtitle sdn-text-subtitle--b0xy"
  },
  "itemCatalog3": {
    "className": "sdn-item-catalog sdn-item-catalog--ieif"
  },
  "icon3": {
    "className": "sdn-icon sdn-icon--km45"
  },
  "frame3": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--nhfs"
  },
  "textTitle3": {
    "className": "sdn-text-title sdn-text-title--matt"
  },
  "textSubtitle4": {
    "className": "sdn-text-subtitle sdn-text-subtitle--b0xy"
  },
  "itemCatalog4": {
    "className": "sdn-item-catalog sdn-item-catalog--ieif"
  },
  "icon4": {
    "className": "sdn-icon sdn-icon--km45"
  },
  "frame4": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--nhfs"
  },
  "textTitle4": {
    "className": "sdn-text-title sdn-text-title--matt"
  },
  "textSubtitle5": {
    "className": "sdn-text-subtitle sdn-text-subtitle--b0xy"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-list-standard-catalog", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const textSubtitleProps = computed(() => mergeSlot(sdn.textSubtitle, props.textSubtitle))
const containerProps = computed(() => mergeSlot(sdn.container, props.container))
const itemCatalogProps = computed(() => mergeSlot(sdn.itemCatalog, props.itemCatalog))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame))
const textTitleProps = computed(() => mergeSlot(sdn.textTitle, props.textTitle))
const textSubtitle2Props = computed(() => mergeSlot(sdn.textSubtitle2, props.textSubtitle2))
const itemCatalog2Props = computed(() => mergeSlot(sdn.itemCatalog2, props.itemCatalog2))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2))
const textTitle2Props = computed(() => mergeSlot(sdn.textTitle2, props.textTitle2))
const textSubtitle3Props = computed(() => mergeSlot(sdn.textSubtitle3, props.textSubtitle3))
const itemCatalog3Props = computed(() => mergeSlot(sdn.itemCatalog3, props.itemCatalog3))
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3))
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3))
const textTitle3Props = computed(() => mergeSlot(sdn.textTitle3, props.textTitle3))
const textSubtitle4Props = computed(() => mergeSlot(sdn.textSubtitle4, props.textSubtitle4))
const itemCatalog4Props = computed(() => mergeSlot(sdn.itemCatalog4, props.itemCatalog4))
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4))
const frame4Props = computed(() => mergeSlot(sdn.frame4, props.frame4))
const textTitle4Props = computed(() => mergeSlot(sdn.textTitle4, props.textTitle4))
const textSubtitle5Props = computed(() => mergeSlot(sdn.textSubtitle5, props.textSubtitle5))
</script>

<template>
    <ul :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <TextSubtitle v-if="textSubtitle && textSubtitleProps" v-bind="textSubtitleProps" />
        <Frame v-bind="containerProps" v-if="container">
          <ItemCatalog v-if="itemCatalog && itemCatalogProps" v-bind="itemCatalogProps">
            <Icon v-if="icon && iconProps" v-bind="iconProps" />
            <Frame v-bind="frameProps" v-if="frame">
              <TextTitle v-if="textTitle && textTitleProps" v-bind="textTitleProps" />
              <TextSubtitle v-if="textSubtitle2 && textSubtitle2Props" v-bind="textSubtitle2Props" />
            </Frame>
          </ItemCatalog>
          <ItemCatalog v-if="itemCatalog2 && itemCatalog2Props" v-bind="itemCatalog2Props">
            <Icon v-if="icon2 && icon2Props" v-bind="icon2Props" />
            <Frame v-bind="frame2Props" v-if="frame2">
              <TextTitle v-if="textTitle2 && textTitle2Props" v-bind="textTitle2Props" />
              <TextSubtitle v-if="textSubtitle3 && textSubtitle3Props" v-bind="textSubtitle3Props" />
            </Frame>
          </ItemCatalog>
          <ItemCatalog v-if="itemCatalog3 && itemCatalog3Props" v-bind="itemCatalog3Props">
            <Icon v-if="icon3 && icon3Props" v-bind="icon3Props" />
            <Frame v-bind="frame3Props" v-if="frame3">
              <TextTitle v-if="textTitle3 && textTitle3Props" v-bind="textTitle3Props" />
              <TextSubtitle v-if="textSubtitle4 && textSubtitle4Props" v-bind="textSubtitle4Props" />
            </Frame>
          </ItemCatalog>
          <ItemCatalog v-if="itemCatalog4 && itemCatalog4Props" v-bind="itemCatalog4Props">
            <Icon v-if="icon4 && icon4Props" v-bind="icon4Props" />
            <Frame v-bind="frame4Props" v-if="frame4">
              <TextTitle v-if="textTitle4 && textTitle4Props" v-bind="textTitle4Props" />
              <TextSubtitle v-if="textSubtitle5 && textSubtitle5Props" v-bind="textSubtitle5Props" />
            </Frame>
          </ItemCatalog>
        </Frame>
      </slot>
    </ul>
</template>
