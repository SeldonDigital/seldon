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
 * Bar: BarHariModels
 * Level: Part
 * Intent: Groups related controls in a horizontal bar with buttons, navigation, or tabs layouts.
 * Tags: bar, controls, buttons, navigation, tabs, UI, layout, group
 * Type: Inline
 *
 * Structure:
 *   Textarea         textarea      -> hariInput
 *   Frame            frame
 *     Frame          frame2
 *       ButtonMenu   buttonMenu    -> hariModel
 *         TextLabel  textLabel     -> hariModelLabel
 *         Icon       icon
 *       ButtonMenu   buttonMenu2   -> hariThinking
 *         TextLabel  textLabel2    -> hariThinkingLabel
 *         Icon       icon2
 *     Chip           chip          -> hariSelection
 *       TextLabel    textLabel3    -> hariSelectionLabel
 *     ButtonIconic   buttonIconic  -> hariSend
 *       Icon         icon3         -> hariSendIcon
 *
 * @example
 * ```vue
 * <BarHariModels
 *   aria-hidden="false"
 *   textarea="{}"
 *   frame="{}"
 *   buttonMenu={() => {}}
 *   textLabel="{}"
 *   icon="material-star"
 *   buttonMenu2={() => {}}
 *   chip="{}"
 *   buttonIconic={() => {}}
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import ButtonIconic from "../elements/ButtonIconic.vue"
import ButtonMenu from "../elements/ButtonMenu.vue"
import Chip from "../elements/Chip.vue"
import Frame from "../frames/Frame.vue"
import Icon from "../primitives/Icon.vue"
import TextLabel from "../primitives/TextLabel.vue"
import Textarea from "../primitives/Textarea.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  textarea?: Record<string, unknown> | null
  frame?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  buttonMenu?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  buttonMenu2?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  chip?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  textarea: {
    placeholder: "What do want to do...",
    className: "sdn-textarea sdn-textarea--tyvc",
    "data-seldon-ref": "hariInput",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--o0l9",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ygx6",
  },
  buttonMenu: {
    className: "sdn-button-menu sdn-button-iconic--pgsr",
    "data-seldon-ref": "hariModel",
  },
  textLabel: {
    children: "Model Menu",
    className: "sdn-text-label sdn-text-label--sa6t",
    "data-seldon-ref": "hariModelLabel",
  },
  icon: {
    icon: "material-keyboardArrowDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--y2ct",
  },
  buttonMenu2: {
    className: "sdn-button-menu sdn-button-iconic--pgsr",
    "data-seldon-ref": "hariThinking",
  },
  textLabel2: {
    children: "Thinking Level",
    className: "sdn-text-label sdn-text-label--sa6t",
    "data-seldon-ref": "hariThinkingLabel",
  },
  icon2: {
    icon: "material-keyboardArrowDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--y2ct",
  },
  chip: {
    className: "sdn-chip sdn-chip--dzlq",
    "data-seldon-ref": "hariSelection",
  },
  textLabel3: {
    children: "Scope",
    className: "sdn-text-label sdn-text-label--ngh4",
    "data-seldon-ref": "hariSelectionLabel",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--gbhl",
    "data-seldon-ref": "hariSend",
  },
  icon3: {
    icon: "material-arrowUpward",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--yhts",
    "data-seldon-ref": "hariSendIcon",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-bar-hari-models", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const textareaProps = computed(() =>
  mergeOptionalSlot(sdn.textarea, props.textarea, props.seldonRefs),
)
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const buttonMenuProps = computed(() =>
  mergeOptionalSlot(sdn.buttonMenu, props.buttonMenu, props.seldonRefs),
)
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const buttonMenu2Props = computed(() =>
  mergeOptionalSlot(sdn.buttonMenu2, props.buttonMenu2, props.seldonRefs),
)
const textLabel2Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs),
)
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2, props.seldonRefs))
const chipProps = computed(() => mergeOptionalSlot(sdn.chip, props.chip, props.seldonRefs))
const textLabel3Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs),
)
const buttonIconicProps = computed(() =>
  mergeOptionalSlot(sdn.buttonIconic, props.buttonIconic, props.seldonRefs),
)
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3, props.seldonRefs))
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Textarea v-if="textareaProps !== null" v-bind="textareaProps" />
      <Frame v-bind="frameProps" v-if="frameProps !== null">
        <Frame v-bind="frame2Props" v-if="frame2Props !== null">
          <ButtonMenu v-if="buttonMenuProps !== null" v-bind="buttonMenuProps">
            <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
            <Icon v-if="iconProps !== null" v-bind="iconProps" />
          </ButtonMenu>
          <ButtonMenu v-if="buttonMenu2Props !== null" v-bind="buttonMenu2Props">
            <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
            <Icon v-if="icon2Props !== null" v-bind="icon2Props" />
          </ButtonMenu>
        </Frame>
        <Chip v-if="chipProps !== null" v-bind="chipProps">
          <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
        </Chip>
        <ButtonIconic
          v-if="buttonIconicProps !== null"
          v-bind="buttonIconicProps"
          :icon="icon3Props"
        />
      </Frame>
    </slot>
  </div>
</template>
