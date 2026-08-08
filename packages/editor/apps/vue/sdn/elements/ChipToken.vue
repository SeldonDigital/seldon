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
 * Chip: ChipToken
 * Level: Element
 * Intent: Schema for a small, interactive UI element used to display information, categories, or actions with optional removal or selection states.
 * Tags: chip, ui, tag, label, badge, filter, category, pill
 * Type: Inline
 *
 * Structure:
 *   Frame        frame
 *     TextLabel  textLabel
 *     TextLabel  textLabel2
 *
 * @example
 * ```vue
 * <ChipToken
 *   aria-hidden="false"
 *   frame="{}"
 *   textLabel="{}"
 *   textLabel2="{}"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import Frame from "../frames/Frame.vue"
import TextLabel from "../primitives/TextLabel.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
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
    className: "sdn-frame sdn-frame--cysn",
  },
  textLabel: {
    children: "Token Name",
    className: "sdn-text-label sdn-text-label--sh8c",
  },
  textLabel2: {
    children: "16px · 1rem",
    className: "sdn-text-label sdn-text-label--qqqg",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-chip-token", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const textLabel2Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs),
)
</script>

<template>
  <span :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Frame v-bind="frameProps" v-if="frameProps !== null">
        <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
        <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
      </Frame>
    </slot>
  </span>
</template>
