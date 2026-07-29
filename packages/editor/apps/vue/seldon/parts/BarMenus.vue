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
 * Bar: BarMenus
 * Level: Part
 * Intent: Groups related controls in a horizontal bar with buttons, navigation, or tabs layouts.
 * Tags: bar, controls, buttons, navigation, tabs, UI, layout, group
 * Type: Custom
 *
 * Structure:
 *   ButtonSimple  buttonSimple
 *     TextLabel   textLabel
 *   ButtonSimple  buttonSimple2
 *     TextLabel   textLabel2
 *   ButtonSimple  buttonSimple3
 *     TextLabel   textLabel3
 *   ButtonSimple  buttonSimple4
 *     TextLabel   textLabel4
 *
 * @example
 * ```vue
 * <BarMenus
 *   role="menubar"
 *   aria-hidden="false"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import ButtonSimple from "../elements/ButtonSimple.vue"
import TextLabel from "../primitives/TextLabel.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  buttonSimple?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  buttonSimple2?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  buttonSimple3?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  buttonSimple4?: Record<string, unknown> | null
  textLabel4?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  role: "menubar",
  "aria-hidden": "false",
  buttonSimple: {
    "aria-haspopup": "menu",
    className: "sdn-button-simple sdn-button-simple--fjtm",
  },
  textLabel: {
    children: "File",
    className: "sdn-text-label sdn-text-label--ylte",
  },
  buttonSimple2: {
    "aria-haspopup": "menu",
    className: "sdn-button-simple sdn-button-simple--fjtm",
  },
  textLabel2: {
    children: "Edit",
    className: "sdn-text-label sdn-text-label--ylte",
  },
  buttonSimple3: {
    "aria-haspopup": "menu",
    className: "sdn-button-simple sdn-button-simple--fjtm",
  },
  textLabel3: {
    children: "View",
    className: "sdn-text-label sdn-text-label--ylte",
  },
  buttonSimple4: {
    "aria-haspopup": "menu",
    className: "sdn-button-simple sdn-button-simple--fjtm",
  },
  textLabel4: {
    children: "Help",
    className: "sdn-text-label sdn-text-label--ylte",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-bar-menus", props.className))
const rootAttrs = { role: sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const buttonSimpleProps = computed(() =>
  mergeSlot(sdn.buttonSimple, props.buttonSimple, props.seldonRefs),
)
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const buttonSimple2Props = computed(() =>
  mergeSlot(sdn.buttonSimple2, props.buttonSimple2, props.seldonRefs),
)
const textLabel2Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs),
)
const buttonSimple3Props = computed(() =>
  mergeSlot(sdn.buttonSimple3, props.buttonSimple3, props.seldonRefs),
)
const textLabel3Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs),
)
const buttonSimple4Props = computed(() =>
  mergeSlot(sdn.buttonSimple4, props.buttonSimple4, props.seldonRefs),
)
const textLabel4Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel4, props.textLabel4, props.seldonRefs),
)
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <ButtonSimple v-if="buttonSimpleProps !== null" v-bind="buttonSimpleProps">
        <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
      </ButtonSimple>
      <ButtonSimple v-if="buttonSimple2Props !== null" v-bind="buttonSimple2Props">
        <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
      </ButtonSimple>
      <ButtonSimple v-if="buttonSimple3Props !== null" v-bind="buttonSimple3Props">
        <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
      </ButtonSimple>
      <ButtonSimple v-if="buttonSimple4Props !== null" v-bind="buttonSimple4Props">
        <TextLabel v-if="textLabel4Props !== null" v-bind="textLabel4Props" />
      </ButtonSimple>
    </slot>
  </div>
</template>
