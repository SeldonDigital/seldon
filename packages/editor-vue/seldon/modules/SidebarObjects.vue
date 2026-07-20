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
 * Sidebar: SidebarObjects
 * Level: Module
 * Intent: Provides a structured sidebar panel with tabbed navigation, content area, and status footer for application interfaces.
 * Tags: sidebar, panel, module, ui, layout, navigation, tabs, structured
 * Type: Inline
 *
 * @example
 * ```vue
 * <SidebarObjects
 *   role="complementary"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Frame from "../frames/Frame.vue"
import ButtonToggle from "../elements/ButtonToggle.vue"
import ComboboxFieldProject from "../elements/ComboboxFieldProject.vue"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  comboboxFieldProject?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  input?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  buttonToggle?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  buttonToggle2?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "role": "complementary",
  "aria-hidden": "false",
  "className": "sdn-sidebar-objects sdn-sidebar",
  "frame": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--p4y0"
  },
  "comboboxFieldProject": {
    "className": "sdn-combobox-field sdn-combobox-field-project--rzdy"
  },
  "icon": {
    "icon": "material-dataObject",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--xi68"
  },
  "input": {
    "placeholder": "Workspace Name",
    "type": "text",
    "role": "combobox",
    "aria-haspopup": "listbox",
    "className": "sdn-input sdn-input--twyx",
    "data-seldon-ref": "workspaceName"
  },
  "buttonIconic": {
    "className": "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "workspaceSave"
  },
  "icon2": {
    "icon": "material-save",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--vsau"
  },
  "frame2": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--ma6i"
  },
  "buttonToggle": {
    "className": "sdn-button-toggle sdn-button-iconic--pgsr",
    "data-seldon-ref": "sidebarComponents"
  },
  "icon3": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--vsau"
  },
  "buttonToggle2": {
    "className": "sdn-button-toggle sdn-button-iconic--pgsr",
    "data-seldon-ref": "sidebarResources"
  },
  "icon4": {
    "icon": "seldon-theme",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--vsau"
  },
  "frame3": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--enpy",
    "data-seldon-ref": "objectsContainer"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-sidebar-objects", props.className))
const rootAttrs = { "role": sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame))
const comboboxFieldProjectProps = computed(() => mergeSlot(sdn.comboboxFieldProject, props.comboboxFieldProject))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const inputProps = computed(() => mergeSlot(sdn.input, props.input))
const buttonIconicProps = computed(() => mergeSlot(sdn.buttonIconic, props.buttonIconic))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2))
const buttonToggleProps = computed(() => mergeSlot(sdn.buttonToggle, props.buttonToggle))
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3))
const buttonToggle2Props = computed(() => mergeSlot(sdn.buttonToggle2, props.buttonToggle2))
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4))
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Frame v-bind="frameProps">
          <ComboboxFieldProject v-if="comboboxFieldProject && comboboxFieldProjectProps" v-bind="comboboxFieldProjectProps" :icon="iconProps" :input="inputProps" :buttonIconic="buttonIconicProps" :icon2="icon2Props" />
          <Frame v-bind="frame2Props" v-if="frame2">
            <ButtonToggle v-if="buttonToggle && buttonToggleProps" v-bind="buttonToggleProps" :icon="icon3Props" />
            <ButtonToggle v-if="buttonToggle2 && buttonToggle2Props" v-bind="buttonToggle2Props" :icon="icon4Props" />
          </Frame>
        </Frame>
        <Frame v-bind="frame3Props" v-if="frame3">
          <slot name="objects" />
        </Frame>
      </slot>
    </div>
</template>
