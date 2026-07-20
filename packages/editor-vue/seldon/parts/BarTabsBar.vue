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
 * Bar: BarTabsBar
 * Level: Part
 * Intent: Groups related controls in a horizontal bar with buttons, navigation, or tabs layouts.
 * Tags: bar, controls, buttons, navigation, tabs, UI, layout, group
 * Type: Custom
 *
 * @example
 * ```vue
 * <BarTabsBar
 *   role="tablist"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import ButtonSimple from "../elements/ButtonSimple.vue"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  buttonSimple?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  buttonSimple2?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  buttonSimple3?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "role": "tablist",
  "aria-hidden": "false",
  "className": "sdn-bar-tabs-bar sdn-bar",
  "buttonSimple": {
    "className": "sdn-button-simple sdn-button-simple--znxu"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--ylte"
  },
  "buttonSimple2": {
    "className": "sdn-button-simple sdn-button-simple--znxu"
  },
  "textLabel2": {
    "className": "sdn-text-label sdn-text-label--ylte"
  },
  "buttonSimple3": {
    "className": "sdn-button-simple sdn-button-simple--znxu"
  },
  "textLabel3": {
    "className": "sdn-text-label sdn-text-label--ylte"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-bar-tabs-bar", props.className))
const rootAttrs = { "role": sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const buttonSimpleProps = computed(() => mergeSlot(sdn.buttonSimple, props.buttonSimple))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const buttonSimple2Props = computed(() => mergeSlot(sdn.buttonSimple2, props.buttonSimple2))
const textLabel2Props = computed(() => mergeSlot(sdn.textLabel2, props.textLabel2))
const buttonSimple3Props = computed(() => mergeSlot(sdn.buttonSimple3, props.buttonSimple3))
const textLabel3Props = computed(() => mergeSlot(sdn.textLabel3, props.textLabel3))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <ButtonSimple v-if="buttonSimpleProps !== null" v-bind="buttonSimpleProps">
          <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
        </ButtonSimple>
        <ButtonSimple v-if="buttonSimple2Props !== null" v-bind="buttonSimple2Props">
          <TextLabel v-if="textLabel2 && textLabel2Props" v-bind="textLabel2Props" />
        </ButtonSimple>
        <ButtonSimple v-if="buttonSimple3Props !== null" v-bind="buttonSimple3Props">
          <TextLabel v-if="textLabel3 && textLabel3Props" v-bind="textLabel3Props" />
        </ButtonSimple>
      </slot>
    </div>
</template>
