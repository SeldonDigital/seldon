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
 * Sidebar: SidebarObjects
 * Level: Module
 * Intent: Provides a structured sidebar panel with tabbed navigation, content area, and status footer for application interfaces.
 * Tags: sidebar, panel, module, ui, layout, navigation, tabs, structured
 * Type: Inline
 *
 * Structure:
 *   Frame                   frame
 *     ComboboxFieldProject  comboboxFieldProject  -> workspaceField
 *       Icon                icon                  -> workspaceIcon
 *       Input               input                 -> workspaceName
 *       ButtonIconic        buttonIconic          -> workspaceSave
 *         Icon              icon2                 -> workspaceSaveIcon
 *     Frame                 frame2
 *       ButtonToggle        buttonToggle          -> objectsViewComponents
 *         Icon              icon3
 *       ButtonToggle        buttonToggle2         -> objectsViewResources
 *         Icon              icon4
 *   Frame                   frame3                -> objectsTree
 *
 * @example
 * ```vue
 * <SidebarObjects
 *   role="complementary"
 *   aria-hidden="false"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import ButtonToggle from "../elements/ButtonToggle.vue"
import ComboboxFieldProject from "../elements/ComboboxFieldProject.vue"
import Frame from "../frames/Frame.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

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
    className: "sdn-frame sdn-frame--p4y0",
  },
  comboboxFieldProject: {
    className: "sdn-combobox-field sdn-combobox-field-project--rzdy",
    "data-seldon-ref": "workspaceField",
  },
  icon: {
    icon: "material-dataObject",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "workspaceIcon",
  },
  input: {
    placeholder: "Workspace Name",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--twyx",
    "data-seldon-ref": "workspaceName",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "workspaceSave",
  },
  icon2: {
    icon: "material-save",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
    "data-seldon-ref": "workspaceSaveIcon",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ma6i",
  },
  buttonToggle: {
    className: "sdn-button-toggle sdn-button-iconic--pgsr",
    "data-seldon-ref": "objectsViewComponents",
  },
  icon3: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  buttonToggle2: {
    className: "sdn-button-toggle sdn-button-iconic--pgsr",
    "data-seldon-ref": "objectsViewResources",
  },
  icon4: {
    icon: "seldon-theme",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--enpy",
    "data-seldon-ref": "objectsTree",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-sidebar-objects", props.className))
const rootAttrs = { role: sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const comboboxFieldProjectProps = computed(() =>
  mergeOptionalSlot(sdn.comboboxFieldProject, props.comboboxFieldProject, props.seldonRefs),
)
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const inputProps = computed(() => mergeSlot(sdn.input, props.input, props.seldonRefs))
const buttonIconicProps = computed(() =>
  mergeSlot(sdn.buttonIconic, props.buttonIconic, props.seldonRefs),
)
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2, props.seldonRefs))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const buttonToggleProps = computed(() =>
  mergeOptionalSlot(sdn.buttonToggle, props.buttonToggle, props.seldonRefs),
)
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3, props.seldonRefs))
const buttonToggle2Props = computed(() =>
  mergeOptionalSlot(sdn.buttonToggle2, props.buttonToggle2, props.seldonRefs),
)
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4, props.seldonRefs))
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3, props.seldonRefs))
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Frame v-bind="frameProps">
        <ComboboxFieldProject
          v-if="comboboxFieldProjectProps !== null"
          v-bind="comboboxFieldProjectProps"
          :icon="iconProps"
          :input="inputProps"
          :buttonIconic="buttonIconicProps"
          :icon2="icon2Props"
        />
        <Frame v-bind="frame2Props" v-if="frame2Props !== null">
          <ButtonToggle
            v-if="buttonToggleProps !== null"
            v-bind="buttonToggleProps"
            :icon="icon3Props"
          />
          <ButtonToggle
            v-if="buttonToggle2Props !== null"
            v-bind="buttonToggle2Props"
            :icon="icon4Props"
          />
        </Frame>
      </Frame>
      <Frame v-bind="frame3Props" v-if="frame3Props !== null">
        <slot name="objectsTree" />
      </Frame>
    </slot>
  </div>
</template>
