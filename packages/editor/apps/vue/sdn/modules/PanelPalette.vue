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
 * Panel: PanelPalette
 * Level: Module
 * Intent: Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.
 * Tags: panel, dialog, modal, ui, overlay, popup, interaction, alert
 * Type: Inline
 *
 * Structure:
 *   Frame           frame          -> paletteTopBar
 *     Frame         frame2         -> paletteTopBarSlot
 *     ButtonIconic  buttonIconic   -> paletteOption
 *       Icon        icon           -> paletteOptionIcon
 *     ButtonIconic  buttonIconic2  -> paletteClose
 *       Icon        icon2          -> paletteCloseIcon
 *   Frame           frame3         -> paletteContents
 *   Frame           frame4         -> paletteBottomBar
 *     Frame         frame5         -> paletteBottomBarSlot
 *
 * @example
 * ```vue
 * <PanelPalette
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
import Frame from "../frames/Frame.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  buttonIconic2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
  frame4?: Record<string, unknown> | null
  frame5?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  role: "dialog",
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--jbzn",
    "data-seldon-ref": "paletteTopBar",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--jm7o",
    "data-seldon-ref": "paletteTopBarSlot",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--tlj6",
    "data-seldon-ref": "paletteOption",
  },
  icon: {
    icon: "seldon-more",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--mahk",
    "data-seldon-ref": "paletteOptionIcon",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--tlj6",
    "data-seldon-ref": "paletteClose",
  },
  icon2: {
    icon: "material-close",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--mahk",
    "data-seldon-ref": "paletteCloseIcon",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--p4qj",
    "data-seldon-ref": "paletteContents",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rc9x",
    "data-seldon-ref": "paletteBottomBar",
  },
  frame5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--jm7o",
    "data-seldon-ref": "paletteBottomBarSlot",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-panel-palette", props.className))
const rootAttrs = { role: sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const buttonIconicProps = computed(() =>
  mergeOptionalSlot(sdn.buttonIconic, props.buttonIconic, props.seldonRefs),
)
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const buttonIconic2Props = computed(() =>
  mergeOptionalSlot(sdn.buttonIconic2, props.buttonIconic2, props.seldonRefs),
)
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2, props.seldonRefs))
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3, props.seldonRefs))
const frame4Props = computed(() => mergeSlot(sdn.frame4, props.frame4, props.seldonRefs))
const frame5Props = computed(() => mergeSlot(sdn.frame5, props.frame5, props.seldonRefs))
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Frame v-bind="frameProps">
        <Frame v-bind="frame2Props" v-if="frame2Props !== null">
          <slot name="paletteTopBarSlot" />
        </Frame>
        <ButtonIconic
          v-if="buttonIconicProps !== null"
          v-bind="buttonIconicProps"
          :icon="iconProps"
        />
        <ButtonIconic
          v-if="buttonIconic2Props !== null"
          v-bind="buttonIconic2Props"
          :icon="icon2Props"
        />
      </Frame>
      <Frame v-bind="frame3Props" v-if="frame3Props !== null">
        <slot name="paletteContents" />
      </Frame>
      <Frame v-bind="frame4Props" v-if="frame4Props !== null">
        <Frame v-bind="frame5Props" v-if="frame5Props !== null">
          <slot name="paletteBottomBarSlot" />
        </Frame>
      </Frame>
    </slot>
  </div>
</template>
