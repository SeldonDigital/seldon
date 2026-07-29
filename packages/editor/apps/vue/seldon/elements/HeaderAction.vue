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
 * Header: HeaderAction
 * Level: Element
 * Intent: Arranges header content. The card variant groups identity and a primary action; the action variant groups title text with a set of action controls.
 * Tags: header, card, actions, layout, UI, group, toolbar, summary
 * Type: Inline
 *
 * Structure:
 *   Frame        frame
 *     TextTitle  textTitle
 *     Text       text
 *
 * @example
 * ```vue
 * <HeaderAction
 *   aria-hidden="false"
 *   frame="{}"
 *   textTitle="Product Title"
 *   text2="{}"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import Frame from "../frames/Frame.vue"
import Text from "../primitives/Text.vue"
import TextTitle from "../primitives/TextTitle.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  textTitle?: Record<string, unknown> | null
  text?: Record<string, unknown> | null
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
    className: "sdn-frame sdn-frame--khlc",
  },
  textTitle: {
    children: "Header Title",
    className: "sdn-text-title sdn-text-label--yqnd",
  },
  text: {
    children: "Provide additional context or information.",
    className: "sdn-text sdn-text--5rcy",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-header", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const textTitleProps = computed(() =>
  mergeOptionalSlot(sdn.textTitle, props.textTitle, props.seldonRefs),
)
const textProps = computed(() => mergeOptionalSlot(sdn.text, props.text, props.seldonRefs))
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Frame v-bind="frameProps">
        <TextTitle v-if="textTitleProps !== null" v-bind="textTitleProps" />
        <Text v-if="textProps !== null" v-bind="textProps" />
      </Frame>
    </slot>
  </div>
</template>
