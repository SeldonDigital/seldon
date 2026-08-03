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
 * Part: TokenCardSpacing
 * Level: Part
 * Intent: Used for preview and properties badges over the canvas.
 * Tags: Properties, tokens, margins, padding, orientation, align, gap
 * Type: Inline
 *
 * Structure:
 *   Frame         frame
 *     Frame       frame2
 *       Frame     frame3
 *       Frame     frame4
 *       Frame     frame5
 *       Frame     frame6
 *       Frame     frame7
 *       Frame     frame8
 *         Frame   frame9
 *         Frame   frame10
 *         Frame   frame11
 *         Frame   frame12
 *         Frame   frame13
 *         Frame   frame14
 *           Icon  icon
 *           Icon  icon2
 *           Icon  icon3
 *
 * @example
 * ```vue
 * <TokenCardSpacing
 *   aria-hidden="false"
 *   frame="{}"
 *   frame2="{}"
 *   frame3="{}"
 *   frame4="{}"
 *   frame5="{}"
 *   frame6="{}"
 *   icon="material-star"
 *   icon2="material-star"
 *   icon3="material-star"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import Frame from "../frames/Frame.vue"
import Icon from "../primitives/Icon.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
  frame4?: Record<string, unknown> | null
  frame5?: Record<string, unknown> | null
  frame6?: Record<string, unknown> | null
  frame7?: Record<string, unknown> | null
  frame8?: Record<string, unknown> | null
  frame9?: Record<string, unknown> | null
  frame10?: Record<string, unknown> | null
  frame11?: Record<string, unknown> | null
  frame12?: Record<string, unknown> | null
  frame13?: Record<string, unknown> | null
  frame14?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--1bby",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--l9hu",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ozrx",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--kjlc",
  },
  frame5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--puja",
  },
  frame6: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--hog9",
  },
  frame7: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ud2b",
  },
  frame8: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--tznm",
  },
  frame9: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nbi9",
  },
  frame10: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--5puw",
  },
  frame11: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--5wjq",
  },
  frame12: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--zlbo",
  },
  frame13: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--4cb4",
  },
  frame14: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--j4z9",
  },
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--qnkh",
  },
  icon2: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--qnkh",
  },
  icon3: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--qnkh",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-token-card-spacing", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3, props.seldonRefs))
const frame4Props = computed(() => mergeSlot(sdn.frame4, props.frame4, props.seldonRefs))
const frame5Props = computed(() => mergeSlot(sdn.frame5, props.frame5, props.seldonRefs))
const frame6Props = computed(() => mergeSlot(sdn.frame6, props.frame6, props.seldonRefs))
const frame7Props = computed(() => mergeSlot(sdn.frame7, props.frame7, props.seldonRefs))
const frame8Props = computed(() => mergeSlot(sdn.frame8, props.frame8, props.seldonRefs))
const frame9Props = computed(() => mergeSlot(sdn.frame9, props.frame9, props.seldonRefs))
const frame10Props = computed(() => mergeSlot(sdn.frame10, props.frame10, props.seldonRefs))
const frame11Props = computed(() => mergeSlot(sdn.frame11, props.frame11, props.seldonRefs))
const frame12Props = computed(() => mergeSlot(sdn.frame12, props.frame12, props.seldonRefs))
const frame13Props = computed(() => mergeSlot(sdn.frame13, props.frame13, props.seldonRefs))
const frame14Props = computed(() => mergeSlot(sdn.frame14, props.frame14, props.seldonRefs))
const iconProps = computed(() => mergeOptionalSlot(sdn.icon, props.icon, props.seldonRefs))
const icon2Props = computed(() => mergeOptionalSlot(sdn.icon2, props.icon2, props.seldonRefs))
const icon3Props = computed(() => mergeOptionalSlot(sdn.icon3, props.icon3, props.seldonRefs))
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Frame v-bind="frameProps">
        <Frame v-bind="frame2Props" v-if="frame2Props !== null">
          <Frame v-bind="frame3Props" v-if="frame3Props !== null"> </Frame>
          <Frame v-bind="frame4Props" v-if="frame4Props !== null"> </Frame>
          <Frame v-bind="frame5Props" v-if="frame5Props !== null"> </Frame>
          <Frame v-bind="frame6Props" v-if="frame6Props !== null"> </Frame>
          <Frame v-bind="frame7Props" v-if="frame7Props !== null"> </Frame>
          <Frame v-bind="frame8Props" v-if="frame8Props !== null">
            <Frame v-bind="frame9Props" v-if="frame9Props !== null"> </Frame>
            <Frame v-bind="frame10Props" v-if="frame10Props !== null"> </Frame>
            <Frame v-bind="frame11Props" v-if="frame11Props !== null"> </Frame>
            <Frame v-bind="frame12Props" v-if="frame12Props !== null"> </Frame>
            <Frame v-bind="frame13Props" v-if="frame13Props !== null"> </Frame>
            <Frame v-bind="frame14Props" v-if="frame14Props !== null">
              <Icon v-if="iconProps !== null" v-bind="iconProps" />
              <Icon v-if="icon2Props !== null" v-bind="icon2Props" />
              <Icon v-if="icon3Props !== null" v-bind="icon3Props" />
            </Frame>
          </Frame>
        </Frame>
      </Frame>
    </slot>
  </div>
</template>
