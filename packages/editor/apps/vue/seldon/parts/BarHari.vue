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
 * Bar: BarHari
 * Level: Part
 * Intent: Groups related controls in a horizontal bar with buttons, navigation, or tabs layouts.
 * Tags: bar, controls, buttons, navigation, tabs, UI, layout, group
 * Type: Inline
 *
 * Structure:
 *   Frame         frame
 *     TextTitle   textTitle      -> hariTitle
 *   ButtonToggle  buttonToggle   -> hariToggleOutcome
 *     Icon        icon           -> hariToggleOutcomeIcon
 *   ButtonToggle  buttonToggle2  -> hariToggleTools
 *     Icon        icon2          -> hariToggleToolsIcon
 *   ButtonToggle  buttonToggle3  -> hariToggleClamp
 *     Icon        icon3          -> hariToggleClampIcon
 *
 * @example
 * ```vue
 * <BarHari
 *   aria-hidden="false"
 *   frame="{}"
 *   textTitle="Product Title"
 *   buttonToggle={() => {}}
 *   icon="material-star"
 *   buttonToggle2={() => {}}
 *   buttonToggle3={() => {}}
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import ButtonToggle from "../elements/ButtonToggle.vue"
import Frame from "../frames/Frame.vue"
import TextTitle from "../primitives/TextTitle.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  textTitle?: Record<string, unknown> | null
  buttonToggle?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  buttonToggle2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  buttonToggle3?: Record<string, unknown> | null
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
    className: "sdn-frame sdn-frame--x6r3",
  },
  textTitle: {
    children: "Hari",
    className: "sdn-text-title sdn-text-title--3vil",
    "data-seldon-ref": "hariTitle",
  },
  buttonToggle: {
    className: "sdn-button-toggle sdn-button-iconic--tlj6",
    "data-seldon-ref": "hariToggleOutcome",
  },
  icon: {
    icon: "material-outputCircle",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rftn",
    "data-seldon-ref": "hariToggleOutcomeIcon",
  },
  buttonToggle2: {
    className: "sdn-button-toggle sdn-button-iconic--tlj6",
    "data-seldon-ref": "hariToggleTools",
  },
  icon2: {
    icon: "material-buildCircle",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rftn",
    "data-seldon-ref": "hariToggleToolsIcon",
  },
  buttonToggle3: {
    className: "sdn-button-toggle sdn-button-iconic--tlj6",
    "data-seldon-ref": "hariToggleClamp",
  },
  icon3: {
    icon: "material-neurology",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rftn",
    "data-seldon-ref": "hariToggleClampIcon",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-bar-state", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const textTitleProps = computed(() =>
  mergeOptionalSlot(sdn.textTitle, props.textTitle, props.seldonRefs),
)
const buttonToggleProps = computed(() =>
  mergeSlot(sdn.buttonToggle, props.buttonToggle, props.seldonRefs),
)
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const buttonToggle2Props = computed(() =>
  mergeOptionalSlot(sdn.buttonToggle2, props.buttonToggle2, props.seldonRefs),
)
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2, props.seldonRefs))
const buttonToggle3Props = computed(() =>
  mergeOptionalSlot(sdn.buttonToggle3, props.buttonToggle3, props.seldonRefs),
)
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3, props.seldonRefs))
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Frame v-bind="frameProps" v-if="frameProps !== null">
        <TextTitle v-if="textTitleProps !== null" v-bind="textTitleProps" />
      </Frame>
      <ButtonToggle
        v-if="buttonToggleProps !== null"
        v-bind="buttonToggleProps"
        :icon="iconProps"
      />
      <ButtonToggle
        v-if="buttonToggle2Props !== null"
        v-bind="buttonToggle2Props"
        :icon="icon2Props"
      />
      <ButtonToggle
        v-if="buttonToggle3Props !== null"
        v-bind="buttonToggle3Props"
        :icon="icon3Props"
      />
    </slot>
  </div>
</template>
