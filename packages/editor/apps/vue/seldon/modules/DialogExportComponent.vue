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
 *       Input              input              -> exportWorkspaceName
 *     FormControl          formControl2
 *       TextLabel          textLabel2
 *       Input              input2             -> exportRootPath
 *     FormControl          formControl3
 *       TextLabel          textLabel3
 *       ComboboxField      comboboxField
 *         Input            input3             -> exportPlatform
 *         ButtonIconic     buttonIconic
 *           Icon           icon
 *     FormControlRadio     formControlRadio
 *       TextLabel          textLabel4
 *       Frame              frame2
 *         MenuItemRadio    menuItemRadio      -> exportFontLinksYes
 *           Icon           icon2              -> exportFontLinksYesIcon
 *           TextLabel      textLabel5
 *         MenuItemRadio    menuItemRadio2     -> exportFontLinksNo
 *           Icon           icon3              -> exportFontLinksNoIcon
 *           TextLabel      textLabel6
 *     Fieldset             fieldset
 *       Legend             legend
 *       FormControlRadio   formControlRadio2
 *         TextLabel        textLabel7
 *         Frame            frame3
 *           MenuItemRadio  menuItemRadio3     -> exportHiddenYes
 *             Icon         icon4              -> exportHiddenYesIcon
 *             TextLabel    textLabel8
 *           MenuItemRadio  menuItemRadio4     -> exportHiddenNo
 *             Icon         icon5              -> exportHiddenNoIcon
 *             TextLabel    textLabel9
 *       FormControlRadio   formControlRadio3
 *         TextLabel        textLabel10
 *         Frame            frame4
 *           MenuItemRadio  menuItemRadio5     -> exportAllThemesYes
 *             Icon         icon6              -> exportAllThemesYesIcon
 *             TextLabel    textLabel11
 *           MenuItemRadio  menuItemRadio6     -> exportAllThemesNo
 *             Icon         icon7              -> exportAllThemesNoIcon
 *             TextLabel    textLabel12
 *       FormControlRadio   formControlRadio4
 *         TextLabel        textLabel13
 *         Frame            frame5
 *           MenuItemRadio  menuItemRadio7     -> exportAllFontsYes
 *             Icon         icon8              -> exportAllFontsYesIcon
 *             TextLabel    textLabel14
 *           MenuItemRadio  menuItemRadio8     -> exportAllFontsNo
 *             Icon         icon9              -> exportAllFontsNoIcon
 *             TextLabel    textLabel15
 *       FormControlRadio   formControlRadio5
 *         TextLabel        textLabel16
 *         Frame            frame6
 *           MenuItemRadio  menuItemRadio9     -> exportAllIconsYes
 *             Icon         icon10             -> exportAllIconsYesIcon
 *             TextLabel    textLabel17
 *           MenuItemRadio  menuItemRadio10    -> exportAllIconsNo
 *             Icon         icon11             -> exportAllIconsNoIcon
 *             TextLabel    textLabel18
 *       FormControlRadio   formControlRadio6
 *         TextLabel        textLabel19
 *         Frame            frame7
 *           MenuItemRadio  menuItemRadio11    -> exportSavedWorkspaceYes
 *             Icon         icon12             -> exportSavedWorkspaceYesIcon
 *             TextLabel    textLabel20
 *           MenuItemRadio  menuItemRadio12    -> exportSavedWorkspaceNo
 *             Icon         icon13             -> exportSavedWorkspaceNoIcon
 *             TextLabel    textLabel21
 *       FormControlRadio   formControlRadio7
 *         TextLabel        textLabel22
 *         Frame            frame8
 *           MenuItemRadio  menuItemRadio13    -> exportScriptsYes
 *             Icon         icon14             -> exportScriptsYesIcon
 *             TextLabel    textLabel23
 *           MenuItemRadio  menuItemRadio14    -> exportScriptsNo
 *             Icon         icon15             -> exportScriptsNoIcon
 *             TextLabel    textLabel24
 *   BarButtons             barButtons
 *     Button               button             -> exportCancel
 *       Icon               icon16
 *       TextLabel          textLabel25
 *     Button               button2            -> exportConfirm
 *       Icon               icon17
 *       TextLabel          textLabel26
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
 *   formControl3="{}"
 *   comboboxField="{}"
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   formControlRadio4="{}"
 *   menuItemRadio="{}"
 *   menuItemRadio2="{}"
 *   fieldset="{}"
 *   legend="{}"
 *   formControlRadio="{}"
 *   formControlRadio2="{}"
 *   formControlRadio3="{}"
 *   formControlRadio5="{}"
 *   formControlRadio6="{}"
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
import FormControlRadio from "../elements/FormControlRadio.vue"
import MenuItemRadio from "../elements/MenuItemRadio.vue"
import Frame from "../frames/Frame.vue"
import Bar from "../parts/Bar.vue"
import BarButtons from "../parts/BarButtons.vue"
import Fieldset from "../parts/Fieldset.vue"
import Icon from "../primitives/Icon.vue"
import Input from "../primitives/Input.vue"
import Legend from "../primitives/Legend.vue"
import TextLabel from "../primitives/TextLabel.vue"
import TextTitle from "../primitives/TextTitle.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

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
  input2?: Record<string, unknown> | null
  formControl3?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  comboboxField?: Record<string, unknown> | null
  input3?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  formControlRadio?: Record<string, unknown> | null
  textLabel4?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  menuItemRadio?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  textLabel5?: Record<string, unknown> | null
  menuItemRadio2?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  textLabel6?: Record<string, unknown> | null
  fieldset?: Record<string, unknown> | null
  legend?: Record<string, unknown> | null
  formControlRadio2?: Record<string, unknown> | null
  textLabel7?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
  menuItemRadio3?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  textLabel8?: Record<string, unknown> | null
  menuItemRadio4?: Record<string, unknown> | null
  icon5?: Record<string, unknown> | null
  textLabel9?: Record<string, unknown> | null
  formControlRadio3?: Record<string, unknown> | null
  textLabel10?: Record<string, unknown> | null
  frame4?: Record<string, unknown> | null
  menuItemRadio5?: Record<string, unknown> | null
  icon6?: Record<string, unknown> | null
  textLabel11?: Record<string, unknown> | null
  menuItemRadio6?: Record<string, unknown> | null
  icon7?: Record<string, unknown> | null
  textLabel12?: Record<string, unknown> | null
  formControlRadio4?: Record<string, unknown> | null
  textLabel13?: Record<string, unknown> | null
  frame5?: Record<string, unknown> | null
  menuItemRadio7?: Record<string, unknown> | null
  icon8?: Record<string, unknown> | null
  textLabel14?: Record<string, unknown> | null
  menuItemRadio8?: Record<string, unknown> | null
  icon9?: Record<string, unknown> | null
  textLabel15?: Record<string, unknown> | null
  formControlRadio5?: Record<string, unknown> | null
  textLabel16?: Record<string, unknown> | null
  frame6?: Record<string, unknown> | null
  menuItemRadio9?: Record<string, unknown> | null
  icon10?: Record<string, unknown> | null
  textLabel17?: Record<string, unknown> | null
  menuItemRadio10?: Record<string, unknown> | null
  icon11?: Record<string, unknown> | null
  textLabel18?: Record<string, unknown> | null
  formControlRadio6?: Record<string, unknown> | null
  textLabel19?: Record<string, unknown> | null
  frame7?: Record<string, unknown> | null
  menuItemRadio11?: Record<string, unknown> | null
  icon12?: Record<string, unknown> | null
  textLabel20?: Record<string, unknown> | null
  menuItemRadio12?: Record<string, unknown> | null
  icon13?: Record<string, unknown> | null
  textLabel21?: Record<string, unknown> | null
  formControlRadio7?: Record<string, unknown> | null
  textLabel22?: Record<string, unknown> | null
  frame8?: Record<string, unknown> | null
  menuItemRadio13?: Record<string, unknown> | null
  icon14?: Record<string, unknown> | null
  textLabel23?: Record<string, unknown> | null
  menuItemRadio14?: Record<string, unknown> | null
  icon15?: Record<string, unknown> | null
  textLabel24?: Record<string, unknown> | null
  barButtons?: Record<string, unknown> | null
  button?: Record<string, unknown> | null
  icon16?: Record<string, unknown> | null
  textLabel25?: Record<string, unknown> | null
  button2?: Record<string, unknown> | null
  icon17?: Record<string, unknown> | null
  textLabel26?: Record<string, unknown> | null
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
    children: "Export Components",
    htmlElement: "h4",
    "aria-hidden": "false",
    className: "sdn-text-title sdn-text-title--eodu",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--q7m7",
  },
  formControl: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--vmxp",
  },
  textLabel: {
    children: "Workspace Name",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--l6fl",
  },
  input: {
    placeholder: "Placeholder text",
    type: "text",
    className: "sdn-input sdn-input--j1ro",
    "data-seldon-ref": "exportWorkspaceName",
  },
  formControl2: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--vmxp",
  },
  textLabel2: {
    children: "Export Folder",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--l6fl",
  },
  input2: {
    placeholder: "Placeholder text",
    type: "text",
    className: "sdn-input sdn-input--j1ro",
    "data-seldon-ref": "exportRootPath",
  },
  formControl3: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--vmxp",
  },
  textLabel3: {
    children: "Platform",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--l6fl",
  },
  comboboxField: {
    "aria-hidden": "false",
    className: "sdn-combobox-field sdn-combobox-field--zfi3",
  },
  input3: {
    placeholder: "Placeholder",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--pzcf",
    "data-seldon-ref": "exportPlatform",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  formControlRadio: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio--4pts",
  },
  textLabel4: {
    children: "Generate Google Font API Links",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--l6fl",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--scn7",
  },
  menuItemRadio: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportFontLinksYes",
  },
  icon2: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "exportFontLinksYesIcon",
  },
  textLabel5: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  menuItemRadio2: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportFontLinksNo",
  },
  icon3: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "exportFontLinksNoIcon",
  },
  textLabel6: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  fieldset: {
    "aria-hidden": "false",
    className: "sdn-fieldset sdn-fieldset--6n0c",
  },
  legend: {
    children: "Include",
    "aria-hidden": "false",
    className: "sdn-legend sdn-legend--btym",
  },
  formControlRadio2: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio--9dpd",
  },
  textLabel7: {
    children: "Hidden Components",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s1qr",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pwes",
  },
  menuItemRadio3: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportHiddenYes",
  },
  icon4: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "exportHiddenYesIcon",
  },
  textLabel8: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  menuItemRadio4: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportHiddenNo",
  },
  icon5: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "exportHiddenNoIcon",
  },
  textLabel9: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  formControlRadio3: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio--9dpd",
  },
  textLabel10: {
    children: "All Themes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s1qr",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pwes",
  },
  menuItemRadio5: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportAllThemesYes",
  },
  icon6: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "exportAllThemesYesIcon",
  },
  textLabel11: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  menuItemRadio6: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportAllThemesNo",
  },
  icon7: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "exportAllThemesNoIcon",
  },
  textLabel12: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  formControlRadio4: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio--9dpd",
  },
  textLabel13: {
    children: "All Enabled Fonts",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s1qr",
  },
  frame5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pwes",
  },
  menuItemRadio7: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportAllFontsYes",
  },
  icon8: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "exportAllFontsYesIcon",
  },
  textLabel14: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  menuItemRadio8: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportAllFontsNo",
  },
  icon9: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "exportAllFontsNoIcon",
  },
  textLabel15: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  formControlRadio5: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio--9dpd",
  },
  textLabel16: {
    children: "All Enabled Icons",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s1qr",
  },
  frame6: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pwes",
  },
  menuItemRadio9: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportAllIconsYes",
  },
  icon10: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "exportAllIconsYesIcon",
  },
  textLabel17: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  menuItemRadio10: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportAllIconsNo",
  },
  icon11: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "exportAllIconsNoIcon",
  },
  textLabel18: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  formControlRadio6: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio--9dpd",
  },
  textLabel19: {
    children: "Saved Workspace",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s1qr",
  },
  frame7: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pwes",
  },
  menuItemRadio11: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportSavedWorkspaceYes",
  },
  icon12: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "exportSavedWorkspaceYesIcon",
  },
  textLabel20: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  menuItemRadio12: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportSavedWorkspaceNo",
  },
  icon13: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "exportSavedWorkspaceNoIcon",
  },
  textLabel21: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  formControlRadio7: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio--9dpd",
  },
  textLabel22: {
    children: "CLI Utility Scripts",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s1qr",
  },
  frame8: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pwes",
  },
  menuItemRadio13: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportScriptsYes",
  },
  icon14: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "exportScriptsYesIcon",
  },
  textLabel23: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  menuItemRadio14: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportScriptsNo",
  },
  icon15: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "exportScriptsNoIcon",
  },
  textLabel24: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  barButtons: {
    "aria-hidden": "false",
    className: "sdn-bar-buttons sdn-bar-buttons--36qz",
  },
  button: {
    className: "sdn-button sdn-button--wjtm",
    "data-seldon-ref": "exportCancel",
  },
  icon16: {
    icon: "seldon-none",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel25: {
    children: "Cancel",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button2: {
    className: "sdn-button sdn-button--upjl",
    "data-seldon-ref": "exportConfirm",
  },
  icon17: {
    icon: "material-save",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel26: {
    children: "Export",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
}

const rootClassName = computed(() =>
  combineClassNames("sdn-dialog-export-component", props.className),
)
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const barProps = computed(() => mergeSlot(sdn.bar, props.bar, props.seldonRefs))
const textTitleProps = computed(() =>
  mergeOptionalSlot(sdn.textTitle, props.textTitle, props.seldonRefs),
)
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const formControlProps = computed(() =>
  mergeOptionalSlot(sdn.formControl, props.formControl, props.seldonRefs),
)
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const inputProps = computed(() => mergeSlot(sdn.input, props.input, props.seldonRefs))
const formControl2Props = computed(() =>
  mergeOptionalSlot(sdn.formControl2, props.formControl2, props.seldonRefs),
)
const textLabel2Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs),
)
const input2Props = computed(() => mergeSlot(sdn.input2, props.input2, props.seldonRefs))
const formControl3Props = computed(() =>
  mergeOptionalSlot(sdn.formControl3, props.formControl3, props.seldonRefs),
)
const textLabel3Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs),
)
const comboboxFieldProps = computed(() =>
  mergeOptionalSlot(sdn.comboboxField, props.comboboxField, props.seldonRefs),
)
const input3Props = computed(() => mergeSlot(sdn.input3, props.input3, props.seldonRefs))
const buttonIconicProps = computed(() =>
  mergeSlot(sdn.buttonIconic, props.buttonIconic, props.seldonRefs),
)
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const formControlRadioProps = computed(() =>
  mergeOptionalSlot(sdn.formControlRadio, props.formControlRadio, props.seldonRefs),
)
const textLabel4Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel4, props.textLabel4, props.seldonRefs),
)
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const menuItemRadioProps = computed(() =>
  mergeOptionalSlot(sdn.menuItemRadio, props.menuItemRadio, props.seldonRefs),
)
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2, props.seldonRefs))
const textLabel5Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel5, props.textLabel5, props.seldonRefs),
)
const menuItemRadio2Props = computed(() =>
  mergeOptionalSlot(sdn.menuItemRadio2, props.menuItemRadio2, props.seldonRefs),
)
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3, props.seldonRefs))
const textLabel6Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel6, props.textLabel6, props.seldonRefs),
)
const fieldsetProps = computed(() =>
  mergeOptionalSlot(sdn.fieldset, props.fieldset, props.seldonRefs),
)
const legendProps = computed(() => mergeSlot(sdn.legend, props.legend, props.seldonRefs))
const formControlRadio2Props = computed(() =>
  mergeSlot(sdn.formControlRadio2, props.formControlRadio2, props.seldonRefs),
)
const textLabel7Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel7, props.textLabel7, props.seldonRefs),
)
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3, props.seldonRefs))
const menuItemRadio3Props = computed(() =>
  mergeOptionalSlot(sdn.menuItemRadio3, props.menuItemRadio3, props.seldonRefs),
)
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4, props.seldonRefs))
const textLabel8Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel8, props.textLabel8, props.seldonRefs),
)
const menuItemRadio4Props = computed(() =>
  mergeOptionalSlot(sdn.menuItemRadio4, props.menuItemRadio4, props.seldonRefs),
)
const icon5Props = computed(() => mergeSlot(sdn.icon5, props.icon5, props.seldonRefs))
const textLabel9Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel9, props.textLabel9, props.seldonRefs),
)
const formControlRadio3Props = computed(() =>
  mergeSlot(sdn.formControlRadio3, props.formControlRadio3, props.seldonRefs),
)
const textLabel10Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel10, props.textLabel10, props.seldonRefs),
)
const frame4Props = computed(() => mergeSlot(sdn.frame4, props.frame4, props.seldonRefs))
const menuItemRadio5Props = computed(() =>
  mergeOptionalSlot(sdn.menuItemRadio5, props.menuItemRadio5, props.seldonRefs),
)
const icon6Props = computed(() => mergeSlot(sdn.icon6, props.icon6, props.seldonRefs))
const textLabel11Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel11, props.textLabel11, props.seldonRefs),
)
const menuItemRadio6Props = computed(() =>
  mergeOptionalSlot(sdn.menuItemRadio6, props.menuItemRadio6, props.seldonRefs),
)
const icon7Props = computed(() => mergeSlot(sdn.icon7, props.icon7, props.seldonRefs))
const textLabel12Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel12, props.textLabel12, props.seldonRefs),
)
const formControlRadio4Props = computed(() =>
  mergeOptionalSlot(sdn.formControlRadio4, props.formControlRadio4, props.seldonRefs),
)
const textLabel13Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel13, props.textLabel13, props.seldonRefs),
)
const frame5Props = computed(() => mergeSlot(sdn.frame5, props.frame5, props.seldonRefs))
const menuItemRadio7Props = computed(() =>
  mergeOptionalSlot(sdn.menuItemRadio7, props.menuItemRadio7, props.seldonRefs),
)
const icon8Props = computed(() => mergeSlot(sdn.icon8, props.icon8, props.seldonRefs))
const textLabel14Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel14, props.textLabel14, props.seldonRefs),
)
const menuItemRadio8Props = computed(() =>
  mergeOptionalSlot(sdn.menuItemRadio8, props.menuItemRadio8, props.seldonRefs),
)
const icon9Props = computed(() => mergeSlot(sdn.icon9, props.icon9, props.seldonRefs))
const textLabel15Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel15, props.textLabel15, props.seldonRefs),
)
const formControlRadio5Props = computed(() =>
  mergeOptionalSlot(sdn.formControlRadio5, props.formControlRadio5, props.seldonRefs),
)
const textLabel16Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel16, props.textLabel16, props.seldonRefs),
)
const frame6Props = computed(() => mergeSlot(sdn.frame6, props.frame6, props.seldonRefs))
const menuItemRadio9Props = computed(() =>
  mergeOptionalSlot(sdn.menuItemRadio9, props.menuItemRadio9, props.seldonRefs),
)
const icon10Props = computed(() => mergeSlot(sdn.icon10, props.icon10, props.seldonRefs))
const textLabel17Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel17, props.textLabel17, props.seldonRefs),
)
const menuItemRadio10Props = computed(() =>
  mergeOptionalSlot(sdn.menuItemRadio10, props.menuItemRadio10, props.seldonRefs),
)
const icon11Props = computed(() => mergeSlot(sdn.icon11, props.icon11, props.seldonRefs))
const textLabel18Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel18, props.textLabel18, props.seldonRefs),
)
const formControlRadio6Props = computed(() =>
  mergeOptionalSlot(sdn.formControlRadio6, props.formControlRadio6, props.seldonRefs),
)
const textLabel19Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel19, props.textLabel19, props.seldonRefs),
)
const frame7Props = computed(() => mergeSlot(sdn.frame7, props.frame7, props.seldonRefs))
const menuItemRadio11Props = computed(() =>
  mergeOptionalSlot(sdn.menuItemRadio11, props.menuItemRadio11, props.seldonRefs),
)
const icon12Props = computed(() => mergeSlot(sdn.icon12, props.icon12, props.seldonRefs))
const textLabel20Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel20, props.textLabel20, props.seldonRefs),
)
const menuItemRadio12Props = computed(() =>
  mergeOptionalSlot(sdn.menuItemRadio12, props.menuItemRadio12, props.seldonRefs),
)
const icon13Props = computed(() => mergeSlot(sdn.icon13, props.icon13, props.seldonRefs))
const textLabel21Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel21, props.textLabel21, props.seldonRefs),
)
const formControlRadio7Props = computed(() =>
  mergeOptionalSlot(sdn.formControlRadio7, props.formControlRadio7, props.seldonRefs),
)
const textLabel22Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel22, props.textLabel22, props.seldonRefs),
)
const frame8Props = computed(() => mergeSlot(sdn.frame8, props.frame8, props.seldonRefs))
const menuItemRadio13Props = computed(() =>
  mergeOptionalSlot(sdn.menuItemRadio13, props.menuItemRadio13, props.seldonRefs),
)
const icon14Props = computed(() => mergeSlot(sdn.icon14, props.icon14, props.seldonRefs))
const textLabel23Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel23, props.textLabel23, props.seldonRefs),
)
const menuItemRadio14Props = computed(() =>
  mergeOptionalSlot(sdn.menuItemRadio14, props.menuItemRadio14, props.seldonRefs),
)
const icon15Props = computed(() => mergeSlot(sdn.icon15, props.icon15, props.seldonRefs))
const textLabel24Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel24, props.textLabel24, props.seldonRefs),
)
const barButtonsProps = computed(() =>
  mergeSlot(sdn.barButtons, props.barButtons, props.seldonRefs),
)
const buttonProps = computed(() => mergeSlot(sdn.button, props.button, props.seldonRefs))
const icon16Props = computed(() => mergeSlot(sdn.icon16, props.icon16, props.seldonRefs))
const textLabel25Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel25, props.textLabel25, props.seldonRefs),
)
const button2Props = computed(() => mergeSlot(sdn.button2, props.button2, props.seldonRefs))
const icon17Props = computed(() => mergeSlot(sdn.icon17, props.icon17, props.seldonRefs))
const textLabel26Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel26, props.textLabel26, props.seldonRefs),
)
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
          <Input v-if="input2Props !== null" v-bind="input2Props" />
        </FormControl>
        <FormControl v-if="formControl3Props !== null" v-bind="formControl3Props">
          <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
          <ComboboxField
            v-if="comboboxFieldProps !== null"
            v-bind="comboboxFieldProps"
            :input="input3Props"
            :buttonIconic="buttonIconicProps"
            :icon2="iconProps"
            :icon="null"
          />
        </FormControl>
        <FormControlRadio v-if="formControlRadioProps !== null" v-bind="formControlRadioProps">
          <TextLabel v-if="textLabel4Props !== null" v-bind="textLabel4Props" />
          <Frame v-bind="frame2Props" v-if="frame2Props !== null">
            <MenuItemRadio v-if="menuItemRadioProps !== null" v-bind="menuItemRadioProps">
              <Icon v-if="icon2Props !== null" v-bind="icon2Props" />
              <TextLabel v-if="textLabel5Props !== null" v-bind="textLabel5Props" />
            </MenuItemRadio>
            <MenuItemRadio v-if="menuItemRadio2Props !== null" v-bind="menuItemRadio2Props">
              <Icon v-if="icon3Props !== null" v-bind="icon3Props" />
              <TextLabel v-if="textLabel6Props !== null" v-bind="textLabel6Props" />
            </MenuItemRadio>
          </Frame>
        </FormControlRadio>
        <Fieldset v-if="fieldsetProps !== null" v-bind="fieldsetProps">
          <Legend v-if="legendProps !== null" v-bind="legendProps" />
          <FormControlRadio v-if="formControlRadio2Props !== null" v-bind="formControlRadio2Props">
            <TextLabel v-if="textLabel7Props !== null" v-bind="textLabel7Props" />
            <Frame v-bind="frame3Props" v-if="frame3Props !== null">
              <MenuItemRadio v-if="menuItemRadio3Props !== null" v-bind="menuItemRadio3Props">
                <Icon v-if="icon4Props !== null" v-bind="icon4Props" />
                <TextLabel v-if="textLabel8Props !== null" v-bind="textLabel8Props" />
              </MenuItemRadio>
              <MenuItemRadio v-if="menuItemRadio4Props !== null" v-bind="menuItemRadio4Props">
                <Icon v-if="icon5Props !== null" v-bind="icon5Props" />
                <TextLabel v-if="textLabel9Props !== null" v-bind="textLabel9Props" />
              </MenuItemRadio>
            </Frame>
          </FormControlRadio>
          <FormControlRadio v-if="formControlRadio3Props !== null" v-bind="formControlRadio3Props">
            <TextLabel v-if="textLabel10Props !== null" v-bind="textLabel10Props" />
            <Frame v-bind="frame4Props" v-if="frame4Props !== null">
              <MenuItemRadio v-if="menuItemRadio5Props !== null" v-bind="menuItemRadio5Props">
                <Icon v-if="icon6Props !== null" v-bind="icon6Props" />
                <TextLabel v-if="textLabel11Props !== null" v-bind="textLabel11Props" />
              </MenuItemRadio>
              <MenuItemRadio v-if="menuItemRadio6Props !== null" v-bind="menuItemRadio6Props">
                <Icon v-if="icon7Props !== null" v-bind="icon7Props" />
                <TextLabel v-if="textLabel12Props !== null" v-bind="textLabel12Props" />
              </MenuItemRadio>
            </Frame>
          </FormControlRadio>
          <FormControlRadio v-if="formControlRadio4Props !== null" v-bind="formControlRadio4Props">
            <TextLabel v-if="textLabel13Props !== null" v-bind="textLabel13Props" />
            <Frame v-bind="frame5Props" v-if="frame5Props !== null">
              <MenuItemRadio v-if="menuItemRadio7Props !== null" v-bind="menuItemRadio7Props">
                <Icon v-if="icon8Props !== null" v-bind="icon8Props" />
                <TextLabel v-if="textLabel14Props !== null" v-bind="textLabel14Props" />
              </MenuItemRadio>
              <MenuItemRadio v-if="menuItemRadio8Props !== null" v-bind="menuItemRadio8Props">
                <Icon v-if="icon9Props !== null" v-bind="icon9Props" />
                <TextLabel v-if="textLabel15Props !== null" v-bind="textLabel15Props" />
              </MenuItemRadio>
            </Frame>
          </FormControlRadio>
          <FormControlRadio v-if="formControlRadio5Props !== null" v-bind="formControlRadio5Props">
            <TextLabel v-if="textLabel16Props !== null" v-bind="textLabel16Props" />
            <Frame v-bind="frame6Props" v-if="frame6Props !== null">
              <MenuItemRadio v-if="menuItemRadio9Props !== null" v-bind="menuItemRadio9Props">
                <Icon v-if="icon10Props !== null" v-bind="icon10Props" />
                <TextLabel v-if="textLabel17Props !== null" v-bind="textLabel17Props" />
              </MenuItemRadio>
              <MenuItemRadio v-if="menuItemRadio10Props !== null" v-bind="menuItemRadio10Props">
                <Icon v-if="icon11Props !== null" v-bind="icon11Props" />
                <TextLabel v-if="textLabel18Props !== null" v-bind="textLabel18Props" />
              </MenuItemRadio>
            </Frame>
          </FormControlRadio>
          <FormControlRadio v-if="formControlRadio6Props !== null" v-bind="formControlRadio6Props">
            <TextLabel v-if="textLabel19Props !== null" v-bind="textLabel19Props" />
            <Frame v-bind="frame7Props" v-if="frame7Props !== null">
              <MenuItemRadio v-if="menuItemRadio11Props !== null" v-bind="menuItemRadio11Props">
                <Icon v-if="icon12Props !== null" v-bind="icon12Props" />
                <TextLabel v-if="textLabel20Props !== null" v-bind="textLabel20Props" />
              </MenuItemRadio>
              <MenuItemRadio v-if="menuItemRadio12Props !== null" v-bind="menuItemRadio12Props">
                <Icon v-if="icon13Props !== null" v-bind="icon13Props" />
                <TextLabel v-if="textLabel21Props !== null" v-bind="textLabel21Props" />
              </MenuItemRadio>
            </Frame>
          </FormControlRadio>
          <FormControlRadio v-if="formControlRadio7Props !== null" v-bind="formControlRadio7Props">
            <TextLabel v-if="textLabel22Props !== null" v-bind="textLabel22Props" />
            <Frame v-bind="frame8Props" v-if="frame8Props !== null">
              <MenuItemRadio v-if="menuItemRadio13Props !== null" v-bind="menuItemRadio13Props">
                <Icon v-if="icon14Props !== null" v-bind="icon14Props" />
                <TextLabel v-if="textLabel23Props !== null" v-bind="textLabel23Props" />
              </MenuItemRadio>
              <MenuItemRadio v-if="menuItemRadio14Props !== null" v-bind="menuItemRadio14Props">
                <Icon v-if="icon15Props !== null" v-bind="icon15Props" />
                <TextLabel v-if="textLabel24Props !== null" v-bind="textLabel24Props" />
              </MenuItemRadio>
            </Frame>
          </FormControlRadio>
        </Fieldset>
      </Frame>
      <BarButtons
        v-if="barButtonsProps !== null"
        v-bind="barButtonsProps"
        :button4="buttonProps"
        :icon4="icon16Props"
        :textLabel4="textLabel25Props"
        :button5="button2Props"
        :icon5="icon17Props"
        :textLabel5="textLabel26Props"
      />
    </slot>
  </div>
</template>
