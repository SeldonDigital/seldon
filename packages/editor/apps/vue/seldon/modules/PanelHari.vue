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
 * Panel: PanelHari
 * Level: Module
 * Intent: Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.
 * Tags: panel, dialog, modal, ui, overlay, popup, interaction, alert
 * Type: Inline
 *
 * Structure:
 *   Bar               bar            -> hariBar
 *     TextTitle       textTitle
 *     Frame           frame
 *       ButtonToggle  buttonToggle   -> hariOutcome
 *         Icon        icon
 *       ButtonToggle  buttonToggle2  -> hariTools
 *         Icon        icon2
 *       ButtonToggle  buttonToggle3  -> hariClamp
 *         Icon        icon3
 *     ButtonIconic    buttonIconic   -> hariReset
 *       Icon          icon4
 *     ButtonIconic    buttonIconic2  -> hariClose
 *       Icon          icon5
 *   Frame             frame2         -> hariTurns
 *   Frame             frame3
 *     Textarea        textarea       -> hariInput
 *   Frame             frame4
 *     Frame           frame5
 *       ButtonMenu    buttonMenu     -> hariModel
 *         TextLabel   textLabel      -> hariModelLabel
 *         Icon        icon6
 *       ButtonMenu    buttonMenu2    -> hariThinking
 *         TextLabel   textLabel2     -> hariThinkingLabel
 *         Icon        icon7
 *       Chip          chip           -> hariSelection
 *         TextLabel   textLabel3     -> hariSelectionLabel
 *       ButtonIconic  buttonIconic3  -> hariSend
 *         Icon        icon8          -> hariSendIcon
 *
 * @example
 * ```vue
 * <PanelHari
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
import ButtonToggle from "../elements/ButtonToggle.vue"
import Chip from "../elements/Chip.vue"
import Frame from "../frames/Frame.vue"
import Bar from "../parts/Bar.vue"
import Icon from "../primitives/Icon.vue"
import TextLabel from "../primitives/TextLabel.vue"
import TextTitle from "../primitives/TextTitle.vue"
import Textarea from "../primitives/Textarea.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  bar?: Record<string, unknown> | null
  textTitle?: Record<string, unknown> | null
  frame?: Record<string, unknown> | null
  buttonToggle?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  buttonToggle2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  buttonToggle3?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  buttonIconic2?: Record<string, unknown> | null
  icon5?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
  textarea?: Record<string, unknown> | null
  frame4?: Record<string, unknown> | null
  frame5?: Record<string, unknown> | null
  buttonMenu?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  icon6?: Record<string, unknown> | null
  buttonMenu2?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  icon7?: Record<string, unknown> | null
  chip?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  buttonIconic3?: Record<string, unknown> | null
  icon8?: Record<string, unknown> | null
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
    "data-seldon-ref": "hariBar",
  },
  textTitle: {
    children: "Hari",
    className: "sdn-text-title sdn-text-title--ulid",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--i5kj",
  },
  buttonToggle: {
    className: "sdn-button-toggle sdn-button-iconic--pgsr",
    "data-seldon-ref": "hariOutcome",
  },
  icon: {
    icon: "material-outputCircle",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  buttonToggle2: {
    className: "sdn-button-toggle sdn-button-iconic--pgsr",
    "data-seldon-ref": "hariTools",
  },
  icon2: {
    icon: "material-buildCircle",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  buttonToggle3: {
    className: "sdn-button-toggle sdn-button-iconic--pgsr",
    "data-seldon-ref": "hariClamp",
  },
  icon3: {
    icon: "material-neurology",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "hariReset",
  },
  icon4: {
    icon: "seldon-reset",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rezm",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "hariClose",
  },
  icon5: {
    icon: "material-close",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rezm",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--vorn",
    "data-seldon-ref": "hariTurns",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--jhsq",
  },
  textarea: {
    placeholder: "Placeholder text",
    className: "sdn-textarea sdn-textarea--2upw",
    "data-seldon-ref": "hariInput",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--meos",
  },
  frame5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--a5w4",
  },
  buttonMenu: {
    className: "sdn-button-menu sdn-button-menu--ipe0",
    "data-seldon-ref": "hariModel",
  },
  textLabel: {
    children: "Model",
    className: "sdn-text-label sdn-text-label--sa6t",
    "data-seldon-ref": "hariModelLabel",
  },
  icon6: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--y2ct",
  },
  buttonMenu2: {
    className: "sdn-button-menu sdn-button-menu--ipe0",
    "data-seldon-ref": "hariThinking",
  },
  textLabel2: {
    children: "Thinking Level",
    className: "sdn-text-label sdn-text-label--sa6t",
    "data-seldon-ref": "hariThinkingLabel",
  },
  icon7: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--y2ct",
  },
  chip: {
    className: "sdn-chip sdn-chip--lo6k",
    "data-seldon-ref": "hariSelection",
  },
  textLabel3: {
    children: "Scope",
    className: "sdn-text-label sdn-text-label--lug5",
    "data-seldon-ref": "hariSelectionLabel",
  },
  buttonIconic3: {
    className: "sdn-button-iconic sdn-button-iconic--wh0i",
    "data-seldon-ref": "hariSend",
  },
  icon8: {
    icon: "material-arrowUpward",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
    "data-seldon-ref": "hariSendIcon",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-panel-hari", props.className))
const rootAttrs = { role: sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const barProps = computed(() => mergeSlot(sdn.bar, props.bar, props.seldonRefs))
const textTitleProps = computed(() =>
  mergeOptionalSlot(sdn.textTitle, props.textTitle, props.seldonRefs),
)
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const buttonToggleProps = computed(() =>
  mergeOptionalSlot(sdn.buttonToggle, props.buttonToggle, props.seldonRefs),
)
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const buttonToggle2Props = computed(() =>
  mergeOptionalSlot(sdn.buttonToggle2, props.buttonToggle2, props.seldonRefs),
)
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2, props.seldonRefs))
const buttonToggle3Props = computed(() =>
  mergeOptionalSlot(sdn.buttonToggle3, props.buttonToggle3, props.seldonRefs),
)
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3, props.seldonRefs))
const buttonIconicProps = computed(() =>
  mergeSlot(sdn.buttonIconic, props.buttonIconic, props.seldonRefs),
)
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4, props.seldonRefs))
const buttonIconic2Props = computed(() =>
  mergeOptionalSlot(sdn.buttonIconic2, props.buttonIconic2, props.seldonRefs),
)
const icon5Props = computed(() => mergeSlot(sdn.icon5, props.icon5, props.seldonRefs))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3, props.seldonRefs))
const textareaProps = computed(() =>
  mergeOptionalSlot(sdn.textarea, props.textarea, props.seldonRefs),
)
const frame4Props = computed(() => mergeSlot(sdn.frame4, props.frame4, props.seldonRefs))
const frame5Props = computed(() => mergeSlot(sdn.frame5, props.frame5, props.seldonRefs))
const buttonMenuProps = computed(() =>
  mergeOptionalSlot(sdn.buttonMenu, props.buttonMenu, props.seldonRefs),
)
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const icon6Props = computed(() => mergeSlot(sdn.icon6, props.icon6, props.seldonRefs))
const buttonMenu2Props = computed(() =>
  mergeOptionalSlot(sdn.buttonMenu2, props.buttonMenu2, props.seldonRefs),
)
const textLabel2Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs),
)
const icon7Props = computed(() => mergeSlot(sdn.icon7, props.icon7, props.seldonRefs))
const chipProps = computed(() => mergeOptionalSlot(sdn.chip, props.chip, props.seldonRefs))
const textLabel3Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs),
)
const buttonIconic3Props = computed(() =>
  mergeOptionalSlot(sdn.buttonIconic3, props.buttonIconic3, props.seldonRefs),
)
const icon8Props = computed(() => mergeSlot(sdn.icon8, props.icon8, props.seldonRefs))
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Bar v-if="barProps !== null" v-bind="barProps">
        <TextTitle v-if="textTitleProps !== null" v-bind="textTitleProps" />
        <Frame v-bind="frameProps" v-if="frameProps !== null">
          <ButtonToggle
            v-if="buttonToggleProps !== null"
            v-bind="buttonToggleProps"
            :icon="iconProps"
          />
          <ButtonToggle
            v-if="buttonToggle2Props !== null"
            v-bind="buttonToggle2Props"
            :icon="icon2Props"
          />
          <ButtonToggle
            v-if="buttonToggle3Props !== null"
            v-bind="buttonToggle3Props"
            :icon="icon3Props"
          />
        </Frame>
        <ButtonIconic
          v-if="buttonIconicProps !== null"
          v-bind="buttonIconicProps"
          :icon="icon4Props"
        />
        <ButtonIconic
          v-if="buttonIconic2Props !== null"
          v-bind="buttonIconic2Props"
          :icon="icon5Props"
        />
      </Bar>
      <Frame v-bind="frame2Props">
        <slot name="hariTurns" />
      </Frame>
      <Frame v-bind="frame3Props" v-if="frame3Props !== null">
        <Textarea v-if="textareaProps !== null" v-bind="textareaProps" />
      </Frame>
      <Frame v-bind="frame4Props" v-if="frame4Props !== null">
        <Frame v-bind="frame5Props" v-if="frame5Props !== null">
          <ButtonMenu v-if="buttonMenuProps !== null" v-bind="buttonMenuProps">
            <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
            <Icon v-if="icon6Props !== null" v-bind="icon6Props" />
          </ButtonMenu>
          <ButtonMenu v-if="buttonMenu2Props !== null" v-bind="buttonMenu2Props">
            <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
            <Icon v-if="icon7Props !== null" v-bind="icon7Props" />
          </ButtonMenu>
          <Chip v-if="chipProps !== null" v-bind="chipProps">
            <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
          </Chip>
          <ButtonIconic
            v-if="buttonIconic3Props !== null"
            v-bind="buttonIconic3Props"
            :icon="icon8Props"
          />
        </Frame>
      </Frame>
    </slot>
  </div>
</template>
