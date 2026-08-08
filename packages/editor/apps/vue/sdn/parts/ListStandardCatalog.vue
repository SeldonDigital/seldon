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
 * List: StandardCatalog
 * Level: Part
 * Intent: General-purpose vertical list schema for rendering repeated content items such as posts, links, or summaries.
 * Tags: list, standard, vertical, ui, content, items, generic, repeater
 * Type: Inline
 *
 * Structure:
 *   TextSubtitle        textSubtitle
 *   Container           container      -> catalogItems
 *     ItemCatalog       itemCatalog
 *       Icon            icon
 *       Frame           frame
 *         TextTitle     textTitle
 *         TextSubtitle  textSubtitle2
 *     ItemCatalog       itemCatalog2
 *       Icon            icon2
 *       Frame           frame2
 *         TextTitle     textTitle2
 *         TextSubtitle  textSubtitle3
 *     ItemCatalog       itemCatalog3
 *       Icon            icon3
 *       Frame           frame3
 *         TextTitle     textTitle3
 *         TextSubtitle  textSubtitle4
 *     ItemCatalog       itemCatalog4
 *       Icon            icon4
 *       Frame           frame4
 *         TextTitle     textTitle4
 *         TextSubtitle  textSubtitle5
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
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import ItemCatalog from "../elements/ItemCatalog.vue"
import Frame from "../frames/Frame.vue"
import Icon from "../primitives/Icon.vue"
import TextSubtitle from "../primitives/TextSubtitle.vue"
import TextTitle from "../primitives/TextTitle.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

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
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  textSubtitle: {
    children: "Component Level",
    className: "sdn-text-subtitle sdn-text-title--drqy",
  },
  container: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--x52o",
    "data-seldon-ref": "catalogItems",
  },
  itemCatalog: {
    className: "sdn-item-catalog sdn-item-catalog--ieif",
  },
  icon: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--km45",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle: {
    children: "Product Name",
    className: "sdn-text-title sdn-text-title--dr0a",
  },
  textSubtitle2: {
    children: "Details",
    className: "sdn-text-subtitle sdn-text-subtitle--uv0m",
  },
  itemCatalog2: {
    className: "sdn-item-catalog sdn-item-catalog--ieif",
  },
  icon2: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--km45",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle2: {
    children: "Product Name",
    className: "sdn-text-title sdn-text-title--matt",
  },
  textSubtitle3: {
    children: "Details",
    className: "sdn-text-subtitle sdn-text-subtitle--b0xy",
  },
  itemCatalog3: {
    className: "sdn-item-catalog sdn-item-catalog--ieif",
  },
  icon3: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--km45",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle3: {
    children: "Product Name",
    className: "sdn-text-title sdn-text-title--matt",
  },
  textSubtitle4: {
    children: "Details",
    className: "sdn-text-subtitle sdn-text-subtitle--b0xy",
  },
  itemCatalog4: {
    className: "sdn-item-catalog sdn-item-catalog--ieif",
  },
  icon4: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--km45",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle4: {
    children: "Product Name",
    className: "sdn-text-title sdn-text-title--matt",
  },
  textSubtitle5: {
    children: "Details",
    className: "sdn-text-subtitle sdn-text-subtitle--b0xy",
  },
}

