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
 * Panel: PanelRefs
 * Level: Module
 * Intent: Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.
 * Tags: panel, dialog, modal, ui, overlay, popup, interaction, alert
 * Type: Inline
 *
 * Structure:
 *   ChipAssist     chipAssist  -> refChip
 *     TextLabel    textLabel   -> refChipName
 *     Icon         icon        -> refChipIcon
 *   Frame          frame       -> refCard
 *     Frame        frame2
 *       TextLabel  textLabel2
 *       Text       text        -> refCardView
 *       Text       text2       -> refCardPath
 *       Text       text3       -> refCardCondition
 *     TextLabel    textLabel3
 *     Frame        frame3      -> refCardControllers
 *
 * @example
 * ```vue
 * <PanelRefs
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
import Text from "../primitives/Text.vue"
import TextLabel from "../primitives/TextLabel.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  chipAssist?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  frame?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  text?: Record<string, unknown> | null
  text2?: Record<string, unknown> | null
  text3?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  role: "dialog",
  "aria-hidden": "false",
  chipAssist: {
    className: "sdn-chip sdn-chip-assist--ik8r",
    "data-seldon-ref": "refChip",
  },
  textLabel: {
    children: "ReferenceName",
    className: "sdn-text-label sdn-text-label--litz",
    "data-seldon-ref": "refChipName",
  },
  icon: {
    icon: "material-dataObject",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--afgp",
    "data-seldon-ref": "refChipIcon",
  },
  frame: {
    wrapperElement: "div",
    role: "dialog",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--lad1",
    "data-seldon-ref": "refCard",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--xmfu",
  },
  textLabel2: {
    children: "Reference",
    className: "sdn-text-label sdn-text-label--b5oa",
  },
  text: {
    children: "referenceName: { interfaceKey }",
    className: "sdn-text sdn-text--9wfd",
    "data-seldon-ref": "refCardView",
  },
  text2: {
    children: "elements/ItemNode.tsx",
    className: "sdn-text sdn-text--wvhe",
    "data-seldon-ref": "refCardPath",
  },
  text3: {
    children: "render unless null",
    className: "sdn-text sdn-text--mc6h",
    "data-seldon-ref": "refCardCondition",
  },
  textLabel3: {
    children: "Controlled By",
    className: "sdn-text-label sdn-text-label--csur",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--lv6n",
    "data-seldon-ref": "refCardControllers",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-panel-refs", props.className))
const rootAttrs = { role: sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const chipAssistProps = computed(() =>
  mergeOptionalSlot(sdn.chipAssist, props.chipAssist, props.seldonRefs),
)
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const textLabel2Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs),
)
const textProps = computed(() => mergeOptionalSlot(sdn.text, props.text, props.seldonRefs))
const text2Props = computed(() => mergeOptionalSlot(sdn.text2, props.text2, props.seldonRefs))
const text3Props = computed(() => mergeOptionalSlot(sdn.text3, props.text3, props.seldonRefs))
const textLabel3Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs),
)
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3, props.seldonRefs))
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <ChipAssist v-if="chipAssistProps !== null" v-bind="chipAssistProps">
        <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
        <Icon v-if="iconProps !== null" v-bind="iconProps" />
      </ChipAssist>
      <Frame v-bind="frameProps">
        <Frame v-bind="frame2Props" v-if="frame2Props !== null">
          <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
          <Text v-if="textProps !== null" v-bind="textProps" />
          <Text v-if="text2Props !== null" v-bind="text2Props" />
          <Text v-if="text3Props !== null" v-bind="text3Props" />
        </Frame>
        <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
        <Frame v-bind="frame3Props" v-if="frame3Props !== null">
          <slot name="refCardControllers" />
        </Frame>
      </Frame>
    </slot>
  </div>
</template>
