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
 * Part: TokenCardAlign
 * Level: Part
 * Intent: Used for preview and properties badges over the canvas.
 * Tags: Properties, tokens, margins, padding, orientation, align, gap
 * Type: Inline
 *
 * Structure:
 *   Container     container
 *     ChipToken   chipToken
 *       Frame     frame
 *         Icon    icon
 *         Frame   frame2
 *           Icon  icon2
 *     ChipToken   chipToken2
 *       Frame     frame3
 *         Icon    icon3
 *         Frame   frame4
 *           Icon  icon4
 *     ChipToken   chipToken3
 *       Frame     frame5
 *         Icon    icon5
 *         Frame   frame6
 *           Icon  icon6
 *     ChipToken   chipToken4
 *       Frame     frame7
 *         Icon    icon7
 *         Frame   frame8
 *           Icon  icon8
 *     ChipToken   chipToken5
 *       Frame     frame9
 *         Icon    icon9
 *         Frame   frame10
 *           Icon  icon10
 *     ChipToken   chipToken6
 *       Frame     frame11
 *         Icon    icon11
 *         Frame   frame12
 *           Icon  icon12
 *     ChipToken   chipToken7
 *       Frame     frame13
 *         Icon    icon13
 *         Frame   frame14
 *           Icon  icon14
 *     ChipToken   chipToken8
 *       Frame     frame15
 *         Icon    icon15
 *         Frame   frame16
 *           Icon  icon16
 *     ChipToken   chipToken9
 *       Frame     frame17
 *         Icon    icon17
 *         Frame   frame18
 *           Icon  icon18
 *
 * @example
 * ```vue
 * <TokenCardAlign
 *   aria-hidden="false"
 *   container="{}"
 *   chipToken="{}"
 *   frame="{}"
 *   icon="material-star"
 *   chipToken2="{}"
 *   chipToken3="{}"
 *   chipToken4="{}"
 *   chipToken5="{}"
 *   chipToken6="{}"
 *   chipToken7="{}"
 *   chipToken8="{}"
 *   chipToken9="{}"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import ChipToken from "../elements/ChipToken.vue"
import Frame from "../frames/Frame.vue"
import Icon from "../primitives/Icon.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  container?: Record<string, unknown> | null
  chipToken?: Record<string, unknown> | null
  frame?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  chipToken2?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  frame4?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  chipToken3?: Record<string, unknown> | null
  frame5?: Record<string, unknown> | null
  icon5?: Record<string, unknown> | null
  frame6?: Record<string, unknown> | null
  icon6?: Record<string, unknown> | null
  chipToken4?: Record<string, unknown> | null
  frame7?: Record<string, unknown> | null
  icon7?: Record<string, unknown> | null
  frame8?: Record<string, unknown> | null
  icon8?: Record<string, unknown> | null
  chipToken5?: Record<string, unknown> | null
  frame9?: Record<string, unknown> | null
  icon9?: Record<string, unknown> | null
  frame10?: Record<string, unknown> | null
  icon10?: Record<string, unknown> | null
  chipToken6?: Record<string, unknown> | null
  frame11?: Record<string, unknown> | null
  icon11?: Record<string, unknown> | null
  frame12?: Record<string, unknown> | null
  icon12?: Record<string, unknown> | null
  chipToken7?: Record<string, unknown> | null
  frame13?: Record<string, unknown> | null
  icon13?: Record<string, unknown> | null
  frame14?: Record<string, unknown> | null
  icon14?: Record<string, unknown> | null
  chipToken8?: Record<string, unknown> | null
  frame15?: Record<string, unknown> | null
  icon15?: Record<string, unknown> | null
  frame16?: Record<string, unknown> | null
  icon16?: Record<string, unknown> | null
  chipToken9?: Record<string, unknown> | null
  frame17?: Record<string, unknown> | null
  icon17?: Record<string, unknown> | null
  frame18?: Record<string, unknown> | null
  icon18?: Record<string, unknown> | null
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
    className: "sdn-container sdn-container--m4fk",
  },
  chipToken: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--ghik",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pefl",
  },
  icon: {
    icon: "material-arrowForward",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--kkju",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--duyo",
  },
  icon2: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--7mzg",
  },
  chipToken2: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--ghik",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rx6b",
  },
  icon3: {
    icon: "material-arrowForward",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--kkju",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--1kqj",
  },
  icon4: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--znda",
  },
  chipToken3: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--ghik",
  },
  frame5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rx6b",
  },
  icon5: {
    icon: "material-wrapText",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--kkju",
  },
  frame6: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--aksb",
  },
  icon6: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--laem",
  },
  chipToken4: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--ghik",
  },
  frame7: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rx6b",
  },
  icon7: {
    icon: "material-arrowForward",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--kkju",
  },
  frame8: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--g9sz",
  },
  icon8: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--cl0c",
  },
  chipToken5: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--ghik",
  },
  frame9: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rx6b",
  },
  icon9: {
    icon: "material-arrowForward",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--2nwn",
  },
  frame10: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--smv2",
  },
  icon10: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--znda",
  },
  chipToken6: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--ghik",
  },
  frame11: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rx6b",
  },
  icon11: {
    icon: "material-wrapText",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--kkju",
  },
  frame12: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--llrf",
  },
  icon12: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--yzhv",
  },
  chipToken7: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--ghik",
  },
  frame13: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rx6b",
  },
  icon13: {
    icon: "material-arrowForward",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--kkju",
  },
  frame14: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--z2od",
  },
  icon14: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--yzhv",
  },
  chipToken8: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--ghik",
  },
  frame15: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rx6b",
  },
  icon15: {
    icon: "material-arrowForward",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--kkju",
  },
  frame16: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--k9li",
  },
  icon16: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--ehuw",
  },
  chipToken9: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--ghik",
  },
  frame17: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rx6b",
  },
  icon17: {
    icon: "material-arrowForward",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--kkju",
  },
  frame18: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--qnik",
  },
  icon18: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--cl0c",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-token-card-align", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const containerProps = computed(() => mergeSlot(sdn.container, props.container, props.seldonRefs))
const chipTokenProps = computed(() =>
  mergeOptionalSlot(sdn.chipToken, props.chipToken, props.seldonRefs),
)
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const iconProps = computed(() => mergeOptionalSlot(sdn.icon, props.icon, props.seldonRefs))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const icon2Props = computed(() => mergeOptionalSlot(sdn.icon2, props.icon2, props.seldonRefs))
const chipToken2Props = computed(() =>
  mergeOptionalSlot(sdn.chipToken2, props.chipToken2, props.seldonRefs),
)
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3, props.seldonRefs))
const icon3Props = computed(() => mergeOptionalSlot(sdn.icon3, props.icon3, props.seldonRefs))
const frame4Props = computed(() => mergeSlot(sdn.frame4, props.frame4, props.seldonRefs))
const icon4Props = computed(() => mergeOptionalSlot(sdn.icon4, props.icon4, props.seldonRefs))
const chipToken3Props = computed(() =>
  mergeOptionalSlot(sdn.chipToken3, props.chipToken3, props.seldonRefs),
)
const frame5Props = computed(() => mergeSlot(sdn.frame5, props.frame5, props.seldonRefs))
const icon5Props = computed(() => mergeOptionalSlot(sdn.icon5, props.icon5, props.seldonRefs))
const frame6Props = computed(() => mergeSlot(sdn.frame6, props.frame6, props.seldonRefs))
const icon6Props = computed(() => mergeOptionalSlot(sdn.icon6, props.icon6, props.seldonRefs))
const chipToken4Props = computed(() =>
  mergeOptionalSlot(sdn.chipToken4, props.chipToken4, props.seldonRefs),
)
const frame7Props = computed(() => mergeSlot(sdn.frame7, props.frame7, props.seldonRefs))
const icon7Props = computed(() => mergeOptionalSlot(sdn.icon7, props.icon7, props.seldonRefs))
const frame8Props = computed(() => mergeSlot(sdn.frame8, props.frame8, props.seldonRefs))
const icon8Props = computed(() => mergeOptionalSlot(sdn.icon8, props.icon8, props.seldonRefs))
const chipToken5Props = computed(() =>
  mergeOptionalSlot(sdn.chipToken5, props.chipToken5, props.seldonRefs),
)
const frame9Props = computed(() => mergeSlot(sdn.frame9, props.frame9, props.seldonRefs))
const icon9Props = computed(() => mergeOptionalSlot(sdn.icon9, props.icon9, props.seldonRefs))
const frame10Props = computed(() => mergeSlot(sdn.frame10, props.frame10, props.seldonRefs))
const icon10Props = computed(() => mergeOptionalSlot(sdn.icon10, props.icon10, props.seldonRefs))
const chipToken6Props = computed(() =>
  mergeOptionalSlot(sdn.chipToken6, props.chipToken6, props.seldonRefs),
)
const frame11Props = computed(() => mergeSlot(sdn.frame11, props.frame11, props.seldonRefs))
const icon11Props = computed(() => mergeOptionalSlot(sdn.icon11, props.icon11, props.seldonRefs))
const frame12Props = computed(() => mergeSlot(sdn.frame12, props.frame12, props.seldonRefs))
const icon12Props = computed(() => mergeOptionalSlot(sdn.icon12, props.icon12, props.seldonRefs))
const chipToken7Props = computed(() =>
  mergeOptionalSlot(sdn.chipToken7, props.chipToken7, props.seldonRefs),
)
const frame13Props = computed(() => mergeSlot(sdn.frame13, props.frame13, props.seldonRefs))
const icon13Props = computed(() => mergeOptionalSlot(sdn.icon13, props.icon13, props.seldonRefs))
const frame14Props = computed(() => mergeSlot(sdn.frame14, props.frame14, props.seldonRefs))
const icon14Props = computed(() => mergeOptionalSlot(sdn.icon14, props.icon14, props.seldonRefs))
const chipToken8Props = computed(() =>
  mergeOptionalSlot(sdn.chipToken8, props.chipToken8, props.seldonRefs),
)
const frame15Props = computed(() => mergeSlot(sdn.frame15, props.frame15, props.seldonRefs))
const icon15Props = computed(() => mergeOptionalSlot(sdn.icon15, props.icon15, props.seldonRefs))
const frame16Props = computed(() => mergeSlot(sdn.frame16, props.frame16, props.seldonRefs))
const icon16Props = computed(() => mergeOptionalSlot(sdn.icon16, props.icon16, props.seldonRefs))
const chipToken9Props = computed(() =>
  mergeOptionalSlot(sdn.chipToken9, props.chipToken9, props.seldonRefs),
)
const frame17Props = computed(() => mergeSlot(sdn.frame17, props.frame17, props.seldonRefs))
const icon17Props = computed(() => mergeOptionalSlot(sdn.icon17, props.icon17, props.seldonRefs))
const frame18Props = computed(() => mergeSlot(sdn.frame18, props.frame18, props.seldonRefs))
const icon18Props = computed(() => mergeOptionalSlot(sdn.icon18, props.icon18, props.seldonRefs))
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Frame v-bind="containerProps">
        <ChipToken v-if="chipTokenProps !== null" v-bind="chipTokenProps">
          <Frame v-bind="frameProps" v-if="frameProps !== null">
            <Icon v-if="iconProps !== null" v-bind="iconProps" />
            <Frame v-bind="frame2Props" v-if="frame2Props !== null">
              <Icon v-if="icon2Props !== null" v-bind="icon2Props" />
            </Frame>
          </Frame>
        </ChipToken>
        <ChipToken v-if="chipToken2Props !== null" v-bind="chipToken2Props">
          <Frame v-bind="frame3Props" v-if="frame3Props !== null">
            <Icon v-if="icon3Props !== null" v-bind="icon3Props" />
            <Frame v-bind="frame4Props" v-if="frame4Props !== null">
              <Icon v-if="icon4Props !== null" v-bind="icon4Props" />
            </Frame>
          </Frame>
        </ChipToken>
        <ChipToken v-if="chipToken3Props !== null" v-bind="chipToken3Props">
          <Frame v-bind="frame5Props" v-if="frame5Props !== null">
            <Icon v-if="icon5Props !== null" v-bind="icon5Props" />
            <Frame v-bind="frame6Props" v-if="frame6Props !== null">
              <Icon v-if="icon6Props !== null" v-bind="icon6Props" />
            </Frame>
          </Frame>
        </ChipToken>
        <ChipToken v-if="chipToken4Props !== null" v-bind="chipToken4Props">
          <Frame v-bind="frame7Props" v-if="frame7Props !== null">
            <Icon v-if="icon7Props !== null" v-bind="icon7Props" />
            <Frame v-bind="frame8Props" v-if="frame8Props !== null">
              <Icon v-if="icon8Props !== null" v-bind="icon8Props" />
            </Frame>
          </Frame>
        </ChipToken>
        <ChipToken v-if="chipToken5Props !== null" v-bind="chipToken5Props">
          <Frame v-bind="frame9Props" v-if="frame9Props !== null">
            <Icon v-if="icon9Props !== null" v-bind="icon9Props" />
            <Frame v-bind="frame10Props" v-if="frame10Props !== null">
              <Icon v-if="icon10Props !== null" v-bind="icon10Props" />
            </Frame>
          </Frame>
        </ChipToken>
        <ChipToken v-if="chipToken6Props !== null" v-bind="chipToken6Props">
          <Frame v-bind="frame11Props" v-if="frame11Props !== null">
            <Icon v-if="icon11Props !== null" v-bind="icon11Props" />
            <Frame v-bind="frame12Props" v-if="frame12Props !== null">
              <Icon v-if="icon12Props !== null" v-bind="icon12Props" />
            </Frame>
          </Frame>
        </ChipToken>
        <ChipToken v-if="chipToken7Props !== null" v-bind="chipToken7Props">
          <Frame v-bind="frame13Props" v-if="frame13Props !== null">
            <Icon v-if="icon13Props !== null" v-bind="icon13Props" />
            <Frame v-bind="frame14Props" v-if="frame14Props !== null">
              <Icon v-if="icon14Props !== null" v-bind="icon14Props" />
            </Frame>
          </Frame>
        </ChipToken>
        <ChipToken v-if="chipToken8Props !== null" v-bind="chipToken8Props">
          <Frame v-bind="frame15Props" v-if="frame15Props !== null">
            <Icon v-if="icon15Props !== null" v-bind="icon15Props" />
            <Frame v-bind="frame16Props" v-if="frame16Props !== null">
              <Icon v-if="icon16Props !== null" v-bind="icon16Props" />
            </Frame>
          </Frame>
        </ChipToken>
        <ChipToken v-if="chipToken9Props !== null" v-bind="chipToken9Props">
          <Frame v-bind="frame17Props" v-if="frame17Props !== null">
            <Icon v-if="icon17Props !== null" v-bind="icon17Props" />
            <Frame v-bind="frame18Props" v-if="frame18Props !== null">
              <Icon v-if="icon18Props !== null" v-bind="icon18Props" />
            </Frame>
          </Frame>
        </ChipToken>
      </Frame>
    </slot>
  </div>
</template>
