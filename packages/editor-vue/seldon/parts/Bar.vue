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
 * Bar: Bar
 * Level: Part
 * Intent: Groups related controls in a horizontal bar with buttons, navigation, or tabs layouts.
 * Tags: bar, controls, buttons, navigation, tabs, UI, layout, group
 * Type: Default
 *
 * @example
 * ```vue
 * <Bar
 *   aria-hidden="false"
 *   textTitle="Product Title"
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   button2={() => {}}
 *   textLabel="{}"
 * />
 * ```
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Button from "../elements/Button.vue"
import ButtonIconic from "../elements/ButtonIconic.vue"
import Icon from "../primitives/Icon.vue"
import TextLabel from "../primitives/TextLabel.vue"
import TextTitle from "../primitives/TextTitle.vue"

const props = defineProps<{
  className?: string
  textTitle?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  button?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-bar",
  "textTitle": {
    "className": "sdn-text-title sdn-text-title--qbtu"
  },
  "buttonIconic": {
    "className": "sdn-button-iconic sdn-button-iconic--pgsr"
  },
  "icon": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--rezm"
  },
  "button": {
    "className": "sdn-button sdn-button-iconic--pgsr"
  },
  "icon2": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--umgs"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--ylte"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-bar", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const textTitleProps = computed(() => mergeSlot(sdn.textTitle, props.textTitle))
const buttonIconicProps = computed(() => mergeSlot(sdn.buttonIconic, props.buttonIconic))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const buttonProps = computed(() => mergeSlot(sdn.button, props.button))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <TextTitle v-if="textTitle && textTitleProps" v-bind="textTitleProps" />
        <ButtonIconic v-if="buttonIconicProps !== null" v-bind="buttonIconicProps" :icon="iconProps" />
        <Button v-if="buttonProps !== null" v-bind="buttonProps">
          <Icon v-if="icon2Props !== null" v-bind="icon2Props" />
          <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
        </Button>
      </slot>
    </div>
</template>
