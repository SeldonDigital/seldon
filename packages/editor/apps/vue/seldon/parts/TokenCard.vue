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
 * Part: TokenCard
 * Level: Part
 * Intent: Used for preview and properties badges over the canvas.
 * Tags: Properties, tokens, margins, padding, orientation, align, gap
 * Type: Inline
 *
 * Structure:
 *   Frame              frame
 *     Frame            frame2
 *       ChipToken      chipToken
 *         Frame        frame3
 *           TextLabel  textLabel
 *           TextLabel  textLabel2
 *     Frame            frame4
 *       ChipToken      chipToken2
 *         Frame        frame5
 *           TextLabel  textLabel3
 *           TextLabel  textLabel4
 *     Frame            frame6
 *       ChipToken      chipToken3
 *         Frame        frame7
 *           TextLabel  textLabel5
 *           TextLabel  textLabel6
 *     Frame            frame8
 *       ChipToken      chipToken4
 *         Frame        frame9
 *           TextLabel  textLabel7
 *           TextLabel  textLabel8
 *     Frame            frame10
 *       ChipToken      chipToken5
 *         Frame        frame11
 *           TextLabel  textLabel9
 *           TextLabel  textLabel10
 *     Frame            frame12
 *       ChipToken      chipToken6
 *         Frame        frame13
 *           TextLabel  textLabel11
 *           TextLabel  textLabel12
 *     Frame            frame14
 *       ChipToken      chipToken7
 *         Frame        frame15
 *           TextLabel  textLabel13
 *           TextLabel  textLabel14
 *
 * @example
 * ```vue
 * <TokenCard
 *   aria-hidden="false"
 *   frame="{}"
 *   chipToken="{}"
 *   textLabel="{}"
 *   textLabel2="{}"
 *   frame2="{}"
 *   frame3="{}"
 *   frame4="{}"
 *   frame5="{}"
 *   frame6="{}"
 *   frame7="{}"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import ChipToken from "../elements/ChipToken.vue"
import Frame from "../frames/Frame.vue"
import TextLabel from "../primitives/TextLabel.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  chipToken?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  frame4?: Record<string, unknown> | null
  chipToken2?: Record<string, unknown> | null
  frame5?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  textLabel4?: Record<string, unknown> | null
  frame6?: Record<string, unknown> | null
  chipToken3?: Record<string, unknown> | null
  frame7?: Record<string, unknown> | null
  textLabel5?: Record<string, unknown> | null
  textLabel6?: Record<string, unknown> | null
  frame8?: Record<string, unknown> | null
  chipToken4?: Record<string, unknown> | null
  frame9?: Record<string, unknown> | null
  textLabel7?: Record<string, unknown> | null
  textLabel8?: Record<string, unknown> | null
  frame10?: Record<string, unknown> | null
  chipToken5?: Record<string, unknown> | null
  frame11?: Record<string, unknown> | null
  textLabel9?: Record<string, unknown> | null
  textLabel10?: Record<string, unknown> | null
  frame12?: Record<string, unknown> | null
  chipToken6?: Record<string, unknown> | null
  frame13?: Record<string, unknown> | null
  textLabel11?: Record<string, unknown> | null
  textLabel12?: Record<string, unknown> | null
  frame14?: Record<string, unknown> | null
  chipToken7?: Record<string, unknown> | null
  frame15?: Record<string, unknown> | null
  textLabel13?: Record<string, unknown> | null
  textLabel14?: Record<string, unknown> | null
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
    className: "sdn-frame sdn-frame--vatw",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--a082",
  },
  chipToken: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--id7p",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--yxbv",
  },
  textLabel: {
    children: "None",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--sh8c",
  },
  textLabel2: {
    children: "0px · 0rem",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--qqqg",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--a082",
  },
  chipToken2: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--j4sq",
  },
  frame5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--yxbv",
  },
  textLabel3: {
    children: "Tight",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--sh8c",
  },
  textLabel4: {
    children: "16px · 1rem",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--qqqg",
  },
  frame6: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--a082",
  },
  chipToken3: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--wqm9",
  },
  frame7: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--yxbv",
  },
  textLabel5: {
    children: "Compact",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--sh8c",
  },
  textLabel6: {
    children: "16px · 1rem",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--qqqg",
  },
  frame8: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--a082",
  },
  chipToken4: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--l5ve",
  },
  frame9: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--yxbv",
  },
  textLabel7: {
    children: "Cozy",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--sh8c",
  },
  textLabel8: {
    children: "16px · 1rem",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--qqqg",
  },
  frame10: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--a082",
  },
  chipToken5: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--rioz",
  },
  frame11: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--yxbv",
  },
  textLabel9: {
    children: "Comfortable",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--sh8c",
  },
  textLabel10: {
    children: "16px · 1rem",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--qqqg",
  },
  frame12: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--a082",
  },
  chipToken6: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--9aok",
  },
  frame13: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--yxbv",
  },
  textLabel11: {
    children: "Open",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--sh8c",
  },
  textLabel12: {
    children: "16px · 1rem",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--qqqg",
  },
  frame14: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--a082",
  },
  chipToken7: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--vuac",
  },
  frame15: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--yxbv",
  },
  textLabel13: {
    children: "Custom Token",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--sh8c",
  },
  textLabel14: {
    children: "16px · 1rem",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--qqqg",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-token-card", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const chipTokenProps = computed(() =>
  mergeOptionalSlot(sdn.chipToken, props.chipToken, props.seldonRefs),
)
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3, props.seldonRefs))
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const textLabel2Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs),
)
const frame4Props = computed(() => mergeSlot(sdn.frame4, props.frame4, props.seldonRefs))
const chipToken2Props = computed(() =>
  mergeOptionalSlot(sdn.chipToken2, props.chipToken2, props.seldonRefs),
)
const frame5Props = computed(() => mergeSlot(sdn.frame5, props.frame5, props.seldonRefs))
const textLabel3Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs),
)
const textLabel4Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel4, props.textLabel4, props.seldonRefs),
)
const frame6Props = computed(() => mergeSlot(sdn.frame6, props.frame6, props.seldonRefs))
const chipToken3Props = computed(() =>
  mergeOptionalSlot(sdn.chipToken3, props.chipToken3, props.seldonRefs),
)
const frame7Props = computed(() => mergeSlot(sdn.frame7, props.frame7, props.seldonRefs))
const textLabel5Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel5, props.textLabel5, props.seldonRefs),
)
const textLabel6Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel6, props.textLabel6, props.seldonRefs),
)
const frame8Props = computed(() => mergeSlot(sdn.frame8, props.frame8, props.seldonRefs))
const chipToken4Props = computed(() =>
  mergeOptionalSlot(sdn.chipToken4, props.chipToken4, props.seldonRefs),
)
const frame9Props = computed(() => mergeSlot(sdn.frame9, props.frame9, props.seldonRefs))
const textLabel7Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel7, props.textLabel7, props.seldonRefs),
)
const textLabel8Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel8, props.textLabel8, props.seldonRefs),
)
const frame10Props = computed(() => mergeSlot(sdn.frame10, props.frame10, props.seldonRefs))
const chipToken5Props = computed(() =>
  mergeOptionalSlot(sdn.chipToken5, props.chipToken5, props.seldonRefs),
)
const frame11Props = computed(() => mergeSlot(sdn.frame11, props.frame11, props.seldonRefs))
const textLabel9Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel9, props.textLabel9, props.seldonRefs),
)
const textLabel10Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel10, props.textLabel10, props.seldonRefs),
)
const frame12Props = computed(() => mergeSlot(sdn.frame12, props.frame12, props.seldonRefs))
const chipToken6Props = computed(() =>
  mergeOptionalSlot(sdn.chipToken6, props.chipToken6, props.seldonRefs),
)
const frame13Props = computed(() => mergeSlot(sdn.frame13, props.frame13, props.seldonRefs))
const textLabel11Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel11, props.textLabel11, props.seldonRefs),
)
const textLabel12Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel12, props.textLabel12, props.seldonRefs),
)
const frame14Props = computed(() => mergeSlot(sdn.frame14, props.frame14, props.seldonRefs))
const chipToken7Props = computed(() =>
  mergeOptionalSlot(sdn.chipToken7, props.chipToken7, props.seldonRefs),
)
const frame15Props = computed(() => mergeSlot(sdn.frame15, props.frame15, props.seldonRefs))
const textLabel13Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel13, props.textLabel13, props.seldonRefs),
)
const textLabel14Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel14, props.textLabel14, props.seldonRefs),
)
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Frame v-bind="frameProps">
        <Frame v-bind="frame2Props" v-if="frame2Props !== null">
          <ChipToken v-if="chipTokenProps !== null" v-bind="chipTokenProps">
            <Frame v-bind="frame3Props" v-if="frame3Props !== null">
              <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
              <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
            </Frame>
          </ChipToken>
        </Frame>
        <Frame v-bind="frame4Props" v-if="frame4Props !== null">
          <ChipToken v-if="chipToken2Props !== null" v-bind="chipToken2Props">
            <Frame v-bind="frame5Props" v-if="frame5Props !== null">
              <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
              <TextLabel v-if="textLabel4Props !== null" v-bind="textLabel4Props" />
            </Frame>
          </ChipToken>
        </Frame>
        <Frame v-bind="frame6Props" v-if="frame6Props !== null">
          <ChipToken v-if="chipToken3Props !== null" v-bind="chipToken3Props">
            <Frame v-bind="frame7Props" v-if="frame7Props !== null">
              <TextLabel v-if="textLabel5Props !== null" v-bind="textLabel5Props" />
              <TextLabel v-if="textLabel6Props !== null" v-bind="textLabel6Props" />
            </Frame>
          </ChipToken>
        </Frame>
        <Frame v-bind="frame8Props" v-if="frame8Props !== null">
          <ChipToken v-if="chipToken4Props !== null" v-bind="chipToken4Props">
            <Frame v-bind="frame9Props" v-if="frame9Props !== null">
              <TextLabel v-if="textLabel7Props !== null" v-bind="textLabel7Props" />
              <TextLabel v-if="textLabel8Props !== null" v-bind="textLabel8Props" />
            </Frame>
          </ChipToken>
        </Frame>
        <Frame v-bind="frame10Props" v-if="frame10Props !== null">
          <ChipToken v-if="chipToken5Props !== null" v-bind="chipToken5Props">
            <Frame v-bind="frame11Props" v-if="frame11Props !== null">
              <TextLabel v-if="textLabel9Props !== null" v-bind="textLabel9Props" />
              <TextLabel v-if="textLabel10Props !== null" v-bind="textLabel10Props" />
            </Frame>
          </ChipToken>
        </Frame>
        <Frame v-bind="frame12Props" v-if="frame12Props !== null">
          <ChipToken v-if="chipToken6Props !== null" v-bind="chipToken6Props">
            <Frame v-bind="frame13Props" v-if="frame13Props !== null">
              <TextLabel v-if="textLabel11Props !== null" v-bind="textLabel11Props" />
              <TextLabel v-if="textLabel12Props !== null" v-bind="textLabel12Props" />
            </Frame>
          </ChipToken>
        </Frame>
        <Frame v-bind="frame14Props" v-if="frame14Props !== null">
          <ChipToken v-if="chipToken7Props !== null" v-bind="chipToken7Props">
            <Frame v-bind="frame15Props" v-if="frame15Props !== null">
              <TextLabel v-if="textLabel13Props !== null" v-bind="textLabel13Props" />
              <TextLabel v-if="textLabel14Props !== null" v-bind="textLabel14Props" />
            </Frame>
          </ChipToken>
        </Frame>
      </Frame>
    </slot>
  </div>
</template>
