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
 * Panel: PanelTokens
 * Level: Module
 * Intent: Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.
 * Tags: panel, dialog, modal, ui, overlay, popup, interaction, alert
 * Type: Inline
 *
 * Structure:
 *   ChipAssist               chipAssist
 *     TextLabel              textLabel
 *     Icon                   icon
 *   Frame                    frame
 *     Frame                  frame2
 *       Frame                frame3
 *         ItemAvatarItem     itemAvatarItem
 *           AvatarRounded    avatarRounded
 *             Image          image
 *           Frame            frame4
 *             TextTitle      textTitle
 *             TextSubtitle   textSubtitle
 *           Button           button
 *             Icon           icon2
 *             TextLabel      textLabel2
 *       FormControlCombobox  formControlCombobox
 *         ComboboxField      comboboxField
 *           Icon             icon3
 *           Input            input
 *           ButtonIconic     buttonIconic
 *             Icon           icon4
 *
 * @example
 * ```vue
 * <PanelTokens
 *   role="dialog"
 *   aria-hidden="false"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import AvatarRounded from "../elements/AvatarRounded.vue"
import Button from "../elements/Button.vue"
import ChipAssist from "../elements/ChipAssist.vue"
import FormControlCombobox from "../elements/FormControlCombobox.vue"
import ItemAvatarItem from "../elements/ItemAvatarItem.vue"
import Frame from "../frames/Frame.vue"
import Icon from "../primitives/Icon.vue"
import TextLabel from "../primitives/TextLabel.vue"
import TextSubtitle from "../primitives/TextSubtitle.vue"
import TextTitle from "../primitives/TextTitle.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  chipAssist?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  frame?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
  itemAvatarItem?: Record<string, unknown> | null
  avatarRounded?: Record<string, unknown> | null
  image?: Record<string, unknown> | null
  frame4?: Record<string, unknown> | null
  textTitle?: Record<string, unknown> | null
  textSubtitle?: Record<string, unknown> | null
  button?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  formControlCombobox?: Record<string, unknown> | null
  comboboxField?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  input?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  role: "dialog",
  "aria-hidden": "false",
  chipAssist: {
    className: "sdn-chip sdn-chip-assist--1bvt",
  },
  textLabel: {
    children: "PropertyName",
    className: "sdn-text-label sdn-text-label--299x",
  },
  icon: {
    icon: "seldon-theme",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--ckag",
  },
  frame: {
    wrapperElement: "div",
    role: "dialog",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--lad1",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ocgw",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--6zsw",
  },
  itemAvatarItem: {
    className: "sdn-item sdn-item-avatar-item--w6ed",
  },
  avatarRounded: {
    "aria-hidden": "false",
    className: "sdn-avatar sdn-avatar-rounded--fb5j",
  },
  image: {
    src: "/avatar-user.png",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--98gd",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle: {
    children: "Full Name",
    className: "sdn-text-title sdn-text-title--noun",
  },
  textSubtitle: {
    children: "Position",
    className: "sdn-text-subtitle sdn-text-subtitle--r4ot",
  },
  button: {
    className: "sdn-button sdn-button--ogcw",
  },
  icon2: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--ptko",
  },
  textLabel2: {
    children: "Button",
    className: "sdn-text-label sdn-text-label--wotu",
  },
  formControlCombobox: {
    className: "sdn-form-control sdn-form-control-combobox--rmtv",
  },
  comboboxField: {
    "aria-hidden": "false",
    className: "sdn-combobox-field sdn-combobox-field--iuzk",
  },
  icon3: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gl7b",
  },
  input: {
    placeholder: "Placeholder text",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--t0am",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon4: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--0aip",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-panel-tokens", props.className))
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
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3, props.seldonRefs))
const itemAvatarItemProps = computed(() =>
  mergeOptionalSlot(sdn.itemAvatarItem, props.itemAvatarItem, props.seldonRefs),
)
const avatarRoundedProps = computed(() =>
  mergeSlot(sdn.avatarRounded, props.avatarRounded, props.seldonRefs),
)
const imageProps = computed(() => mergeSlot(sdn.image, props.image, props.seldonRefs))
const frame4Props = computed(() => mergeSlot(sdn.frame4, props.frame4, props.seldonRefs))
const textTitleProps = computed(() =>
  mergeOptionalSlot(sdn.textTitle, props.textTitle, props.seldonRefs),
)
const textSubtitleProps = computed(() =>
  mergeOptionalSlot(sdn.textSubtitle, props.textSubtitle, props.seldonRefs),
)
const buttonProps = computed(() => mergeSlot(sdn.button, props.button, props.seldonRefs))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2, props.seldonRefs))
const textLabel2Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs),
)
const formControlComboboxProps = computed(() =>
  mergeOptionalSlot(sdn.formControlCombobox, props.formControlCombobox, props.seldonRefs),
)
const comboboxFieldProps = computed(() =>
  mergeSlot(sdn.comboboxField, props.comboboxField, props.seldonRefs),
)
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3, props.seldonRefs))
const inputProps = computed(() => mergeSlot(sdn.input, props.input, props.seldonRefs))
const buttonIconicProps = computed(() =>
  mergeSlot(sdn.buttonIconic, props.buttonIconic, props.seldonRefs),
)
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4, props.seldonRefs))
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
          <Frame v-bind="frame3Props" v-if="frame3Props !== null">
            <ItemAvatarItem v-if="itemAvatarItemProps !== null" v-bind="itemAvatarItemProps">
              <AvatarRounded
                v-if="avatarRoundedProps !== null"
                v-bind="avatarRoundedProps"
                :image="imageProps"
              />
              <Frame v-bind="frame4Props" v-if="frame4Props !== null">
                <TextTitle v-if="textTitleProps !== null" v-bind="textTitleProps" />
                <TextSubtitle v-if="textSubtitleProps !== null" v-bind="textSubtitleProps" />
              </Frame>
              <Button v-if="buttonProps !== null" v-bind="buttonProps">
                <Icon v-if="icon2Props !== null" v-bind="icon2Props" />
                <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
              </Button>
            </ItemAvatarItem>
          </Frame>
          <FormControlCombobox
            v-if="formControlComboboxProps !== null"
            v-bind="formControlComboboxProps"
            :comboboxField="comboboxFieldProps"
            :icon="icon3Props"
            :input="inputProps"
            :buttonIconic="buttonIconicProps"
            :icon2="icon4Props"
            :textLabel="null"
          />
        </Frame>
      </Frame>
    </slot>
  </div>
</template>
