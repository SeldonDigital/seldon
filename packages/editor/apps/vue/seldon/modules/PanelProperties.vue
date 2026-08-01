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
 * Panel: PanelProperties
 * Level: Module
 * Intent: Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.
 * Tags: panel, dialog, modal, ui, overlay, popup, interaction, alert
 * Type: Inline
 *
 * Structure:
 *   Bar                  bar
 *     ButtonMenu         buttonMenu
 *       TextLabel        textLabel
 *       Icon             icon
 *     ButtonIconic       buttonIconic
 *       Icon             icon2
 *   Frame                frame
 *   ComboboxFieldFilter  comboboxFieldFilter
 *     Icon               icon3
 *     Input              input
 *     ButtonIconic       buttonIconic2
 *       Icon             icon4
 *
 * @example
 * ```vue
 * <PanelProperties
 *   role="dialog"
 *   aria-hidden="false"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import ButtonIconic from "../elements/ButtonIconic.vue"
import ButtonMenu from "../elements/ButtonMenu.vue"
import ComboboxFieldFilter from "../elements/ComboboxFieldFilter.vue"
import Frame from "../frames/Frame.vue"
import Bar from "../parts/Bar.vue"
import Icon from "../primitives/Icon.vue"
import TextLabel from "../primitives/TextLabel.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  bar?: Record<string, unknown> | null
  buttonMenu?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  frame?: Record<string, unknown> | null
  comboboxFieldFilter?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  input?: Record<string, unknown> | null
  buttonIconic2?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
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
    className: "sdn-bar sdn-bar--9xs7",
  },
  buttonMenu: {
    className: "sdn-button-menu sdn-button-menu--jufk",
  },
  textLabel: {
    children: "State",
    className: "sdn-text-label sdn-text-label--kasa",
  },
  icon: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--y2ct",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--obd2",
  },
  icon2: {
    icon: "material-close",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--4d5e",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--snek",
  },
  comboboxFieldFilter: {
    className: "sdn-combobox-field sdn-combobox-field-filter--2si7",
  },
  icon3: {
    icon: "material-filterList",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  input: {
    placeholder: "Filter...",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--yoqi",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--6gst",
  },
  icon4: {
    icon: "material-close",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-panel-properties", props.className))
const rootAttrs = { role: sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const barProps = computed(() => mergeSlot(sdn.bar, props.bar, props.seldonRefs))
const buttonMenuProps = computed(() =>
  mergeOptionalSlot(sdn.buttonMenu, props.buttonMenu, props.seldonRefs),
)
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const buttonIconicProps = computed(() =>
  mergeSlot(sdn.buttonIconic, props.buttonIconic, props.seldonRefs),
)
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2, props.seldonRefs))
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const comboboxFieldFilterProps = computed(() =>
  mergeOptionalSlot(sdn.comboboxFieldFilter, props.comboboxFieldFilter, props.seldonRefs),
)
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3, props.seldonRefs))
const inputProps = computed(() => mergeSlot(sdn.input, props.input, props.seldonRefs))
const buttonIconic2Props = computed(() =>
  mergeSlot(sdn.buttonIconic2, props.buttonIconic2, props.seldonRefs),
)
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4, props.seldonRefs))
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Bar v-if="barProps !== null" v-bind="barProps">
        <ButtonMenu v-if="buttonMenuProps !== null" v-bind="buttonMenuProps">
          <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
          <Icon v-if="iconProps !== null" v-bind="iconProps" />
        </ButtonMenu>
        <ButtonIconic
          v-if="buttonIconicProps !== null"
          v-bind="buttonIconicProps"
          :icon="icon2Props"
        />
      </Bar>
      <Frame v-bind="frameProps"> </Frame>
      <ComboboxFieldFilter
        v-if="comboboxFieldFilterProps !== null"
        v-bind="comboboxFieldFilterProps"
        :icon="icon3Props"
        :input="inputProps"
        :buttonIconic="buttonIconic2Props"
        :icon2="icon4Props"
      />
    </slot>
  </div>
</template>
