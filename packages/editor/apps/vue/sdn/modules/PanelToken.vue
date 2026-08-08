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
 * Panel: PanelToken
 * Level: Module
 * Intent: Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.
 * Tags: panel, dialog, modal, ui, overlay, popup, interaction, alert
 * Type: Inline
 *
 * Structure:
 *   ChipAssist   chipAssist  -> tokenChip
 *     TextLabel  textLabel   -> tokenChipName
 *     TextLabel  textLabel2  -> tokenChipValue
 *     Icon       icon        -> tokenChipIcon
 *   Frame        frame       -> tokenCard
 *
 * @example
 * ```vue
 * <PanelToken
 *   role="dialog"
 *   aria-hidden="false"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import ChipAssist from "../elements/ChipAssist.vue"
import Frame from "../frames/Frame.vue"
import Icon from "../primitives/Icon.vue"
import TextLabel from "../primitives/TextLabel.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  chipAssist?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  frame?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  role: "dialog",
  "aria-hidden": "false",
  chipAssist: {
    className: "sdn-chip sdn-chip-assist--5mmz",
    "data-seldon-ref": "tokenChip",
  },
  textLabel: {
    children: "TokenName",
    className: "sdn-text-label sdn-text-label--ee5h",
    "data-seldon-ref": "tokenChipName",
  },
  textLabel2: {
    children: "Value",
    className: "sdn-text-label sdn-text-label--6ypr",
    "data-seldon-ref": "tokenChipValue",
  },
  icon: {
    icon: "seldon-theme",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
    "data-seldon-ref": "tokenChipIcon",
  },
  frame: {
    wrapperElement: "div",
    role: "dialog",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--tnni",
    "data-seldon-ref": "tokenCard",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-panel-token", props.className))
const rootAttrs = { role: sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const chipAssistProps = computed(() =>
  mergeOptionalSlot(sdn.chipAssist, props.chipAssist, props.seldonRefs),
)
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const textLabel2Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs),
)
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <ChipAssist v-if="chipAssistProps !== null" v-bind="chipAssistProps">
        <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
        <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
        <Icon v-if="iconProps !== null" v-bind="iconProps" />
      </ChipAssist>
      <Frame v-bind="frameProps">
        <slot name="tokenCard" />
      </Frame>
    </slot>
  </div>
</template>
