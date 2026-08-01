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
 * Module: DialogCreateComponent
 * Level: Module
 * Intent:
 * Tags:
 * Type: Inline
 *
 * Structure:
 *   Bar                    bar
 *     TextTitle            textTitle
 *   Frame                  frame
 *     ItemCatalog          itemCatalog          -> createComponentFrame
 *       Icon               icon
 *       Frame              frame2
 *         TextTitle        textTitle2
 *         TextSubtitle     textSubtitle
 *     ItemCatalog          itemCatalog2         -> createComponentContainer
 *       Icon               icon2
 *       Frame              frame3
 *         TextTitle        textTitle3
 *         TextSubtitle     textSubtitle2
 *   Frame                  frame4
 *     FormControl          formControl
 *       TextLabel          textLabel
 *       Input              input                -> createComponentName
 *     FormControlCombobox  formControlCombobox
 *       TextLabel          textLabel2
 *       ComboboxField      comboboxField        -> createComponentLevel
 *         Input            input2
 *         ButtonIconic     buttonIconic
 *           Icon           icon3
 *     FormControl          formControl2
 *       TextLabel          textLabel3
 *       Input              input3               -> createComponentIntent
 *     FormControl          formControl3
 *       TextLabel          textLabel4
 *       Input              input4               -> createComponentTags
 *   BarButtons             barButtons
 *     Button               button
 *       Icon               icon4
 *       TextLabel          textLabel5
 *     Button               button2
 *       Icon               icon5
 *       TextLabel          textLabel6
 *
 * @example
 * ```vue
 * <DialogCreateComponent
 *   aria-hidden="false"
 *   bar="{}"
 *   textTitle="Product Title"
 *   frame="{}"
 *   itemCatalog="{}"
 *   icon="material-star"
 *   textSubtitle2="Product Title"
 *   itemCatalog2="{}"
 *   frame2="{}"
 *   formControl="{}"
 *   textLabel="{}"
 *   input="{}"
 *   formControlCombobox2="{}"
 *   comboboxField="{}"
 *   buttonIconic={() => {}}
 *   formControl3="{}"
 *   formControl4="{}"
 *   barButtons2="{}"
 *   button={() => {}}
 *   button2={() => {}}
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import ComboboxField from "../elements/ComboboxField.vue"
import FormControl from "../elements/FormControl.vue"
import FormControlCombobox from "../elements/FormControlCombobox.vue"
import ItemCatalog from "../elements/ItemCatalog.vue"
import Frame from "../frames/Frame.vue"
import Bar from "../parts/Bar.vue"
import BarButtons from "../parts/BarButtons.vue"
import Icon from "../primitives/Icon.vue"
import Input from "../primitives/Input.vue"
import TextLabel from "../primitives/TextLabel.vue"
import TextSubtitle from "../primitives/TextSubtitle.vue"
import TextTitle from "../primitives/TextTitle.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  bar?: Record<string, unknown> | null
  textTitle?: Record<string, unknown> | null
  frame?: Record<string, unknown> | null
  itemCatalog?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  textTitle2?: Record<string, unknown> | null
  textSubtitle?: Record<string, unknown> | null
  itemCatalog2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
  textTitle3?: Record<string, unknown> | null
  textSubtitle2?: Record<string, unknown> | null
  frame4?: Record<string, unknown> | null
  formControl?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  input?: Record<string, unknown> | null
  formControlCombobox?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  comboboxField?: Record<string, unknown> | null
  input2?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  formControl2?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  input3?: Record<string, unknown> | null
  formControl3?: Record<string, unknown> | null
  textLabel4?: Record<string, unknown> | null
  input4?: Record<string, unknown> | null
  barButtons?: Record<string, unknown> | null
  button?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  textLabel5?: Record<string, unknown> | null
  button2?: Record<string, unknown> | null
  icon5?: Record<string, unknown> | null
  textLabel6?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  bar: {
    "aria-hidden": "false",
    className: "sdn-bar sdn-bar--yje0",
  },
  textTitle: {
    children: "Create Component",
    htmlElement: "h4",
    "aria-hidden": "false",
    className: "sdn-text-title sdn-text-title--eodu",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--q4nj",
  },
  itemCatalog: {
    "aria-hidden": "false",
    className: "sdn-item-catalog sdn-item-catalog--xhyo",
    "data-seldon-ref": "createComponentFrame",
  },
  icon: {
    icon: "seldon-frame",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--mene",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle2: {
    children: "Frame",
    htmlElement: "h4",
    "aria-hidden": "false",
    className: "sdn-text-title sdn-text-title--noun",
  },
  textSubtitle: {
    children: "Used for flexible layouts and general purpose content needs",
    htmlElement: "h5",
    "aria-hidden": "false",
    className: "sdn-text-subtitle sdn-text-subtitle--r4ot",
  },
  itemCatalog2: {
    "aria-hidden": "false",
    className: "sdn-item-catalog sdn-item-catalog--xhyo",
    "data-seldon-ref": "createComponentContainer",
  },
  icon2: {
    icon: "material-gridOn",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--mene",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle3: {
    children: "Container",
    htmlElement: "h4",
    "aria-hidden": "false",
    className: "sdn-text-title sdn-text-title--noun",
  },
  textSubtitle2: {
    children: "Use for table and grid based layouts, like a calendar or pricing table",
    htmlElement: "h5",
    "aria-hidden": "false",
    className: "sdn-text-subtitle sdn-text-subtitle--r4ot",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--q7m7",
  },
  formControl: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--9hir",
  },
  textLabel: {
    children: "Name",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--fwkw",
  },
  input: {
    placeholder: "Component names must be unique",
    type: "text",
    className: "sdn-input sdn-input--qirj",
    "data-seldon-ref": "createComponentName",
  },
  formControlCombobox: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--9hir",
  },
  textLabel2: {
    children: "Level",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--fwkw",
  },
  comboboxField: {
    "aria-hidden": "false",
    className: "sdn-combobox-field sdn-combobox-field--hdym",
    "data-seldon-ref": "createComponentLevel",
  },
  input2: {
    placeholder: "Placeholder text",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--9vqu",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon3: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  formControl2: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--9hir",
  },
  textLabel3: {
    children: "Intent",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--fwkw",
  },
  input3: {
    placeholder: "The purpose for this component",
    type: "text",
    className: "sdn-input sdn-input--qirj",
    "data-seldon-ref": "createComponentIntent",
  },
  formControl3: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--9hir",
  },
  textLabel4: {
    children: "Tags",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--fwkw",
  },
  input4: {
    placeholder: "Comma separated",
    type: "text",
    className: "sdn-input sdn-input--qirj",
    "data-seldon-ref": "createComponentTags",
  },
  barButtons: {
    "aria-hidden": "false",
    className: "sdn-bar-buttons sdn-bar-buttons--36qz",
  },
  button: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon4: {
    icon: "seldon-none",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel5: {
    children: "Cancel",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button2: {
    className: "sdn-button sdn-button--upjl",
  },
  icon5: {
    icon: "material-check",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel6: {
    children: "OK",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
}

const rootClassName = computed(() =>
  combineClassNames("sdn-dialog-create-component", props.className),
)
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const barProps = computed(() => mergeSlot(sdn.bar, props.bar, props.seldonRefs))
const textTitleProps = computed(() =>
  mergeOptionalSlot(sdn.textTitle, props.textTitle, props.seldonRefs),
)
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const itemCatalogProps = computed(() =>
  mergeOptionalSlot(sdn.itemCatalog, props.itemCatalog, props.seldonRefs),
)
const iconProps = computed(() => mergeOptionalSlot(sdn.icon, props.icon, props.seldonRefs))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const textTitle2Props = computed(() =>
  mergeOptionalSlot(sdn.textTitle2, props.textTitle2, props.seldonRefs),
)
const textSubtitleProps = computed(() =>
  mergeOptionalSlot(sdn.textSubtitle, props.textSubtitle, props.seldonRefs),
)
const itemCatalog2Props = computed(() =>
  mergeOptionalSlot(sdn.itemCatalog2, props.itemCatalog2, props.seldonRefs),
)
const icon2Props = computed(() => mergeOptionalSlot(sdn.icon2, props.icon2, props.seldonRefs))
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3, props.seldonRefs))
const textTitle3Props = computed(() =>
  mergeOptionalSlot(sdn.textTitle3, props.textTitle3, props.seldonRefs),
)
const textSubtitle2Props = computed(() =>
  mergeOptionalSlot(sdn.textSubtitle2, props.textSubtitle2, props.seldonRefs),
)
const frame4Props = computed(() => mergeSlot(sdn.frame4, props.frame4, props.seldonRefs))
const formControlProps = computed(() =>
  mergeOptionalSlot(sdn.formControl, props.formControl, props.seldonRefs),
)
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const inputProps = computed(() => mergeSlot(sdn.input, props.input, props.seldonRefs))
const formControlComboboxProps = computed(() =>
  mergeOptionalSlot(sdn.formControlCombobox, props.formControlCombobox, props.seldonRefs),
)
const textLabel2Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs),
)
const comboboxFieldProps = computed(() =>
  mergeSlot(sdn.comboboxField, props.comboboxField, props.seldonRefs),
)
const input2Props = computed(() => mergeSlot(sdn.input2, props.input2, props.seldonRefs))
const buttonIconicProps = computed(() =>
  mergeSlot(sdn.buttonIconic, props.buttonIconic, props.seldonRefs),
)
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3, props.seldonRefs))
const formControl2Props = computed(() =>
  mergeOptionalSlot(sdn.formControl2, props.formControl2, props.seldonRefs),
)
const textLabel3Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs),
)
const input3Props = computed(() => mergeSlot(sdn.input3, props.input3, props.seldonRefs))
const formControl3Props = computed(() =>
  mergeOptionalSlot(sdn.formControl3, props.formControl3, props.seldonRefs),
)
const textLabel4Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel4, props.textLabel4, props.seldonRefs),
)
const input4Props = computed(() => mergeSlot(sdn.input4, props.input4, props.seldonRefs))
const barButtonsProps = computed(() =>
  mergeSlot(sdn.barButtons, props.barButtons, props.seldonRefs),
)
const buttonProps = computed(() => mergeSlot(sdn.button, props.button, props.seldonRefs))
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4, props.seldonRefs))
const textLabel5Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel5, props.textLabel5, props.seldonRefs),
)
const button2Props = computed(() => mergeSlot(sdn.button2, props.button2, props.seldonRefs))
const icon5Props = computed(() => mergeSlot(sdn.icon5, props.icon5, props.seldonRefs))
const textLabel6Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel6, props.textLabel6, props.seldonRefs),
)
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Bar v-if="barProps !== null" v-bind="barProps">
        <TextTitle v-if="textTitleProps !== null" v-bind="textTitleProps" />
      </Bar>
      <Frame v-bind="frameProps">
        <ItemCatalog v-if="itemCatalogProps !== null" v-bind="itemCatalogProps">
          <Icon v-if="iconProps !== null" v-bind="iconProps" />
          <Frame v-bind="frame2Props" v-if="frame2Props !== null">
            <TextTitle v-if="textTitle2Props !== null" v-bind="textTitle2Props" />
            <TextSubtitle v-if="textSubtitleProps !== null" v-bind="textSubtitleProps" />
          </Frame>
        </ItemCatalog>
        <ItemCatalog v-if="itemCatalog2Props !== null" v-bind="itemCatalog2Props">
          <Icon v-if="icon2Props !== null" v-bind="icon2Props" />
          <Frame v-bind="frame3Props" v-if="frame3Props !== null">
            <TextTitle v-if="textTitle3Props !== null" v-bind="textTitle3Props" />
            <TextSubtitle v-if="textSubtitle2Props !== null" v-bind="textSubtitle2Props" />
          </Frame>
        </ItemCatalog>
      </Frame>
      <Frame v-bind="frame4Props">
        <FormControl v-if="formControlProps !== null" v-bind="formControlProps">
          <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
          <Input v-if="inputProps !== null" v-bind="inputProps" />
        </FormControl>
        <FormControlCombobox
          v-if="formControlComboboxProps !== null"
          v-bind="formControlComboboxProps"
        >
          <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
          <ComboboxField
            v-if="comboboxFieldProps !== null"
            v-bind="comboboxFieldProps"
            :input="input2Props"
            :buttonIconic="buttonIconicProps"
            :icon2="icon3Props"
            :icon="null"
          />
        </FormControlCombobox>
        <FormControl v-if="formControl2Props !== null" v-bind="formControl2Props">
          <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
          <Input v-if="input3Props !== null" v-bind="input3Props" />
        </FormControl>
        <FormControl v-if="formControl3Props !== null" v-bind="formControl3Props">
          <TextLabel v-if="textLabel4Props !== null" v-bind="textLabel4Props" />
          <Input v-if="input4Props !== null" v-bind="input4Props" />
        </FormControl>
      </Frame>
      <BarButtons
        v-if="barButtonsProps !== null"
        v-bind="barButtonsProps"
        :button4="buttonProps"
        :icon4="icon4Props"
        :textLabel4="textLabel5Props"
        :button5="button2Props"
        :icon5="icon5Props"
        :textLabel5="textLabel6Props"
      />
    </slot>
  </div>
</template>
