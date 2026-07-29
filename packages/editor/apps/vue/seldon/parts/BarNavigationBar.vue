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
 * Bar: BarNavigationBar
 * Level: Part
 * Intent: Groups related controls in a horizontal bar with buttons, navigation, or tabs layouts.
 * Tags: bar, controls, buttons, navigation, tabs, UI, layout, group
 * Type: Custom
 *
 * Structure:
 *   Button       button
 *     Icon       icon
 *     TextLabel  textLabel
 *   Button       button2
 *     Icon       icon2
 *     TextLabel  textLabel2
 *   Button       button3
 *     Icon       icon3
 *     TextLabel  textLabel3
 *   Button       button4
 *     Icon       icon4
 *     TextLabel  textLabel4
 *   Button       button5
 *     Icon       icon5
 *     TextLabel  textLabel5
 *
 * @example
 * ```vue
 * <BarNavigationBar
 *   role="navigation"
 *   aria-hidden="false"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot, mergeOptionalSlot } from "../utils/class-names"
import Button from "../elements/Button.vue"
import Icon from "../primitives/Icon.vue"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  button?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  button2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  button3?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  button4?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  textLabel4?: Record<string, unknown> | null
  button5?: Record<string, unknown> | null
  icon5?: Record<string, unknown> | null
  textLabel5?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "role": "navigation",
  "aria-hidden": "false",
  "button": {
    "className": "sdn-button sdn-button--rurb"
  },
  "icon": {
    "icon": "material-home",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--ivvi"
  },
  "textLabel": {
    "children": "Home",
    "className": "sdn-text-label sdn-text-label--p4vx"
  },
  "button2": {
    "className": "sdn-button sdn-button--ze8m"
  },
  "icon2": {
    "icon": "material-search",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--pbp5"
  },
  "textLabel2": {
    "children": "Search",
    "className": "sdn-text-label sdn-text-label--4mii"
  },
  "button3": {
    "className": "sdn-button sdn-button--ze8m"
  },
  "icon3": {
    "icon": "material-favoriteBorder",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--pbp5"
  },
  "textLabel3": {
    "children": "Favorites",
    "className": "sdn-text-label sdn-text-label--4mii"
  },
  "button4": {
    "className": "sdn-button sdn-button--ze8m"
  },
  "icon4": {
    "icon": "material-accountCircle",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--pbp5"
  },
  "textLabel4": {
    "children": "Profile",
    "className": "sdn-text-label sdn-text-label--4mii"
  },
  "button5": {
    "className": "sdn-button sdn-button--ze8m"
  },
  "icon5": {
    "icon": "material-settings",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--pbp5"
  },
  "textLabel5": {
    "children": "Settings",
    "className": "sdn-text-label sdn-text-label--4mii"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-bar-navigation-bar", props.className))
const rootAttrs = { "role": sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const buttonProps = computed(() => mergeSlot(sdn.button, props.button, props.seldonRefs))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const textLabelProps = computed(() => mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs))
const button2Props = computed(() => mergeSlot(sdn.button2, props.button2, props.seldonRefs))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2, props.seldonRefs))
const textLabel2Props = computed(() => mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs))
const button3Props = computed(() => mergeSlot(sdn.button3, props.button3, props.seldonRefs))
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3, props.seldonRefs))
const textLabel3Props = computed(() => mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs))
const button4Props = computed(() => mergeSlot(sdn.button4, props.button4, props.seldonRefs))
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4, props.seldonRefs))
const textLabel4Props = computed(() => mergeOptionalSlot(sdn.textLabel4, props.textLabel4, props.seldonRefs))
const button5Props = computed(() => mergeSlot(sdn.button5, props.button5, props.seldonRefs))
const icon5Props = computed(() => mergeSlot(sdn.icon5, props.icon5, props.seldonRefs))
const textLabel5Props = computed(() => mergeOptionalSlot(sdn.textLabel5, props.textLabel5, props.seldonRefs))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Button v-if="buttonProps !== null" v-bind="buttonProps">
          <Icon v-if="iconProps !== null" v-bind="iconProps" />
          <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
        </Button>
        <Button v-if="button2Props !== null" v-bind="button2Props">
          <Icon v-if="icon2Props !== null" v-bind="icon2Props" />
          <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
        </Button>
        <Button v-if="button3Props !== null" v-bind="button3Props">
          <Icon v-if="icon3Props !== null" v-bind="icon3Props" />
          <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
        </Button>
        <Button v-if="button4Props !== null" v-bind="button4Props">
          <Icon v-if="icon4Props !== null" v-bind="icon4Props" />
          <TextLabel v-if="textLabel4Props !== null" v-bind="textLabel4Props" />
        </Button>
        <Button v-if="button5Props !== null" v-bind="button5Props">
          <Icon v-if="icon5Props !== null" v-bind="icon5Props" />
          <TextLabel v-if="textLabel5Props !== null" v-bind="textLabel5Props" />
        </Button>
      </slot>
    </div>
</template>
