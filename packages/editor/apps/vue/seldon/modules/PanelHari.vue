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
 *   Frame                frame
 *     ButtonIconic       buttonIconic
 *       Icon             icon
 *     ButtonIconic       buttonIconic2
 *       Icon             icon2
 *   Frame                frame2         -> hariTurns
 *   Frame                frame3
 *     BarHariModels      barHariModels
 *       Textarea         textarea
 *       Frame            frame4
 *         Frame          frame5
 *           ButtonMenu   buttonMenu
 *             TextLabel  textLabel
 *             Icon       icon3
 *           ButtonMenu   buttonMenu2
 *             TextLabel  textLabel2
 *             Icon       icon4
 *         Chip           chip
 *           TextLabel    textLabel3
 *         ButtonIconic   buttonIconic3
 *           Icon         icon5
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
import Chip from "../elements/Chip.vue"
import Frame from "../frames/Frame.vue"
import BarHariModels from "../parts/BarHariModels.vue"
import Icon from "../primitives/Icon.vue"
import TextLabel from "../primitives/TextLabel.vue"
import Textarea from "../primitives/Textarea.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  buttonIconic2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
  barHariModels?: Record<string, unknown> | null
  textarea?: Record<string, unknown> | null
  frame4?: Record<string, unknown> | null
  frame5?: Record<string, unknown> | null
  buttonMenu?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  buttonMenu2?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  chip?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  buttonIconic3?: Record<string, unknown> | null
  icon5?: Record<string, unknown> | null
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
    className: "sdn-frame sdn-frame--jv04",
    "data-seldon-ref": "hariTurns",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--jbzn",
  },
  barHariModels: {
    className: "sdn-bar-hari-models sdn-bar-state--mlcq",
  },
  textarea: {
    placeholder: "What do want to do...",
    className: "sdn-textarea sdn-textarea--tyvc",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--o0l9",
  },
  frame5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ygx6",
  },
  buttonMenu: {
    className: "sdn-button-menu sdn-button-iconic--pgsr",
  },
  textLabel: {
    children: "Model Menu",
    className: "sdn-text-label sdn-text-label--sa6t",
  },
  icon3: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--y2ct",
  },
  buttonMenu2: {
    className: "sdn-button-menu sdn-button-iconic--pgsr",
  },
  textLabel2: {
    children: "Thinking Level",
    className: "sdn-text-label sdn-text-label--sa6t",
  },
  icon4: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--y2ct",
  },
  chip: {
    className: "sdn-chip sdn-chip--dzlq",
  },
  textLabel3: {
    children: "Scope",
    className: "sdn-text-label sdn-text-label--ngh4",
  },
  buttonIconic3: {
    className: "sdn-button-iconic sdn-button-iconic--gbhl",
  },
  icon5: {
    icon: "material-arrowUpward",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
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
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3, props.seldonRefs))
const barHariModelsProps = computed(() =>
  mergeOptionalSlot(sdn.barHariModels, props.barHariModels, props.seldonRefs),
)
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
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3, props.seldonRefs))
const buttonMenu2Props = computed(() =>
  mergeOptionalSlot(sdn.buttonMenu2, props.buttonMenu2, props.seldonRefs),
)
const textLabel2Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs),
)
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4, props.seldonRefs))
const chipProps = computed(() => mergeOptionalSlot(sdn.chip, props.chip, props.seldonRefs))
const textLabel3Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs),
)
const buttonIconic3Props = computed(() =>
  mergeOptionalSlot(sdn.buttonIconic3, props.buttonIconic3, props.seldonRefs),
)
const icon5Props = computed(() => mergeSlot(sdn.icon5, props.icon5, props.seldonRefs))
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
      <Frame v-bind="frame2Props" v-if="frame2Props !== null">
        <slot name="hariTurns" />
      </Frame>
      <Frame v-bind="frame3Props" v-if="frame3Props !== null">
        <BarHariModels v-if="barHariModelsProps !== null" v-bind="barHariModelsProps">
          <Textarea v-if="textareaProps !== null" v-bind="textareaProps" />
          <Frame v-bind="frame4Props" v-if="frame4Props !== null">
            <Frame v-bind="frame5Props" v-if="frame5Props !== null">
              <ButtonMenu v-if="buttonMenuProps !== null" v-bind="buttonMenuProps">
                <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
                <Icon v-if="icon3Props !== null" v-bind="icon3Props" />
              </ButtonMenu>
              <ButtonMenu v-if="buttonMenu2Props !== null" v-bind="buttonMenu2Props">
                <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
                <Icon v-if="icon4Props !== null" v-bind="icon4Props" />
              </ButtonMenu>
            </Frame>
            <Chip v-if="chipProps !== null" v-bind="chipProps">
              <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
            </Chip>
            <ButtonIconic
              v-if="buttonIconic3Props !== null"
              v-bind="buttonIconic3Props"
              :icon="icon5Props"
            />
          </Frame>
        </BarHariModels>
      </Frame>
    </slot>
  </div>
</template>
