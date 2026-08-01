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
 * Part: TokenPreview
 * Level: Part
 * Intent: Used for preview and properties badges over the canvas.
 * Tags: Properties, tokens, margins, padding, orientation, align, gap
 * Type: Inline
 *
 * Structure:
 *   Container             container
 *     Frame               frame
 *       ItemAvatarItem    itemAvatarItem
 *         Frame           frame2
 *           TextTitle     textTitle
 *           TextSubtitle  textSubtitle
 *     Frame               frame3
 *       ItemAvatarItem    itemAvatarItem2
 *         Frame           frame4
 *           TextTitle     textTitle2
 *           TextSubtitle  textSubtitle2
 *     Frame               frame5
 *       ItemAvatarItem    itemAvatarItem3
 *         Frame           frame6
 *           TextTitle     textTitle3
 *           TextSubtitle  textSubtitle3
 *     Frame               frame7
 *       ItemAvatarItem    itemAvatarItem4
 *         Frame           frame8
 *           TextTitle     textTitle4
 *           TextSubtitle  textSubtitle4
 *     Frame               frame9
 *       ItemAvatarItem    itemAvatarItem5
 *         Frame           frame10
 *           TextTitle     textTitle5
 *           TextSubtitle  textSubtitle5
 *     Frame               frame11
 *       ItemAvatarItem    itemAvatarItem6
 *         Frame           frame12
 *           TextTitle     textTitle6
 *           TextSubtitle  textSubtitle6
 *
 * @example
 * ```vue
 * <TokenPreview
 *   aria-hidden="false"
 *   container="{}"
 *   frame="{}"
 *   itemAvatarItem="{}"
 *   textTitle="Product Title"
 *   textSubtitle2="Product Title"
 *   frame2="{}"
 *   frame3="{}"
 *   frame4="{}"
 *   frame5="{}"
 *   frame6="{}"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import ItemAvatarItem from "../elements/ItemAvatarItem.vue"
import Frame from "../frames/Frame.vue"
import TextSubtitle from "../primitives/TextSubtitle.vue"
import TextTitle from "../primitives/TextTitle.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  container?: Record<string, unknown> | null
  frame?: Record<string, unknown> | null
  itemAvatarItem?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  textTitle?: Record<string, unknown> | null
  textSubtitle?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
  itemAvatarItem2?: Record<string, unknown> | null
  frame4?: Record<string, unknown> | null
  textTitle2?: Record<string, unknown> | null
  textSubtitle2?: Record<string, unknown> | null
  frame5?: Record<string, unknown> | null
  itemAvatarItem3?: Record<string, unknown> | null
  frame6?: Record<string, unknown> | null
  textTitle3?: Record<string, unknown> | null
  textSubtitle3?: Record<string, unknown> | null
  frame7?: Record<string, unknown> | null
  itemAvatarItem4?: Record<string, unknown> | null
  frame8?: Record<string, unknown> | null
  textTitle4?: Record<string, unknown> | null
  textSubtitle4?: Record<string, unknown> | null
  frame9?: Record<string, unknown> | null
  itemAvatarItem5?: Record<string, unknown> | null
  frame10?: Record<string, unknown> | null
  textTitle5?: Record<string, unknown> | null
  textSubtitle5?: Record<string, unknown> | null
  frame11?: Record<string, unknown> | null
  itemAvatarItem6?: Record<string, unknown> | null
  frame12?: Record<string, unknown> | null
  textTitle6?: Record<string, unknown> | null
  textSubtitle6?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  container: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--eaf4",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--a082",
  },
  itemAvatarItem: {
    "aria-hidden": "false",
    className: "sdn-item sdn-item-avatar-item--lrtt",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle: {
    children: "Full Name",
    htmlElement: "h4",
    "aria-hidden": "false",
    className: "sdn-text-title sdn-text-title--zbun",
  },
  textSubtitle: {
    children: "12px · 0.5rem",
    htmlElement: "h5",
    "aria-hidden": "false",
    className: "sdn-text-subtitle sdn-text-subtitle--7zxo",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ijvp",
  },
  itemAvatarItem2: {
    "aria-hidden": "false",
    className: "sdn-item sdn-item-avatar-item--8cdo",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle2: {
    children: "Tight",
    htmlElement: "h4",
    "aria-hidden": "false",
    className: "sdn-text-title sdn-text-title--zbun",
  },
  textSubtitle2: {
    children: "12px · 0.5rem",
    htmlElement: "h5",
    "aria-hidden": "false",
    className: "sdn-text-subtitle sdn-text-subtitle--7zxo",
  },
  frame5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ijvp",
  },
  itemAvatarItem3: {
    "aria-hidden": "false",
    className: "sdn-item sdn-item-avatar-item--39hf",
  },
  frame6: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle3: {
    children: "Compact",
    htmlElement: "h4",
    "aria-hidden": "false",
    className: "sdn-text-title sdn-text-title--zbun",
  },
  textSubtitle3: {
    children: "12px · 0.5rem",
    htmlElement: "h5",
    "aria-hidden": "false",
    className: "sdn-text-subtitle sdn-text-subtitle--7zxo",
  },
  frame7: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ijvp",
  },
  itemAvatarItem4: {
    "aria-hidden": "false",
    className: "sdn-item sdn-item-avatar-item--oect",
  },
  frame8: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle4: {
    children: "Cozy",
    htmlElement: "h4",
    "aria-hidden": "false",
    className: "sdn-text-title sdn-text-title--zbun",
  },
  textSubtitle4: {
    children: "12px · 0.5rem",
    htmlElement: "h5",
    "aria-hidden": "false",
    className: "sdn-text-subtitle sdn-text-subtitle--7zxo",
  },
  frame9: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ijvp",
  },
  itemAvatarItem5: {
    "aria-hidden": "false",
    className: "sdn-item sdn-item-avatar-item--okng",
  },
  frame10: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle5: {
    children: "Comfortable",
    htmlElement: "h4",
    "aria-hidden": "false",
    className: "sdn-text-title sdn-text-title--zbun",
  },
  textSubtitle5: {
    children: "12px · 0.5rem",
    htmlElement: "h5",
    "aria-hidden": "false",
    className: "sdn-text-subtitle sdn-text-subtitle--7zxo",
  },
  frame11: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ijvp",
  },
  itemAvatarItem6: {
    "aria-hidden": "false",
    className: "sdn-item sdn-item-avatar-item--p1hh",
  },
  frame12: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle6: {
    children: "Open",
    htmlElement: "h4",
    "aria-hidden": "false",
    className: "sdn-text-title sdn-text-title--zbun",
  },
  textSubtitle6: {
    children: "12px · 0.5rem",
    htmlElement: "h5",
    "aria-hidden": "false",
    className: "sdn-text-subtitle sdn-text-subtitle--7zxo",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-frame", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const containerProps = computed(() => mergeSlot(sdn.container, props.container, props.seldonRefs))
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const itemAvatarItemProps = computed(() =>
  mergeOptionalSlot(sdn.itemAvatarItem, props.itemAvatarItem, props.seldonRefs),
)
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const textTitleProps = computed(() =>
  mergeOptionalSlot(sdn.textTitle, props.textTitle, props.seldonRefs),
)
const textSubtitleProps = computed(() =>
  mergeOptionalSlot(sdn.textSubtitle, props.textSubtitle, props.seldonRefs),
)
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3, props.seldonRefs))
const itemAvatarItem2Props = computed(() =>
  mergeOptionalSlot(sdn.itemAvatarItem2, props.itemAvatarItem2, props.seldonRefs),
)
const frame4Props = computed(() => mergeSlot(sdn.frame4, props.frame4, props.seldonRefs))
const textTitle2Props = computed(() =>
  mergeOptionalSlot(sdn.textTitle2, props.textTitle2, props.seldonRefs),
)
const textSubtitle2Props = computed(() =>
  mergeOptionalSlot(sdn.textSubtitle2, props.textSubtitle2, props.seldonRefs),
)
const frame5Props = computed(() => mergeSlot(sdn.frame5, props.frame5, props.seldonRefs))
const itemAvatarItem3Props = computed(() =>
  mergeOptionalSlot(sdn.itemAvatarItem3, props.itemAvatarItem3, props.seldonRefs),
)
const frame6Props = computed(() => mergeSlot(sdn.frame6, props.frame6, props.seldonRefs))
const textTitle3Props = computed(() =>
  mergeOptionalSlot(sdn.textTitle3, props.textTitle3, props.seldonRefs),
)
const textSubtitle3Props = computed(() =>
  mergeOptionalSlot(sdn.textSubtitle3, props.textSubtitle3, props.seldonRefs),
)
const frame7Props = computed(() => mergeSlot(sdn.frame7, props.frame7, props.seldonRefs))
const itemAvatarItem4Props = computed(() =>
  mergeOptionalSlot(sdn.itemAvatarItem4, props.itemAvatarItem4, props.seldonRefs),
)
const frame8Props = computed(() => mergeSlot(sdn.frame8, props.frame8, props.seldonRefs))
const textTitle4Props = computed(() =>
  mergeOptionalSlot(sdn.textTitle4, props.textTitle4, props.seldonRefs),
)
const textSubtitle4Props = computed(() =>
  mergeOptionalSlot(sdn.textSubtitle4, props.textSubtitle4, props.seldonRefs),
)
const frame9Props = computed(() => mergeSlot(sdn.frame9, props.frame9, props.seldonRefs))
const itemAvatarItem5Props = computed(() =>
  mergeOptionalSlot(sdn.itemAvatarItem5, props.itemAvatarItem5, props.seldonRefs),
)
const frame10Props = computed(() => mergeSlot(sdn.frame10, props.frame10, props.seldonRefs))
const textTitle5Props = computed(() =>
  mergeOptionalSlot(sdn.textTitle5, props.textTitle5, props.seldonRefs),
)
const textSubtitle5Props = computed(() =>
  mergeOptionalSlot(sdn.textSubtitle5, props.textSubtitle5, props.seldonRefs),
)
const frame11Props = computed(() => mergeSlot(sdn.frame11, props.frame11, props.seldonRefs))
const itemAvatarItem6Props = computed(() =>
  mergeOptionalSlot(sdn.itemAvatarItem6, props.itemAvatarItem6, props.seldonRefs),
)
const frame12Props = computed(() => mergeSlot(sdn.frame12, props.frame12, props.seldonRefs))
const textTitle6Props = computed(() =>
  mergeOptionalSlot(sdn.textTitle6, props.textTitle6, props.seldonRefs),
)
const textSubtitle6Props = computed(() =>
  mergeOptionalSlot(sdn.textSubtitle6, props.textSubtitle6, props.seldonRefs),
)
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Frame v-bind="containerProps">
        <Frame v-bind="frameProps" v-if="frameProps !== null">
          <ItemAvatarItem v-if="itemAvatarItemProps !== null" v-bind="itemAvatarItemProps">
            <Frame v-bind="frame2Props" v-if="frame2Props !== null">
              <TextTitle v-if="textTitleProps !== null" v-bind="textTitleProps" />
              <TextSubtitle v-if="textSubtitleProps !== null" v-bind="textSubtitleProps" />
            </Frame>
          </ItemAvatarItem>
        </Frame>
        <Frame v-bind="frame3Props" v-if="frame3Props !== null">
          <ItemAvatarItem v-if="itemAvatarItem2Props !== null" v-bind="itemAvatarItem2Props">
            <Frame v-bind="frame4Props" v-if="frame4Props !== null">
              <TextTitle v-if="textTitle2Props !== null" v-bind="textTitle2Props" />
              <TextSubtitle v-if="textSubtitle2Props !== null" v-bind="textSubtitle2Props" />
            </Frame>
          </ItemAvatarItem>
        </Frame>
        <Frame v-bind="frame5Props" v-if="frame5Props !== null">
          <ItemAvatarItem v-if="itemAvatarItem3Props !== null" v-bind="itemAvatarItem3Props">
            <Frame v-bind="frame6Props" v-if="frame6Props !== null">
              <TextTitle v-if="textTitle3Props !== null" v-bind="textTitle3Props" />
              <TextSubtitle v-if="textSubtitle3Props !== null" v-bind="textSubtitle3Props" />
            </Frame>
          </ItemAvatarItem>
        </Frame>
        <Frame v-bind="frame7Props" v-if="frame7Props !== null">
          <ItemAvatarItem v-if="itemAvatarItem4Props !== null" v-bind="itemAvatarItem4Props">
            <Frame v-bind="frame8Props" v-if="frame8Props !== null">
              <TextTitle v-if="textTitle4Props !== null" v-bind="textTitle4Props" />
              <TextSubtitle v-if="textSubtitle4Props !== null" v-bind="textSubtitle4Props" />
            </Frame>
          </ItemAvatarItem>
        </Frame>
        <Frame v-bind="frame9Props" v-if="frame9Props !== null">
          <ItemAvatarItem v-if="itemAvatarItem5Props !== null" v-bind="itemAvatarItem5Props">
            <Frame v-bind="frame10Props" v-if="frame10Props !== null">
              <TextTitle v-if="textTitle5Props !== null" v-bind="textTitle5Props" />
              <TextSubtitle v-if="textSubtitle5Props !== null" v-bind="textSubtitle5Props" />
            </Frame>
          </ItemAvatarItem>
        </Frame>
        <Frame v-bind="frame11Props" v-if="frame11Props !== null">
          <ItemAvatarItem v-if="itemAvatarItem6Props !== null" v-bind="itemAvatarItem6Props">
            <Frame v-bind="frame12Props" v-if="frame12Props !== null">
              <TextTitle v-if="textTitle6Props !== null" v-bind="textTitle6Props" />
              <TextSubtitle v-if="textSubtitle6Props !== null" v-bind="textSubtitle6Props" />
            </Frame>
          </ItemAvatarItem>
        </Frame>
      </Frame>
    </slot>
  </div>
</template>
