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
 *   Bar             bar
 *     TextTitle     textTitle
 *     ButtonIconic  buttonIconic
 *       Icon        icon
 *   Frame           frame
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
import { combineClassNames, mergeSlot, mergeOptionalSlot } from "../utils/class-names"
import Frame from "../frames/Frame.vue"
import Bar from "../parts/Bar.vue"
import ButtonIconic from "../elements/ButtonIconic.vue"
import TextTitle from "../primitives/TextTitle.vue"

const props = defineProps<{
  className?: string
  bar?: Record<string, unknown> | null
  textTitle?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  frame?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "role": "dialog",
  "aria-hidden": "false",
  "bar": {
    "aria-hidden": "false",
    "className": "sdn-bar sdn-bar--9xs7"
  },
  "textTitle": {
    "className": "sdn-text-title sdn-text-title--ulid"
  },
  "buttonIconic": {
    "className": "sdn-button-iconic sdn-button-iconic--pgsr"
  },
  "icon": {
    "icon": "material-close",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--rezm"
  },
  "frame": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--88jo"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-panel-palette", props.className))
const rootAttrs = { "role": sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const barProps = computed(() => mergeSlot(sdn.bar, props.bar, props.seldonRefs))
const textTitleProps = computed(() => mergeOptionalSlot(sdn.textTitle, props.textTitle, props.seldonRefs))
const buttonIconicProps = computed(() => mergeSlot(sdn.buttonIconic, props.buttonIconic, props.seldonRefs))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Bar v-if="barProps !== null" v-bind="barProps">
          <TextTitle v-if="textTitleProps !== null" v-bind="textTitleProps" />
          <ButtonIconic v-if="buttonIconicProps !== null" v-bind="buttonIconicProps" :icon="iconProps" />
        </Bar>
        <Frame v-bind="frameProps">
        </Frame>
      </slot>
    </div>
</template>
