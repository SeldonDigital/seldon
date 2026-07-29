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
 * Panel: PanelDialog
 * Level: Module
 * Intent: Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.
 * Tags: panel, dialog, modal, ui, overlay, popup, interaction, alert
 * Type: Inline
 *
 * Structure:
 *   Bar                    bar
 *     TextTitle            textTitle            -> dialogTitle
 *     ComboboxFieldSearch  comboboxFieldSearch
 *       Icon               icon
 *       Input              input
 *       ButtonIconic       buttonIconic
 *         Icon             icon2
 *   Frame                  frame                -> dialogContent
 *   BarButtons             barButtons
 *     Frame                frame2
 *       Button             button
 *         Icon             icon3
 *         TextLabel        textLabel
 *       Button             button2
 *         Icon             icon4
 *         TextLabel        textLabel2
 *       Button             button3
 *         Icon             icon5
 *         TextLabel        textLabel3
 *     Frame                frame3
 *       Button             button4              -> dialogCancel
 *         Icon             icon6
 *         TextLabel        textLabel4
 *       Button             button5              -> dialogConfirm
 *         Icon             icon7
 *         TextLabel        textLabel5
 *
 * @example
 * ```vue
 * <PanelDialog
 *   role="dialog"
 *   aria-hidden="false"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import Button from "../elements/Button.vue"
import ComboboxFieldSearch from "../elements/ComboboxFieldSearch.vue"
import Frame from "../frames/Frame.vue"
import Bar from "../parts/Bar.vue"
import BarButtons from "../parts/BarButtons.vue"
import Icon from "../primitives/Icon.vue"
import TextLabel from "../primitives/TextLabel.vue"
import TextTitle from "../primitives/TextTitle.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  bar?: Record<string, unknown> | null
  textTitle?: Record<string, unknown> | null
  comboboxFieldSearch?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  input?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  frame?: Record<string, unknown> | null
  barButtons?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  button?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  button2?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  button3?: Record<string, unknown> | null
  icon5?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
  button4?: Record<string, unknown> | null
  icon6?: Record<string, unknown> | null
  textLabel4?: Record<string, unknown> | null
  button5?: Record<string, unknown> | null
  icon7?: Record<string, unknown> | null
  textLabel5?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  role: "dialog",
  "aria-hidden": "false",
  bar: {
    "aria-hidden": "false",
    className: "sdn-bar sdn-bar--zhvk",
  },
  textTitle: {
    children: "Dialog",
    className: "sdn-text-title sdn-text-title--eodu",
    "data-seldon-ref": "dialogTitle",
  },
  comboboxFieldSearch: {
    className: "sdn-combobox-field-search sdn-combobox-field-search--9jd5",
  },
  icon: {
    icon: "material-search",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  input: {
    placeholder: "Search for...",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--twyx",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon2: {
    icon: "material-close",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--2wwo",
    "data-seldon-ref": "dialogContent",
  },
  barButtons: {
    "aria-hidden": "false",
    className: "sdn-bar-buttons sdn-bar-buttons--ymyq",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ysu5",
  },
  button: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon3: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel: {
    children: "Button",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button2: {
    className: "sdn-button sdn-button--ls8f",
  },
  icon4: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel2: {
    children: "Button",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button3: {
    className: "sdn-button sdn-button--ls8f",
  },
  icon5: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel3: {
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
    "data-seldon-ref": "dialogCancel",
  },
  icon6: {
    icon: "seldon-none",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel4: {
    children: "Cancel",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button5: {
    className: "sdn-button sdn-button--upjl",
    "data-seldon-ref": "dialogConfirm",
  },
  icon7: {
    icon: "material-check",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel5: {
    children: "OK",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-panel-dialog", props.className))
const rootAttrs = { role: sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const barProps = computed(() => mergeSlot(sdn.bar, props.bar, props.seldonRefs))
const textTitleProps = computed(() =>
  mergeOptionalSlot(sdn.textTitle, props.textTitle, props.seldonRefs),
)
const comboboxFieldSearchProps = computed(() =>
  mergeOptionalSlot(sdn.comboboxFieldSearch, props.comboboxFieldSearch, props.seldonRefs),
)
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const inputProps = computed(() => mergeSlot(sdn.input, props.input, props.seldonRefs))
const buttonIconicProps = computed(() =>
  mergeSlot(sdn.buttonIconic, props.buttonIconic, props.seldonRefs),
)
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2, props.seldonRefs))
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const barButtonsProps = computed(() =>
  mergeSlot(sdn.barButtons, props.barButtons, props.seldonRefs),
)
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const buttonProps = computed(() => mergeOptionalSlot(sdn.button, props.button, props.seldonRefs))
const icon3Props = computed(() => mergeOptionalSlot(sdn.icon3, props.icon3, props.seldonRefs))
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const button2Props = computed(() => mergeOptionalSlot(sdn.button2, props.button2, props.seldonRefs))
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4, props.seldonRefs))
const textLabel2Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs),
)
const button3Props = computed(() => mergeOptionalSlot(sdn.button3, props.button3, props.seldonRefs))
const icon5Props = computed(() => mergeSlot(sdn.icon5, props.icon5, props.seldonRefs))
const textLabel3Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs),
)
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3, props.seldonRefs))
const button4Props = computed(() => mergeOptionalSlot(sdn.button4, props.button4, props.seldonRefs))
const icon6Props = computed(() => mergeSlot(sdn.icon6, props.icon6, props.seldonRefs))
const textLabel4Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel4, props.textLabel4, props.seldonRefs),
)
const button5Props = computed(() => mergeOptionalSlot(sdn.button5, props.button5, props.seldonRefs))
const icon7Props = computed(() => mergeSlot(sdn.icon7, props.icon7, props.seldonRefs))
const textLabel5Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel5, props.textLabel5, props.seldonRefs),
)
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Bar v-if="barProps !== null" v-bind="barProps">
        <TextTitle v-if="textTitleProps !== null" v-bind="textTitleProps" />
        <ComboboxFieldSearch
          v-if="comboboxFieldSearchProps !== null"
          v-bind="comboboxFieldSearchProps"
          :icon="iconProps"
          :input="inputProps"
          :buttonIconic="buttonIconicProps"
          :icon2="icon2Props"
        />
      </Bar>
      <Frame v-bind="frameProps">
        <slot name="dialogContent" />
      </Frame>
      <BarButtons v-if="barButtonsProps !== null" v-bind="barButtonsProps">
        <Frame v-bind="frame2Props" v-if="frame2Props !== null">
          <Button v-if="buttonProps !== null" v-bind="buttonProps">
            <Icon v-if="icon3Props !== null" v-bind="icon3Props" />
            <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
          </Button>
          <Button v-if="button2Props !== null" v-bind="button2Props">
            <Icon v-if="icon4Props !== null" v-bind="icon4Props" />
            <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
          </Button>
          <Button v-if="button3Props !== null" v-bind="button3Props">
            <Icon v-if="icon5Props !== null" v-bind="icon5Props" />
            <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
          </Button>
        </Frame>
        <Frame v-bind="frame3Props" v-if="frame3Props !== null">
          <Button v-if="button4Props !== null" v-bind="button4Props">
            <Icon v-if="icon6Props !== null" v-bind="icon6Props" />
            <TextLabel v-if="textLabel4Props !== null" v-bind="textLabel4Props" />
          </Button>
          <Button v-if="button5Props !== null" v-bind="button5Props">
            <Icon v-if="icon7Props !== null" v-bind="icon7Props" />
            <TextLabel v-if="textLabel5Props !== null" v-bind="textLabel5Props" />
          </Button>
        </Frame>
      </BarButtons>
    </slot>
  </div>
</template>
