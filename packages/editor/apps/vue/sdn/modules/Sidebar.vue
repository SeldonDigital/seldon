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
 * Sidebar: Sidebar
 * Level: Module
 * Intent: Provides a structured sidebar panel with tabbed navigation, content area, and status footer for application interfaces.
 * Tags: sidebar, panel, module, ui, layout, navigation, tabs, structured
 * Type: Inline
 *
 * Structure:
 *   BarTabsBar       barTabsBar
 *     ButtonSimple   buttonSimple
 *       TextLabel    textLabel
 *     ButtonSimple   buttonSimple2
 *       TextLabel    textLabel2
 *     ButtonSimple   buttonSimple3
 *       TextLabel    textLabel3
 *   Frame            frame
 *   BarButtons       barButtons
 *     Frame          frame2
 *       Button       button
 *         Icon       icon
 *         TextLabel  textLabel4
 *       Button       button2
 *         Icon       icon2
 *         TextLabel  textLabel5
 *       Button       button3
 *         Icon       icon3
 *         TextLabel  textLabel6
 *     Frame          frame3
 *       Button       button4
 *         Icon       icon4
 *         TextLabel  textLabel7
 *       Button       button5
 *         Icon       icon5
 *         TextLabel  textLabel8
 *
 * @example
 * ```vue
 * <Sidebar
 *   role="complementary"
 *   aria-hidden="false"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import Button from "../elements/Button.vue"
import Frame from "../frames/Frame.vue"
import BarButtons from "../parts/BarButtons.vue"
import BarTabsBar from "../parts/BarTabsBar.vue"
import Icon from "../primitives/Icon.vue"
import TextLabel from "../primitives/TextLabel.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  barTabsBar?: Record<string, unknown> | null
  buttonSimple?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  buttonSimple2?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  buttonSimple3?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  frame?: Record<string, unknown> | null
  barButtons?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  button?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  textLabel4?: Record<string, unknown> | null
  button2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  textLabel5?: Record<string, unknown> | null
  button3?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  textLabel6?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
  button4?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  textLabel7?: Record<string, unknown> | null
  button5?: Record<string, unknown> | null
  icon5?: Record<string, unknown> | null
  textLabel8?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  role: "complementary",
  "aria-hidden": "false",
  barTabsBar: {
    role: "tablist",
    "aria-hidden": "false",
    className: "sdn-bar-tabs-bar sdn-bar-tabs-bar--qtpt",
  },
  buttonSimple: {
    className: "sdn-button-simple sdn-button-simple--znxu",
  },
  textLabel: {
    children: "Tab 1",
    className: "sdn-text-label sdn-text-label--ylte",
  },
  buttonSimple2: {
    className: "sdn-button-simple sdn-button-simple--znxu",
  },
  textLabel2: {
    children: "Tab 2",
    className: "sdn-text-label sdn-text-label--ylte",
  },
  buttonSimple3: {
    className: "sdn-button-simple sdn-button-simple--znxu",
  },
  textLabel3: {
    children: "Tab 3",
    className: "sdn-text-label sdn-text-label--ylte",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--946h",
  },
  barButtons: {
    "aria-hidden": "false",
    className: "sdn-bar-buttons sdn-bar-buttons--ftcm",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ysu5",
  },
  button: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel4: {
    children: "Button",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button2: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon2: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel5: {
    children: "Button",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button3: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon3: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel6: {
    children: "Button",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nzij",
  },
  button4: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon4: {
    icon: "seldon-none",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel7: {
    children: "Cancel",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button5: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon5: {
    icon: "material-check",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel8: {
    children: "OK",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-sidebar", props.className))
const rootAttrs = { role: sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const barTabsBarProps = computed(() =>
  mergeSlot(sdn.barTabsBar, props.barTabsBar, props.seldonRefs),
)
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
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const barButtonsProps = computed(() =>
  mergeSlot(sdn.barButtons, props.barButtons, props.seldonRefs),
)
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const buttonProps = computed(() => mergeOptionalSlot(sdn.button, props.button, props.seldonRefs))
const iconProps = computed(() => mergeOptionalSlot(sdn.icon, props.icon, props.seldonRefs))
const textLabel4Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel4, props.textLabel4, props.seldonRefs),
)
const button2Props = computed(() => mergeOptionalSlot(sdn.button2, props.button2, props.seldonRefs))
const icon2Props = computed(() => mergeOptionalSlot(sdn.icon2, props.icon2, props.seldonRefs))
const textLabel5Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel5, props.textLabel5, props.seldonRefs),
)
const button3Props = computed(() => mergeOptionalSlot(sdn.button3, props.button3, props.seldonRefs))
const icon3Props = computed(() => mergeOptionalSlot(sdn.icon3, props.icon3, props.seldonRefs))
const textLabel6Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel6, props.textLabel6, props.seldonRefs),
)
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3, props.seldonRefs))
const button4Props = computed(() => mergeOptionalSlot(sdn.button4, props.button4, props.seldonRefs))
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4, props.seldonRefs))
const textLabel7Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel7, props.textLabel7, props.seldonRefs),
)
const button5Props = computed(() => mergeOptionalSlot(sdn.button5, props.button5, props.seldonRefs))
const icon5Props = computed(() => mergeSlot(sdn.icon5, props.icon5, props.seldonRefs))
const textLabel8Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel8, props.textLabel8, props.seldonRefs),
)
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <BarTabsBar
        v-if="barTabsBarProps !== null"
        v-bind="barTabsBarProps"
        :buttonSimple="buttonSimpleProps"
        :textLabel="textLabelProps"
        :buttonSimple2="buttonSimple2Props"
        :textLabel2="textLabel2Props"
        :buttonSimple3="buttonSimple3Props"
        :textLabel3="textLabel3Props"
      />
      <Frame v-bind="frameProps"> </Frame>
      <BarButtons v-if="barButtonsProps !== null" v-bind="barButtonsProps">
        <Frame v-bind="frame2Props" v-if="frame2Props !== null">
          <Button v-if="buttonProps !== null" v-bind="buttonProps">
            <Icon v-if="iconProps !== null" v-bind="iconProps" />
            <TextLabel v-if="textLabel4Props !== null" v-bind="textLabel4Props" />
          </Button>
          <Button v-if="button2Props !== null" v-bind="button2Props">
            <Icon v-if="icon2Props !== null" v-bind="icon2Props" />
            <TextLabel v-if="textLabel5Props !== null" v-bind="textLabel5Props" />
          </Button>
          <Button v-if="button3Props !== null" v-bind="button3Props">
            <Icon v-if="icon3Props !== null" v-bind="icon3Props" />
            <TextLabel v-if="textLabel6Props !== null" v-bind="textLabel6Props" />
          </Button>
        </Frame>
        <Frame v-bind="frame3Props" v-if="frame3Props !== null">
          <Button v-if="button4Props !== null" v-bind="button4Props">
            <Icon v-if="icon4Props !== null" v-bind="icon4Props" />
            <TextLabel v-if="textLabel7Props !== null" v-bind="textLabel7Props" />
          </Button>
          <Button v-if="button5Props !== null" v-bind="button5Props">
            <Icon v-if="icon5Props !== null" v-bind="icon5Props" />
            <TextLabel v-if="textLabel8Props !== null" v-bind="textLabel8Props" />
          </Button>
        </Frame>
      </BarButtons>
    </slot>
  </div>
</template>
