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
 * Panel: PanelHari
 * Level: Module
 * Intent: Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.
 * Tags: panel, dialog, modal, ui, overlay, popup, interaction, alert
 * Type: Inline
 *
 * @example
 * ```vue
 * <PanelHari
 *   role="dialog"
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
import Bar from "../parts/Bar.vue"
import ButtonIconic from "../elements/ButtonIconic.vue"
import ButtonMenu from "../elements/ButtonMenu.vue"
import ButtonToggle from "../elements/ButtonToggle.vue"
import Chip from "../elements/Chip.vue"
import Icon from "../primitives/Icon.vue"
import Textarea from "../primitives/Textarea.vue"
import TextLabel from "../primitives/TextLabel.vue"
import TextTitle from "../primitives/TextTitle.vue"

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
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "role": "dialog",
  "aria-hidden": "false",
  "className": "sdn-panel-hari sdn-panel",
  "bar": {
    "aria-hidden": "false",
    "className": "sdn-bar sdn-bar--9xs7"
  },
  "textTitle": {
    "className": "sdn-text-title sdn-text-title--ulid"
  },
  "frame": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--i5kj"
  },
  "buttonToggle": {
    "className": "sdn-button-toggle sdn-button-iconic--pgsr",
    "data-seldon-ref": "hariOutcome"
  },
  "icon": {
    "icon": "material-outputCircle",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--vsau"
  },
  "buttonToggle2": {
    "className": "sdn-button-toggle sdn-button-iconic--pgsr",
    "data-seldon-ref": "hariTools"
  },
  "icon2": {
    "icon": "material-buildCircle",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--vsau"
  },
  "buttonToggle3": {
    "className": "sdn-button-toggle sdn-button-iconic--pgsr",
    "data-seldon-ref": "hariClamp"
  },
  "icon3": {
    "icon": "material-neurology",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--vsau"
  },
  "buttonIconic": {
    "className": "sdn-button-iconic sdn-button-iconic--pgsr"
  },
  "icon4": {
    "icon": "seldon-reset",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--rezm"
  },
  "buttonIconic2": {
    "className": "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "hariClose"
  },
  "icon5": {
    "icon": "material-close",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--rezm"
  },
  "frame2": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--vorn",
    "data-seldon-ref": "turns"
  },
  "frame3": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--jhsq"
  },
  "textarea": {
    "className": "sdn-textarea sdn-textarea--2upw",
    "data-seldon-ref": "hariInput"
  },
  "frame4": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--meos"
  },
  "frame5": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--a5w4"
  },
  "buttonMenu": {
    "className": "sdn-button-menu sdn-button-menu--ipe0",
    "data-seldon-ref": "hariModel"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--sa6t"
  },
  "icon6": {
    "icon": "material-chevronDown",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--y2ct"
  },
  "buttonMenu2": {
    "className": "sdn-button-menu sdn-button-menu--ipe0",
    "data-seldon-ref": "hariThinking"
  },
  "textLabel2": {
    "className": "sdn-text-label sdn-text-label--sa6t"
  },
  "icon7": {
    "icon": "material-chevronDown",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--y2ct"
  },
  "chip": {
    "className": "sdn-chip sdn-chip--lo6k",
    "data-seldon-ref": "hariSelection"
  },
  "textLabel3": {
    "className": "sdn-text-label sdn-text-label--lug5"
  },
  "buttonIconic3": {
    "className": "sdn-button-iconic sdn-button-iconic--wh0i",
    "data-seldon-ref": "hariSend"
  },
  "icon8": {
    "icon": "material-arrowUpward",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--umgs"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-panel-hari", props.className))
const rootAttrs = { "role": sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const barProps = computed(() => mergeSlot(sdn.bar, props.bar))
const textTitleProps = computed(() => mergeSlot(sdn.textTitle, props.textTitle))
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame))
const buttonToggleProps = computed(() => mergeSlot(sdn.buttonToggle, props.buttonToggle))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const buttonToggle2Props = computed(() => mergeSlot(sdn.buttonToggle2, props.buttonToggle2))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2))
const buttonToggle3Props = computed(() => mergeSlot(sdn.buttonToggle3, props.buttonToggle3))
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3))
const buttonIconicProps = computed(() => mergeSlot(sdn.buttonIconic, props.buttonIconic))
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4))
const buttonIconic2Props = computed(() => mergeSlot(sdn.buttonIconic2, props.buttonIconic2))
const icon5Props = computed(() => mergeSlot(sdn.icon5, props.icon5))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2))
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3))
const textareaProps = computed(() => mergeSlot(sdn.textarea, props.textarea))
const frame4Props = computed(() => mergeSlot(sdn.frame4, props.frame4))
const frame5Props = computed(() => mergeSlot(sdn.frame5, props.frame5))
const buttonMenuProps = computed(() => mergeSlot(sdn.buttonMenu, props.buttonMenu))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const icon6Props = computed(() => mergeSlot(sdn.icon6, props.icon6))
const buttonMenu2Props = computed(() => mergeSlot(sdn.buttonMenu2, props.buttonMenu2))
const textLabel2Props = computed(() => mergeSlot(sdn.textLabel2, props.textLabel2))
const icon7Props = computed(() => mergeSlot(sdn.icon7, props.icon7))
const chipProps = computed(() => mergeSlot(sdn.chip, props.chip))
const textLabel3Props = computed(() => mergeSlot(sdn.textLabel3, props.textLabel3))
const buttonIconic3Props = computed(() => mergeSlot(sdn.buttonIconic3, props.buttonIconic3))
const icon8Props = computed(() => mergeSlot(sdn.icon8, props.icon8))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Bar v-if="barProps !== null" v-bind="barProps">
          <TextTitle v-if="textTitle && textTitleProps" v-bind="textTitleProps" />
          <Frame v-bind="frameProps" v-if="frame">
            <ButtonToggle v-if="buttonToggle && buttonToggleProps" v-bind="buttonToggleProps" :icon="iconProps" />
            <ButtonToggle v-if="buttonToggle2 && buttonToggle2Props" v-bind="buttonToggle2Props" :icon="icon2Props" />
            <ButtonToggle v-if="buttonToggle3 && buttonToggle3Props" v-bind="buttonToggle3Props" :icon="icon3Props" />
          </Frame>
          <ButtonIconic v-if="buttonIconicProps !== null" v-bind="buttonIconicProps" :icon="icon4Props" />
          <ButtonIconic v-if="buttonIconic2 && buttonIconic2Props" v-bind="buttonIconic2Props" :icon="icon5Props" />
        </Bar>
        <Frame v-bind="frame2Props">
        </Frame>
        <Frame v-bind="frame3Props" v-if="frame3">
          <Textarea v-if="textarea && textareaProps" v-bind="textareaProps" />
        </Frame>
        <Frame v-bind="frame4Props" v-if="frame4">
          <Frame v-bind="frame5Props" v-if="frame5">
            <ButtonMenu v-if="buttonMenu && buttonMenuProps" v-bind="buttonMenuProps">
              <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
              <Icon v-if="icon6Props !== null" v-bind="icon6Props" />
            </ButtonMenu>
            <ButtonMenu v-if="buttonMenu2 && buttonMenu2Props" v-bind="buttonMenu2Props">
              <TextLabel v-if="textLabel2 && textLabel2Props" v-bind="textLabel2Props" />
              <Icon v-if="icon7Props !== null" v-bind="icon7Props" />
            </ButtonMenu>
            <Chip v-if="chip && chipProps" v-bind="chipProps">
              <TextLabel v-if="textLabel3 && textLabel3Props" v-bind="textLabel3Props" />
            </Chip>
            <ButtonIconic v-if="buttonIconic3 && buttonIconic3Props" v-bind="buttonIconic3Props" :icon="icon8Props" />
          </Frame>
        </Frame>
      </slot>
    </div>
</template>
