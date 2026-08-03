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
 * Sidebar: SidebarProperties
 * Level: Module
 * Intent: Provides a structured sidebar panel with tabbed navigation, content area, and status footer for application interfaces.
 * Tags: sidebar, panel, module, ui, layout, navigation, tabs, structured
 * Type: Inline
 *
 * Structure:
 *   Frame                  frame
 *     ComboboxFieldFilter  comboboxFieldFilter  -> propertyFilterField
 *       Icon               icon                 -> propertyFilterIcon
 *       Input              input                -> propertyFilter
 *       ButtonIconic       buttonIconic         -> propertyFilterClear
 *         Icon             icon2                -> propertyFilterClearIcon
 *     ButtonMenu           buttonMenu           -> boardState
 *       TextLabel          textLabel            -> boardStateLabel
 *       Icon               icon3                -> boardStateMenuIcon
 *     ButtonToggle         buttonToggle         -> propertyTogglePanel
 *       Icon               icon4                -> propertyTogglePanelIcon
 *   Frame                  frame2               -> propertiesTree
 *
 * @example
 * ```vue
 * <SidebarProperties
 *   role="complementary"
 *   aria-hidden="false"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import ButtonMenu from "../elements/ButtonMenu.vue"
import ButtonToggle from "../elements/ButtonToggle.vue"
import ComboboxFieldFilter from "../elements/ComboboxFieldFilter.vue"
import Frame from "../frames/Frame.vue"
import Icon from "../primitives/Icon.vue"
import TextLabel from "../primitives/TextLabel.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  comboboxFieldFilter?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  input?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  buttonMenu?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  buttonToggle?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  role: "complementary",
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--uief",
  },
  comboboxFieldFilter: {
    className: "sdn-combobox-field sdn-combobox-field-project--rzdy",
    "data-seldon-ref": "propertyFilterField",
  },
  icon: {
    icon: "material-filterList",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "propertyFilterIcon",
  },
  input: {
    placeholder: "Filter...",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--yoqi",
    "data-seldon-ref": "propertyFilter",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "propertyFilterClear",
  },
  icon2: {
    icon: "material-close",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
    "data-seldon-ref": "propertyFilterClearIcon",
  },
  buttonMenu: {
    className: "sdn-button-menu sdn-button-menu--t1a2",
    "data-seldon-ref": "boardState",
  },
  textLabel: {
    children: "State",
    className: "sdn-text-label sdn-text-label--sa6t",
    "data-seldon-ref": "boardStateLabel",
  },
  icon3: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--y2ct",
    "data-seldon-ref": "boardStateMenuIcon",
  },
  buttonToggle: {
    className: "sdn-button-toggle sdn-button-toggle--btlv",
    "data-seldon-ref": "propertyTogglePanel",
  },
  icon4: {
    icon: "seldon-panels",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
    "data-seldon-ref": "propertyTogglePanelIcon",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--evmw",
    "data-seldon-ref": "propertiesTree",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-sidebar-objects", props.className))
const rootAttrs = { role: sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const comboboxFieldFilterProps = computed(() =>
  mergeOptionalSlot(sdn.comboboxFieldFilter, props.comboboxFieldFilter, props.seldonRefs),
)
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const inputProps = computed(() => mergeSlot(sdn.input, props.input, props.seldonRefs))
const buttonIconicProps = computed(() =>
  mergeSlot(sdn.buttonIconic, props.buttonIconic, props.seldonRefs),
)
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2, props.seldonRefs))
const buttonMenuProps = computed(() =>
  mergeOptionalSlot(sdn.buttonMenu, props.buttonMenu, props.seldonRefs),
)
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3, props.seldonRefs))
const buttonToggleProps = computed(() =>
  mergeOptionalSlot(sdn.buttonToggle, props.buttonToggle, props.seldonRefs),
)
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4, props.seldonRefs))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Frame v-bind="frameProps">
        <ComboboxFieldFilter
          v-if="comboboxFieldFilterProps !== null"
          v-bind="comboboxFieldFilterProps"
          :icon="iconProps"
          :input="inputProps"
          :buttonIconic="buttonIconicProps"
          :icon2="icon2Props"
        />
        <ButtonMenu v-if="buttonMenuProps !== null" v-bind="buttonMenuProps">
          <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
          <Icon v-if="icon3Props !== null" v-bind="icon3Props" />
        </ButtonMenu>
        <ButtonToggle
          v-if="buttonToggleProps !== null"
          v-bind="buttonToggleProps"
          :icon="icon4Props"
        />
      </Frame>
      <Frame v-bind="frame2Props" v-if="frame2Props !== null">
        <slot name="propertiesTree" />
      </Frame>
    </slot>
  </div>
</template>