const rootClassName = computed(() =>
  combineClassNames("sdn-list-standard-catalog", props.className),
)
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const textSubtitleProps = computed(() =>
  mergeOptionalSlot(sdn.textSubtitle, props.textSubtitle, props.seldonRefs),
)
const containerProps = computed(() => mergeSlot(sdn.container, props.container, props.seldonRefs))
const itemCatalogProps = computed(() =>
  mergeOptionalSlot(sdn.itemCatalog, props.itemCatalog, props.seldonRefs),
)
const iconProps = computed(() => mergeOptionalSlot(sdn.icon, props.icon, props.seldonRefs))
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const textTitleProps = computed(() =>
  mergeOptionalSlot(sdn.textTitle, props.textTitle, props.seldonRefs),
)
const textSubtitle2Props = computed(() =>
  mergeOptionalSlot(sdn.textSubtitle2, props.textSubtitle2, props.seldonRefs),
)
const itemCatalog2Props = computed(() =>
  mergeOptionalSlot(sdn.itemCatalog2, props.itemCatalog2, props.seldonRefs),
)
const icon2Props = computed(() => mergeOptionalSlot(sdn.icon2, props.icon2, props.seldonRefs))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const textTitle2Props = computed(() =>
  mergeOptionalSlot(sdn.textTitle2, props.textTitle2, props.seldonRefs),
)
const textSubtitle3Props = computed(() =>
  mergeOptionalSlot(sdn.textSubtitle3, props.textSubtitle3, props.seldonRefs),
)
const itemCatalog3Props = computed(() =>
  mergeOptionalSlot(sdn.itemCatalog3, props.itemCatalog3, props.seldonRefs),
)
const icon3Props = computed(() => mergeOptionalSlot(sdn.icon3, props.icon3, props.seldonRefs))
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3, props.seldonRefs))
const textTitle3Props = computed(() =>
  mergeOptionalSlot(sdn.textTitle3, props.textTitle3, props.seldonRefs),
)
const textSubtitle4Props = computed(() =>
  mergeOptionalSlot(sdn.textSubtitle4, props.textSubtitle4, props.seldonRefs),
)
const itemCatalog4Props = computed(() =>
  mergeOptionalSlot(sdn.itemCatalog4, props.itemCatalog4, props.seldonRefs),
)
const icon4Props = computed(() => mergeOptionalSlot(sdn.icon4, props.icon4, props.seldonRefs))
const frame4Props = computed(() => mergeSlot(sdn.frame4, props.frame4, props.seldonRefs))
const textTitle4Props = computed(() =>
  mergeOptionalSlot(sdn.textTitle4, props.textTitle4, props.seldonRefs),
)
const textSubtitle5Props = computed(() =>
  mergeOptionalSlot(sdn.textSubtitle5, props.textSubtitle5, props.seldonRefs),
)
</script>

<template>
  <ul :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <TextSubtitle v-if="textSubtitleProps !== null" v-bind="textSubtitleProps" />
      <Frame v-bind="containerProps" v-if="containerProps !== null">
        <ItemCatalog v-if="itemCatalogProps !== null" v-bind="itemCatalogProps">
          <Icon v-if="iconProps !== null" v-bind="iconProps" />
          <Frame v-bind="frameProps" v-if="frameProps !== null">
            <TextTitle v-if="textTitleProps !== null" v-bind="textTitleProps" />
            <TextSubtitle v-if="textSubtitle2Props !== null" v-bind="textSubtitle2Props" />
          </Frame>
        </ItemCatalog>
        <ItemCatalog v-if="itemCatalog2Props !== null" v-bind="itemCatalog2Props">
          <Icon v-if="icon2Props !== null" v-bind="icon2Props" />
          <Frame v-bind="frame2Props" v-if="frame2Props !== null">
            <TextTitle v-if="textTitle2Props !== null" v-bind="textTitle2Props" />
            <TextSubtitle v-if="textSubtitle3Props !== null" v-bind="textSubtitle3Props" />
          </Frame>
        </ItemCatalog>
        <ItemCatalog v-if="itemCatalog3Props !== null" v-bind="itemCatalog3Props">
          <Icon v-if="icon3Props !== null" v-bind="icon3Props" />
          <Frame v-bind="frame3Props" v-if="frame3Props !== null">
            <TextTitle v-if="textTitle3Props !== null" v-bind="textTitle3Props" />
            <TextSubtitle v-if="textSubtitle4Props !== null" v-bind="textSubtitle4Props" />
          </Frame>
        </ItemCatalog>
        <ItemCatalog v-if="itemCatalog4Props !== null" v-bind="itemCatalog4Props">
          <Icon v-if="icon4Props !== null" v-bind="icon4Props" />
          <Frame v-bind="frame4Props" v-if="frame4Props !== null">
            <TextTitle v-if="textTitle4Props !== null" v-bind="textTitle4Props" />
            <TextSubtitle v-if="textSubtitle5Props !== null" v-bind="textSubtitle5Props" />
          </Frame>
        </ItemCatalog>
      </Frame>
    </slot>
  </ul>
</template>
