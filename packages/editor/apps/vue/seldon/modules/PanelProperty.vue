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
 * Panel: PanelProperty
 * Level: Module
 * Intent: Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.
 * Tags: panel, dialog, modal, ui, overlay, popup, interaction, alert
 * Type: Inline
 *
 * Structure:
 *   Frame           frame
 *     ButtonIconic  buttonIconic
 *       Icon        icon
 *     ButtonIconic  buttonIconic2
 *       Icon        icon2
 *   Frame           frame2
 *
 * @example
 * ```vue
 * <PanelProperty
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
  buttonIconic?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  buttonIconic2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
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
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--tlj6",
  },
  icon: {
    icon: "seldon-more",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--mahk",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--tlj6",
  },
  icon2: {
    icon: "material-close",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--mahk",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--jbzn",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-panel-palette", props.className))
const rootAttrs = { role: sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const buttonIconicProps = computed(() =>
  mergeOptionalSlot(sdn.buttonIconic, props.buttonIconic, props.seldonRefs),
)
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const buttonIconic2Props = computed(() =>
  mergeOptionalSlot(sdn.buttonIconic2, props.buttonIconic2, props.seldonRefs),
)
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2, props.seldonRefs))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Frame v-bind="frameProps">
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
      <Frame v-bind="frame2Props" v-if="frame2Props !== null"> </Frame>
    </slot>
  </div>
</template>
