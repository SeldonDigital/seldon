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
 * Module: DialogExportComponent
 * Level: Module
 * Intent: 
 * Tags: 
 * Type: Inline
 *
 * Structure:
 *   Bar                    bar
 *     TextTitle            textTitle
 *   Frame                  frame
 *     FormControl          formControl
 *       TextLabel          textLabel
 *       Input              input              -> exportRootPath
 *     FormControl          formControl2
 *       TextLabel          textLabel2
 *       ComboboxField      comboboxField
 *         Input            input2             -> exportPlatform
 *         ButtonIconic     buttonIconic
 *           Icon           icon
 *     FormControlRadio     formControlRadio
 *       Frame              frame2
 *         TextLabel        textLabel3
 *         TextDescription  textDescription
 *       Frame              frame3
 *         MenuItemRadio    menuItemRadio      -> exportHiddenYes
 *           Icon           icon2
 *           TextLabel      textLabel4
 *         MenuItemRadio    menuItemRadio2     -> exportHiddenNo
 *           Icon           icon3
 *           TextLabel      textLabel5
 *     FormControlRadio     formControlRadio2
 *       Frame              frame4
 *         TextLabel        textLabel6
 *         TextDescription  textDescription2
 *       Frame              frame5
 *         MenuItemRadio    menuItemRadio3     -> exportAllThemesYes
 *           Icon           icon4
 *           TextLabel      textLabel7
 *         MenuItemRadio    menuItemRadio4     -> exportAllThemesNo
 *           Icon           icon5
 *           TextLabel      textLabel8
 *     FormControlRadio     formControlRadio3
 *       Frame              frame6
 *         TextLabel        textLabel9
 *         TextDescription  textDescription3
 *       Frame              frame7
 *         MenuItemRadio    menuItemRadio5     -> exportAllFontsYes
 *           Icon           icon6
 *           TextLabel      textLabel10
 *         MenuItemRadio    menuItemRadio6     -> exportAllFontsNo
 *           Icon           icon7
 *           TextLabel      textLabel11
 *     FormControlRadio     formControlRadio4
 *       Frame              frame8
 *         TextLabel        textLabel12
 *         TextDescription  textDescription4
 *       Frame              frame9
 *         MenuItemRadio    menuItemRadio7     -> exportFontLinksYes
 *           Icon           icon8
 *           TextLabel      textLabel13
 *         MenuItemRadio    menuItemRadio8     -> exportFontLinksNo
 *           Icon           icon9
 *           TextLabel      textLabel14
 *     FormControlRadio     formControlRadio5
 *       Frame              frame10
 *         TextLabel        textLabel15
 *         TextDescription  textDescription5
 *       Frame              frame11
 *         MenuItemRadio    menuItemRadio9     -> exportAllIconsYes
 *           Icon           icon10
 *           TextLabel      textLabel16
 *         MenuItemRadio    menuItemRadio10    -> exportAllIconsNo
 *           Icon           icon11
 *           TextLabel      textLabel17
 *   BarButtons             barButtons
 *     Button               button             -> exportCancel
 *       Icon               icon12
 *       TextLabel          textLabel18
 *     Button               button2            -> exportConfirm
 *       Icon               icon13
 *       TextLabel          textLabel19
 *
 * @example
 * ```vue
 * <DialogExportComponent
 *   aria-hidden="false"
 *   bar="{}"
 *   textTitle="Product Title"
 *   frame="{}"
 *   formControl="{}"
 *   textLabel="{}"
 *   input="{}"
 *   formControl2="{}"
 *   comboboxField="{}"
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   formControlRadio3="{}"
 *   textDescription2="{}"
 *   frame2="{}"
 *   menuItemRadio="{}"
 *   menuItemRadio2="{}"
 *   formControlRadio4="{}"
 *   formControlRadio5="{}"
 *   formControlRadio6="{}"
 *   formControlRadio7="{}"
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
import { combineClassNames, mergeSlot, mergeOptionalSlot } from "../utils/class-names"
import Frame from "../frames/Frame.vue"
import Bar from "../parts/Bar.vue"
import BarButtons from "../parts/BarButtons.vue"
import ComboboxField from "../elements/ComboboxField.vue"
import FormControl from "../elements/FormControl.vue"
import FormControlRadio from "../elements/FormControlRadio.vue"
import Icon from "../primitives/Icon.vue"
import Input from "../primitives/Input.vue"
import MenuItemRadio from "../elements/MenuItemRadio.vue"
import TextDescription from "../primitives/TextDescription.vue"
import TextLabel from "../primitives/TextLabel.vue"
import TextTitle from "../primitives/TextTitle.vue"

const props = defineProps<{
  className?: string
  bar?: Record<string, unknown> | null
  textTitle?: Record<string, unknown> | null
  frame?: Record<string, unknown> | null
  formControl?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  input?: Record<string, unknown> | null
  formControl2?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  comboboxField?: Record<string, unknown> | null
  input2?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  formControlRadio?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  textDescription?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
  menuItemRadio?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  textLabel4?: Record<string, unknown> | null
  menuItemRadio2?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  textLabel5?: Record<string, unknown> | null
  formControlRadio2?: Record<string, unknown> | null
  frame4?: Record<string, unknown> | null
  textLabel6?: Record<string, unknown> | null
  textDescription2?: Record<string, unknown> | null
  frame5?: Record<string, unknown> | null
  menuItemRadio3?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  textLabel7?: Record<string, unknown> | null
  menuItemRadio4?: Record<string, unknown> | null
  icon5?: Record<string, unknown> | null
  textLabel8?: Record<string, unknown> | null
  formControlRadio3?: Record<string, unknown> | null
  frame6?: Record<string, unknown> | null
  textLabel9?: Record<string, unknown> | null
  textDescription3?: Record<string, unknown> | null
  frame7?: Record<string, unknown> | null
  menuItemRadio5?: Record<string, unknown> | null
  icon6?: Record<string, unknown> | null
  textLabel10?: Record<string, unknown> | null
  menuItemRadio6?: Record<string, unknown> | null
  icon7?: Record<string, unknown> | null
  textLabel11?: Record<string, unknown> | null
  formControlRadio4?: Record<string, unknown> | null
  frame8?: Record<string, unknown> | null
  textLabel12?: Record<string, unknown> | null
  textDescription4?: Record<string, unknown> | null
  frame9?: Record<string, unknown> | null
  menuItemRadio7?: Record<string, unknown> | null
  icon8?: Record<string, unknown> | null
  textLabel13?: Record<string, unknown> | null
  menuItemRadio8?: Record<string, unknown> | null
  icon9?: Record<string, unknown> | null
  textLabel14?: Record<string, unknown> | null
  formControlRadio5?: Record<string, unknown> | null
  frame10?: Record<string, unknown> | null
  textLabel15?: Record<string, unknown> | null
  textDescription5?: Record<string, unknown> | null
  frame11?: Record<string, unknown> | null
  menuItemRadio9?: Record<string, unknown> | null
  icon10?: Record<string, unknown> | null
  textLabel16?: Record<string, unknown> | null
  menuItemRadio10?: Record<string, unknown> | null
  icon11?: Record<string, unknown> | null
  textLabel17?: Record<string, unknown> | null
  barButtons?: Record<string, unknown> | null
  button?: Record<string, unknown> | null
  icon12?: Record<string, unknown> | null
  textLabel18?: Record<string, unknown> | null
  button2?: Record<string, unknown> | null
  icon13?: Record<string, unknown> | null
  textLabel19?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "bar": {
    "aria-hidden": "false",
    "className": "sdn-bar sdn-bar--zhvk"
  },
  "textTitle": {
    "children": "Export Components",
    "htmlElement": "h4",
    "aria-hidden": "false",
    "className": "sdn-text-title sdn-text-title--eodu"
  },
  "frame": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--q7m7"
  },
  "formControl": {
    "aria-hidden": "false",
    "className": "sdn-form-control sdn-form-control--vmxp"
  },
  "textLabel": {
    "children": "Export to",
    "htmlElement": "label",
    "aria-hidden": "false",
    "className": "sdn-text-label sdn-text-label--l6fl"
  },
  "input": {
    "placeholder": "Placeholder text",
    "type": "text",
    "className": "sdn-input sdn-input--qirj",
    "data-seldon-ref": "exportRootPath"
  },
  "formControl2": {
    "aria-hidden": "false",
    "className": "sdn-form-control sdn-form-control--vmxp"
  },
  "textLabel2": {
    "children": "Platform",
    "htmlElement": "label",
    "aria-hidden": "false",
    "className": "sdn-text-label sdn-text-label--l6fl"
  },
  "comboboxField": {
    "aria-hidden": "false",
    "className": "sdn-combobox-field sdn-combobox-field--ull6"
  },
  "input2": {
    "placeholder": "Platform",
    "type": "text",
    "role": "combobox",
    "aria-haspopup": "listbox",
    "className": "sdn-input sdn-input--twyx",
    "data-seldon-ref": "exportPlatform"
  },
  "buttonIconic": {
    "className": "sdn-button-iconic sdn-button-iconic--pgsr"
  },
  "icon": {
    "icon": "material-chevronDown",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--vsau"
  },
  "formControlRadio": {
    "aria-hidden": "false",
    "className": "sdn-form-control sdn-form-control-radio--9dpd"
  },
  "frame2": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--ejha"
  },
  "textLabel3": {
    "children": "Include Hidden Components",
    "htmlElement": "label",
    "aria-hidden": "false",
    "className": "sdn-text-label sdn-text-label--s1qr"
  },
  "textDescription": {
    "children": "When enabled, components hidden with Exclude or Mock are also exported.",
    "htmlElement": "p",
    "aria-hidden": "false",
    "className": "sdn-text-description sdn-text-description--ljmd"
  },
  "frame3": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--pwes"
  },
  "menuItemRadio": {
    "role": "menuitemradio",
    "aria-hidden": "false",
    "className": "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportHiddenYes"
  },
  "icon2": {
    "icon": "material-radioButtonChecked",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel4": {
    "children": "Yes",
    "htmlElement": "label",
    "aria-hidden": "false",
    "className": "sdn-text-label sdn-text-label--xohb"
  },
  "menuItemRadio2": {
    "role": "menuitemradio",
    "aria-hidden": "false",
    "className": "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportHiddenNo"
  },
  "icon3": {
    "icon": "material-radioButtonChecked",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel5": {
    "children": "No",
    "htmlElement": "label",
    "aria-hidden": "false",
    "className": "sdn-text-label sdn-text-label--xohb"
  },
  "formControlRadio2": {
    "aria-hidden": "false",
    "className": "sdn-form-control sdn-form-control-radio--9dpd"
  },
  "frame4": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--ejha"
  },
  "textLabel6": {
    "children": "Include All Themes",
    "htmlElement": "label",
    "aria-hidden": "false",
    "className": "sdn-text-label sdn-text-label--s1qr"
  },
  "textDescription2": {
    "children": "Export all themes regardless if they are used in the workspace.",
    "htmlElement": "p",
    "aria-hidden": "false",
    "className": "sdn-text-description sdn-text-description--ljmd"
  },
  "frame5": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--pwes"
  },
  "menuItemRadio3": {
    "role": "menuitemradio",
    "aria-hidden": "false",
    "className": "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportAllThemesYes"
  },
  "icon4": {
    "icon": "material-radioButtonChecked",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel7": {
    "children": "Yes",
    "htmlElement": "label",
    "aria-hidden": "false",
    "className": "sdn-text-label sdn-text-label--xohb"
  },
  "menuItemRadio4": {
    "role": "menuitemradio",
    "aria-hidden": "false",
    "className": "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportAllThemesNo"
  },
  "icon5": {
    "icon": "material-radioButtonChecked",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel8": {
    "children": "No",
    "htmlElement": "label",
    "aria-hidden": "false",
    "className": "sdn-text-label sdn-text-label--xohb"
  },
  "formControlRadio3": {
    "aria-hidden": "false",
    "className": "sdn-form-control sdn-form-control-radio--9dpd"
  },
  "frame6": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--ejha"
  },
  "textLabel9": {
    "children": "Include All Fonts",
    "htmlElement": "label",
    "aria-hidden": "false",
    "className": "sdn-text-label sdn-text-label--s1qr"
  },
  "textDescription3": {
    "children": "Export all fonts regardless if they used in the workspace.",
    "htmlElement": "p",
    "aria-hidden": "false",
    "className": "sdn-text-description sdn-text-description--ljmd"
  },
  "frame7": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--pwes"
  },
  "menuItemRadio5": {
    "role": "menuitemradio",
    "aria-hidden": "false",
    "className": "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportAllFontsYes"
  },
  "icon6": {
    "icon": "material-radioButtonChecked",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel10": {
    "children": "Yes",
    "htmlElement": "label",
    "aria-hidden": "false",
    "className": "sdn-text-label sdn-text-label--xohb"
  },
  "menuItemRadio6": {
    "role": "menuitemradio",
    "aria-hidden": "false",
    "className": "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportAllFontsNo"
  },
  "icon7": {
    "icon": "material-radioButtonChecked",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel11": {
    "children": "No",
    "htmlElement": "label",
    "aria-hidden": "false",
    "className": "sdn-text-label sdn-text-label--xohb"
  },
  "formControlRadio4": {
    "aria-hidden": "false",
    "className": "sdn-form-control sdn-form-control-radio--9dpd"
  },
  "frame8": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--ejha"
  },
  "textLabel12": {
    "children": "Generate Font Links",
    "htmlElement": "label",
    "aria-hidden": "false",
    "className": "sdn-text-label sdn-text-label--s1qr"
  },
  "textDescription4": {
    "children": "When enabled, add Google Fonts links, which makes requests to Google. When set to off, keep export request free.",
    "htmlElement": "p",
    "aria-hidden": "false",
    "className": "sdn-text-description sdn-text-description--ljmd"
  },
  "frame9": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--pwes"
  },
  "menuItemRadio7": {
    "role": "menuitemradio",
    "aria-hidden": "false",
    "className": "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportFontLinksYes"
  },
  "icon8": {
    "icon": "material-radioButtonChecked",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel13": {
    "children": "Yes",
    "htmlElement": "label",
    "aria-hidden": "false",
    "className": "sdn-text-label sdn-text-label--xohb"
  },
  "menuItemRadio8": {
    "role": "menuitemradio",
    "aria-hidden": "false",
    "className": "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportFontLinksNo"
  },
  "icon9": {
    "icon": "material-radioButtonChecked",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel14": {
    "children": "No",
    "htmlElement": "label",
    "aria-hidden": "false",
    "className": "sdn-text-label sdn-text-label--xohb"
  },
  "formControlRadio5": {
    "aria-hidden": "false",
    "className": "sdn-form-control sdn-form-control-radio--9dpd"
  },
  "frame10": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--ejha"
  },
  "textLabel15": {
    "children": "Include All Icons",
    "htmlElement": "label",
    "aria-hidden": "false",
    "className": "sdn-text-label sdn-text-label--s1qr"
  },
  "textDescription5": {
    "children": "Export all icons regardless if they are used in the workspace.",
    "htmlElement": "p",
    "aria-hidden": "false",
    "className": "sdn-text-description sdn-text-description--ljmd"
  },
  "frame11": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--pwes"
  },
  "menuItemRadio9": {
    "role": "menuitemradio",
    "aria-hidden": "false",
    "className": "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportAllIconsYes"
  },
  "icon10": {
    "icon": "material-radioButtonChecked",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel16": {
    "children": "Yes",
    "htmlElement": "label",
    "aria-hidden": "false",
    "className": "sdn-text-label sdn-text-label--xohb"
  },
  "menuItemRadio10": {
    "role": "menuitemradio",
    "aria-hidden": "false",
    "className": "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportAllIconsNo"
  },
  "icon11": {
    "icon": "material-radioButtonChecked",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel17": {
    "children": "No",
    "htmlElement": "label",
    "aria-hidden": "false",
    "className": "sdn-text-label sdn-text-label--xohb"
  },
  "barButtons": {
    "aria-hidden": "false",
    "className": "sdn-bar-buttons sdn-bar-buttons--36qz"
  },
  "button": {
    "className": "sdn-button sdn-button--wjtm",
    "data-seldon-ref": "exportCancel"
  },
  "icon12": {
    "icon": "seldon-none",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--gh8m"
  },
  "textLabel18": {
    "children": "Cancel",
    "htmlElement": "label",
    "aria-hidden": "false",
    "className": "sdn-text-label sdn-text-label--wxqf"
  },
  "button2": {
    "className": "sdn-button sdn-button--upjl",
    "data-seldon-ref": "exportConfirm"
  },
  "icon13": {
    "icon": "material-save",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--gh8m"
  },
  "textLabel19": {
    "children": "Export",
    "htmlElement": "label",
    "aria-hidden": "false",
    "className": "sdn-text-label sdn-text-label--wxqf"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-dialog-export-component", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const barProps = computed(() => mergeSlot(sdn.bar, props.bar, props.seldonRefs))
const textTitleProps = computed(() => mergeOptionalSlot(sdn.textTitle, props.textTitle, props.seldonRefs))
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const formControlProps = computed(() => mergeOptionalSlot(sdn.formControl, props.formControl, props.seldonRefs))
const textLabelProps = computed(() => mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs))
const inputProps = computed(() => mergeSlot(sdn.input, props.input, props.seldonRefs))
const formControl2Props = computed(() => mergeOptionalSlot(sdn.formControl2, props.formControl2, props.seldonRefs))
const textLabel2Props = computed(() => mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs))
const comboboxFieldProps = computed(() => mergeOptionalSlot(sdn.comboboxField, props.comboboxField, props.seldonRefs))
const input2Props = computed(() => mergeSlot(sdn.input2, props.input2, props.seldonRefs))
const buttonIconicProps = computed(() => mergeSlot(sdn.buttonIconic, props.buttonIconic, props.seldonRefs))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const formControlRadioProps = computed(() => mergeOptionalSlot(sdn.formControlRadio, props.formControlRadio, props.seldonRefs))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const textLabel3Props = computed(() => mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs))
const textDescriptionProps = computed(() => mergeOptionalSlot(sdn.textDescription, props.textDescription, props.seldonRefs))
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3, props.seldonRefs))
const menuItemRadioProps = computed(() => mergeOptionalSlot(sdn.menuItemRadio, props.menuItemRadio, props.seldonRefs))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2, props.seldonRefs))
const textLabel4Props = computed(() => mergeOptionalSlot(sdn.textLabel4, props.textLabel4, props.seldonRefs))
const menuItemRadio2Props = computed(() => mergeOptionalSlot(sdn.menuItemRadio2, props.menuItemRadio2, props.seldonRefs))
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3, props.seldonRefs))
const textLabel5Props = computed(() => mergeOptionalSlot(sdn.textLabel5, props.textLabel5, props.seldonRefs))
const formControlRadio2Props = computed(() => mergeOptionalSlot(sdn.formControlRadio2, props.formControlRadio2, props.seldonRefs))
const frame4Props = computed(() => mergeSlot(sdn.frame4, props.frame4, props.seldonRefs))
const textLabel6Props = computed(() => mergeOptionalSlot(sdn.textLabel6, props.textLabel6, props.seldonRefs))
const textDescription2Props = computed(() => mergeOptionalSlot(sdn.textDescription2, props.textDescription2, props.seldonRefs))
const frame5Props = computed(() => mergeSlot(sdn.frame5, props.frame5, props.seldonRefs))
const menuItemRadio3Props = computed(() => mergeOptionalSlot(sdn.menuItemRadio3, props.menuItemRadio3, props.seldonRefs))
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4, props.seldonRefs))
const textLabel7Props = computed(() => mergeOptionalSlot(sdn.textLabel7, props.textLabel7, props.seldonRefs))
const menuItemRadio4Props = computed(() => mergeOptionalSlot(sdn.menuItemRadio4, props.menuItemRadio4, props.seldonRefs))
const icon5Props = computed(() => mergeSlot(sdn.icon5, props.icon5, props.seldonRefs))
const textLabel8Props = computed(() => mergeOptionalSlot(sdn.textLabel8, props.textLabel8, props.seldonRefs))
const formControlRadio3Props = computed(() => mergeOptionalSlot(sdn.formControlRadio3, props.formControlRadio3, props.seldonRefs))
const frame6Props = computed(() => mergeSlot(sdn.frame6, props.frame6, props.seldonRefs))
const textLabel9Props = computed(() => mergeOptionalSlot(sdn.textLabel9, props.textLabel9, props.seldonRefs))
const textDescription3Props = computed(() => mergeOptionalSlot(sdn.textDescription3, props.textDescription3, props.seldonRefs))
const frame7Props = computed(() => mergeSlot(sdn.frame7, props.frame7, props.seldonRefs))
const menuItemRadio5Props = computed(() => mergeOptionalSlot(sdn.menuItemRadio5, props.menuItemRadio5, props.seldonRefs))
const icon6Props = computed(() => mergeSlot(sdn.icon6, props.icon6, props.seldonRefs))
const textLabel10Props = computed(() => mergeOptionalSlot(sdn.textLabel10, props.textLabel10, props.seldonRefs))
const menuItemRadio6Props = computed(() => mergeOptionalSlot(sdn.menuItemRadio6, props.menuItemRadio6, props.seldonRefs))
const icon7Props = computed(() => mergeSlot(sdn.icon7, props.icon7, props.seldonRefs))
const textLabel11Props = computed(() => mergeOptionalSlot(sdn.textLabel11, props.textLabel11, props.seldonRefs))
const formControlRadio4Props = computed(() => mergeOptionalSlot(sdn.formControlRadio4, props.formControlRadio4, props.seldonRefs))
const frame8Props = computed(() => mergeSlot(sdn.frame8, props.frame8, props.seldonRefs))
const textLabel12Props = computed(() => mergeOptionalSlot(sdn.textLabel12, props.textLabel12, props.seldonRefs))
const textDescription4Props = computed(() => mergeOptionalSlot(sdn.textDescription4, props.textDescription4, props.seldonRefs))
const frame9Props = computed(() => mergeSlot(sdn.frame9, props.frame9, props.seldonRefs))
const menuItemRadio7Props = computed(() => mergeOptionalSlot(sdn.menuItemRadio7, props.menuItemRadio7, props.seldonRefs))
const icon8Props = computed(() => mergeSlot(sdn.icon8, props.icon8, props.seldonRefs))
const textLabel13Props = computed(() => mergeOptionalSlot(sdn.textLabel13, props.textLabel13, props.seldonRefs))
const menuItemRadio8Props = computed(() => mergeOptionalSlot(sdn.menuItemRadio8, props.menuItemRadio8, props.seldonRefs))
const icon9Props = computed(() => mergeSlot(sdn.icon9, props.icon9, props.seldonRefs))
const textLabel14Props = computed(() => mergeOptionalSlot(sdn.textLabel14, props.textLabel14, props.seldonRefs))
const formControlRadio5Props = computed(() => mergeOptionalSlot(sdn.formControlRadio5, props.formControlRadio5, props.seldonRefs))
const frame10Props = computed(() => mergeSlot(sdn.frame10, props.frame10, props.seldonRefs))
const textLabel15Props = computed(() => mergeOptionalSlot(sdn.textLabel15, props.textLabel15, props.seldonRefs))
const textDescription5Props = computed(() => mergeOptionalSlot(sdn.textDescription5, props.textDescription5, props.seldonRefs))
const frame11Props = computed(() => mergeSlot(sdn.frame11, props.frame11, props.seldonRefs))
const menuItemRadio9Props = computed(() => mergeOptionalSlot(sdn.menuItemRadio9, props.menuItemRadio9, props.seldonRefs))
const icon10Props = computed(() => mergeSlot(sdn.icon10, props.icon10, props.seldonRefs))
const textLabel16Props = computed(() => mergeOptionalSlot(sdn.textLabel16, props.textLabel16, props.seldonRefs))
const menuItemRadio10Props = computed(() => mergeOptionalSlot(sdn.menuItemRadio10, props.menuItemRadio10, props.seldonRefs))
const icon11Props = computed(() => mergeSlot(sdn.icon11, props.icon11, props.seldonRefs))
const textLabel17Props = computed(() => mergeOptionalSlot(sdn.textLabel17, props.textLabel17, props.seldonRefs))
const barButtonsProps = computed(() => mergeSlot(sdn.barButtons, props.barButtons, props.seldonRefs))
const buttonProps = computed(() => mergeSlot(sdn.button, props.button, props.seldonRefs))
const icon12Props = computed(() => mergeSlot(sdn.icon12, props.icon12, props.seldonRefs))
const textLabel18Props = computed(() => mergeOptionalSlot(sdn.textLabel18, props.textLabel18, props.seldonRefs))
const button2Props = computed(() => mergeSlot(sdn.button2, props.button2, props.seldonRefs))
const icon13Props = computed(() => mergeSlot(sdn.icon13, props.icon13, props.seldonRefs))
const textLabel19Props = computed(() => mergeOptionalSlot(sdn.textLabel19, props.textLabel19, props.seldonRefs))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Bar v-if="barProps !== null" v-bind="barProps">
          <TextTitle v-if="textTitleProps !== null" v-bind="textTitleProps" />
        </Bar>
        <Frame v-bind="frameProps">
          <FormControl v-if="formControlProps !== null" v-bind="formControlProps">
            <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
            <Input v-if="inputProps !== null" v-bind="inputProps" />
          </FormControl>
          <FormControl v-if="formControl2Props !== null" v-bind="formControl2Props">
            <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
            <ComboboxField v-if="comboboxFieldProps !== null" v-bind="comboboxFieldProps" :input="input2Props" :buttonIconic="buttonIconicProps" :icon2="iconProps" :icon="null" />
          </FormControl>
          <FormControlRadio v-if="formControlRadioProps !== null" v-bind="formControlRadioProps">
            <Frame v-bind="frame2Props" v-if="frame2Props !== null">
              <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
              <TextDescription v-if="textDescriptionProps !== null" v-bind="textDescriptionProps" />
            </Frame>
            <Frame v-bind="frame3Props" v-if="frame3Props !== null">
              <MenuItemRadio v-if="menuItemRadioProps !== null" v-bind="menuItemRadioProps">
                <Icon v-if="icon2Props !== null" v-bind="icon2Props" />
                <TextLabel v-if="textLabel4Props !== null" v-bind="textLabel4Props" />
              </MenuItemRadio>
              <MenuItemRadio v-if="menuItemRadio2Props !== null" v-bind="menuItemRadio2Props">
                <Icon v-if="icon3Props !== null" v-bind="icon3Props" />
                <TextLabel v-if="textLabel5Props !== null" v-bind="textLabel5Props" />
              </MenuItemRadio>
            </Frame>
          </FormControlRadio>
          <FormControlRadio v-if="formControlRadio2Props !== null" v-bind="formControlRadio2Props">
            <Frame v-bind="frame4Props" v-if="frame4Props !== null">
              <TextLabel v-if="textLabel6Props !== null" v-bind="textLabel6Props" />
              <TextDescription v-if="textDescription2Props !== null" v-bind="textDescription2Props" />
            </Frame>
            <Frame v-bind="frame5Props" v-if="frame5Props !== null">
              <MenuItemRadio v-if="menuItemRadio3Props !== null" v-bind="menuItemRadio3Props">
                <Icon v-if="icon4Props !== null" v-bind="icon4Props" />
                <TextLabel v-if="textLabel7Props !== null" v-bind="textLabel7Props" />
              </MenuItemRadio>
              <MenuItemRadio v-if="menuItemRadio4Props !== null" v-bind="menuItemRadio4Props">
                <Icon v-if="icon5Props !== null" v-bind="icon5Props" />
                <TextLabel v-if="textLabel8Props !== null" v-bind="textLabel8Props" />
              </MenuItemRadio>
            </Frame>
          </FormControlRadio>
          <FormControlRadio v-if="formControlRadio3Props !== null" v-bind="formControlRadio3Props">
            <Frame v-bind="frame6Props" v-if="frame6Props !== null">
              <TextLabel v-if="textLabel9Props !== null" v-bind="textLabel9Props" />
              <TextDescription v-if="textDescription3Props !== null" v-bind="textDescription3Props" />
            </Frame>
            <Frame v-bind="frame7Props" v-if="frame7Props !== null">
              <MenuItemRadio v-if="menuItemRadio5Props !== null" v-bind="menuItemRadio5Props">
                <Icon v-if="icon6Props !== null" v-bind="icon6Props" />
                <TextLabel v-if="textLabel10Props !== null" v-bind="textLabel10Props" />
              </MenuItemRadio>
              <MenuItemRadio v-if="menuItemRadio6Props !== null" v-bind="menuItemRadio6Props">
                <Icon v-if="icon7Props !== null" v-bind="icon7Props" />
                <TextLabel v-if="textLabel11Props !== null" v-bind="textLabel11Props" />
              </MenuItemRadio>
            </Frame>
          </FormControlRadio>
          <FormControlRadio v-if="formControlRadio4Props !== null" v-bind="formControlRadio4Props">
            <Frame v-bind="frame8Props" v-if="frame8Props !== null">
              <TextLabel v-if="textLabel12Props !== null" v-bind="textLabel12Props" />
              <TextDescription v-if="textDescription4Props !== null" v-bind="textDescription4Props" />
            </Frame>
            <Frame v-bind="frame9Props" v-if="frame9Props !== null">
              <MenuItemRadio v-if="menuItemRadio7Props !== null" v-bind="menuItemRadio7Props">
                <Icon v-if="icon8Props !== null" v-bind="icon8Props" />
                <TextLabel v-if="textLabel13Props !== null" v-bind="textLabel13Props" />
              </MenuItemRadio>
              <MenuItemRadio v-if="menuItemRadio8Props !== null" v-bind="menuItemRadio8Props">
                <Icon v-if="icon9Props !== null" v-bind="icon9Props" />
                <TextLabel v-if="textLabel14Props !== null" v-bind="textLabel14Props" />
              </MenuItemRadio>
            </Frame>
          </FormControlRadio>
          <FormControlRadio v-if="formControlRadio5Props !== null" v-bind="formControlRadio5Props">
            <Frame v-bind="frame10Props" v-if="frame10Props !== null">
              <TextLabel v-if="textLabel15Props !== null" v-bind="textLabel15Props" />
              <TextDescription v-if="textDescription5Props !== null" v-bind="textDescription5Props" />
            </Frame>
            <Frame v-bind="frame11Props" v-if="frame11Props !== null">
              <MenuItemRadio v-if="menuItemRadio9Props !== null" v-bind="menuItemRadio9Props">
                <Icon v-if="icon10Props !== null" v-bind="icon10Props" />
                <TextLabel v-if="textLabel16Props !== null" v-bind="textLabel16Props" />
              </MenuItemRadio>
              <MenuItemRadio v-if="menuItemRadio10Props !== null" v-bind="menuItemRadio10Props">
                <Icon v-if="icon11Props !== null" v-bind="icon11Props" />
                <TextLabel v-if="textLabel17Props !== null" v-bind="textLabel17Props" />
              </MenuItemRadio>
            </Frame>
          </FormControlRadio>
        </Frame>
        <BarButtons v-if="barButtonsProps !== null" v-bind="barButtonsProps" :button4="buttonProps" :icon4="icon12Props" :textLabel4="textLabel18Props" :button5="button2Props" :icon5="icon13Props" :textLabel5="textLabel19Props" />
      </slot>
    </div>
</template>
