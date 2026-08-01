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

import { HTMLAttributes } from "react"

import { ButtonProps } from "../elements/Button"
import { ButtonIconicProps } from "../elements/ButtonIconic"
import { ComboboxField, ComboboxFieldProps } from "../elements/ComboboxField"
import { FormControl, FormControlProps } from "../elements/FormControl"
import { FormControlRadio, FormControlRadioProps } from "../elements/FormControlRadio"
import { MenuItemRadio, MenuItemRadioProps } from "../elements/MenuItemRadio"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { Bar, BarProps } from "../parts/Bar"
import { BarButtons, BarButtonsProps } from "../parts/BarButtons"
import { Fieldset, FieldsetProps } from "../parts/Fieldset"
import { Icon, IconProps } from "../primitives/Icon"
import { Input, InputProps } from "../primitives/Input"
import { Legend, LegendProps } from "../primitives/Legend"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface DialogExportComponentProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  bar?: BarProps | null
  textTitle?: TextTitleProps | null

  frame?: FrameProps | null
  formControl?: FormControlProps | null
  textLabel?: TextLabelProps | null
  input?: InputProps | null
  formControl2?: FormControlProps | null
  textLabel2?: TextLabelProps | null
  input2?: InputProps | null
  formControl3?: FormControlProps | null
  textLabel3?: TextLabelProps | null
  comboboxField?: ComboboxFieldProps | null
  input3?: InputProps | null
  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null
  formControlRadio?: FormControlRadioProps | null
  textLabel4?: TextLabelProps | null
  frame2?: FrameProps | null
  menuItemRadio?: MenuItemRadioProps | null
  icon2?: IconProps | null
  textLabel5?: TextLabelProps | null
  menuItemRadio2?: MenuItemRadioProps | null
  icon3?: IconProps | null
  textLabel6?: TextLabelProps | null
  fieldset?: FieldsetProps | null
  legend?: LegendProps | null
  formControlRadio2?: FormControlRadioProps | null
  textLabel7?: TextLabelProps | null
  frame3?: FrameProps | null
  menuItemRadio3?: MenuItemRadioProps | null
  icon4?: IconProps | null
  textLabel8?: TextLabelProps | null
  menuItemRadio4?: MenuItemRadioProps | null
  icon5?: IconProps | null
  textLabel9?: TextLabelProps | null
  formControlRadio3?: FormControlRadioProps | null
  textLabel10?: TextLabelProps | null
  frame4?: FrameProps | null
  menuItemRadio5?: MenuItemRadioProps | null
  icon6?: IconProps | null
  textLabel11?: TextLabelProps | null
  menuItemRadio6?: MenuItemRadioProps | null
  icon7?: IconProps | null
  textLabel12?: TextLabelProps | null
  formControlRadio4?: FormControlRadioProps | null
  textLabel13?: TextLabelProps | null
  frame5?: FrameProps | null
  menuItemRadio7?: MenuItemRadioProps | null
  icon8?: IconProps | null
  textLabel14?: TextLabelProps | null
  menuItemRadio8?: MenuItemRadioProps | null
  icon9?: IconProps | null
  textLabel15?: TextLabelProps | null
  formControlRadio5?: FormControlRadioProps | null
  textLabel16?: TextLabelProps | null
  frame6?: FrameProps | null
  menuItemRadio9?: MenuItemRadioProps | null
  icon10?: IconProps | null
  textLabel17?: TextLabelProps | null
  menuItemRadio10?: MenuItemRadioProps | null
  icon11?: IconProps | null
  textLabel18?: TextLabelProps | null
  formControlRadio6?: FormControlRadioProps | null
  textLabel19?: TextLabelProps | null
  frame7?: FrameProps | null
  menuItemRadio11?: MenuItemRadioProps | null
  icon12?: IconProps | null
  textLabel20?: TextLabelProps | null
  menuItemRadio12?: MenuItemRadioProps | null
  icon13?: IconProps | null
  textLabel21?: TextLabelProps | null
  formControlRadio7?: FormControlRadioProps | null
  textLabel22?: TextLabelProps | null
  frame8?: FrameProps | null
  menuItemRadio13?: MenuItemRadioProps | null
  icon14?: IconProps | null
  textLabel23?: TextLabelProps | null
  menuItemRadio14?: MenuItemRadioProps | null
  icon15?: IconProps | null
  textLabel24?: TextLabelProps | null

  barButtons?: BarButtonsProps | null
  button?: ButtonProps | null
  icon16?: IconProps | null
  textLabel25?: TextLabelProps | null
  button2?: ButtonProps | null
  icon17?: IconProps | null
  textLabel26?: TextLabelProps | null
}

//
// Default property values
//
const sdn: DialogExportComponentProps = {
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
    className: "sdn-text-label sdn-text-label--jndm",
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
    className: "sdn-text-label sdn-text-label--jndm",
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
    className: "sdn-text-label sdn-text-label--jndm",
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
    className: "sdn-text-label sdn-text-label--jndm",
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
    className: "sdn-text-label sdn-text-label--jndm",
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
    className: "sdn-text-label sdn-text-label--jndm",
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
    className: "sdn-text-label sdn-text-label--jndm",
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
    className: "sdn-text-label sdn-text-label--jndm",
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
    className: "sdn-text-label sdn-text-label--jndm",
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
    className: "sdn-text-label sdn-text-label--jndm",
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
    className: "sdn-text-label sdn-text-label--jndm",
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
    className: "sdn-text-label sdn-text-label--jndm",
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
    className: "sdn-text-label sdn-text-label--jndm",
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
    className: "sdn-text-label sdn-text-label--jndm",
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
 * ```tsx
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
export function DialogExportComponent({
  className = "",
  bar,
  textTitle,

  frame,
  formControl,
  textLabel,
  input,
  formControl2,
  textLabel2,
  input2,
  formControl3,
  textLabel3,
  comboboxField,
  input3,
  buttonIconic,
  icon,
  formControlRadio,
  textLabel4,
  frame2,
  menuItemRadio,
  icon2,
  textLabel5,
  menuItemRadio2,
  icon3,
  textLabel6,
  fieldset,
  legend,
  formControlRadio2,
  textLabel7,
  frame3,
  menuItemRadio3,
  icon4,
  textLabel8,
  menuItemRadio4,
  icon5,
  textLabel9,
  formControlRadio3,
  textLabel10,
  frame4,
  menuItemRadio5,
  icon6,
  textLabel11,
  menuItemRadio6,
  icon7,
  textLabel12,
  formControlRadio4,
  textLabel13,
  frame5,
  menuItemRadio7,
  icon8,
  textLabel14,
  menuItemRadio8,
  icon9,
  textLabel15,
  formControlRadio5,
  textLabel16,
  frame6,
  menuItemRadio9,
  icon10,
  textLabel17,
  menuItemRadio10,
  icon11,
  textLabel18,
  formControlRadio6,
  textLabel19,
  frame7,
  menuItemRadio11,
  icon12,
  textLabel20,
  menuItemRadio12,
  icon13,
  textLabel21,
  formControlRadio7,
  textLabel22,
  frame8,
  menuItemRadio13,
  icon14,
  textLabel23,
  menuItemRadio14,
  icon15,
  textLabel24,

  barButtons,
  button,
  icon16,
  textLabel25,
  button2,
  icon17,
  textLabel26,

  children,
  seldonRefs,
  ...props
}: DialogExportComponentProps) {
  const dialogExportComponentClassName = combineClassNames("sdn-dialog-export-component", className)

  const barProps = mergeSlot(sdn.bar, bar, seldonRefs)
  const textTitleProps = mergeOptionalSlot(sdn.textTitle, textTitle, seldonRefs)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const formControlProps = mergeOptionalSlot(sdn.formControl, formControl, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const inputProps = mergeSlot(sdn.input, input, seldonRefs)
  const formControl2Props = mergeOptionalSlot(sdn.formControl2, formControl2, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const input2Props = mergeSlot(sdn.input2, input2, seldonRefs)
  const formControl3Props = mergeOptionalSlot(sdn.formControl3, formControl3, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)
  const comboboxFieldProps = mergeOptionalSlot(sdn.comboboxField, comboboxField, seldonRefs)
  const input3Props = mergeSlot(sdn.input3, input3, seldonRefs)
  const buttonIconicProps = mergeSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const formControlRadioProps = mergeOptionalSlot(
    sdn.formControlRadio,
    formControlRadio,
    seldonRefs,
  )
  const textLabel4Props = mergeOptionalSlot(sdn.textLabel4, textLabel4, seldonRefs)
  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const menuItemRadioProps = mergeOptionalSlot(sdn.menuItemRadio, menuItemRadio, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)
  const textLabel5Props = mergeOptionalSlot(sdn.textLabel5, textLabel5, seldonRefs)
  const menuItemRadio2Props = mergeOptionalSlot(sdn.menuItemRadio2, menuItemRadio2, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)
  const textLabel6Props = mergeOptionalSlot(sdn.textLabel6, textLabel6, seldonRefs)
  const fieldsetProps = mergeOptionalSlot(sdn.fieldset, fieldset, seldonRefs)
  const legendProps = mergeSlot(sdn.legend, legend, seldonRefs)
  const formControlRadio2Props = mergeSlot(sdn.formControlRadio2, formControlRadio2, seldonRefs)
  const textLabel7Props = mergeOptionalSlot(sdn.textLabel7, textLabel7, seldonRefs)
  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const menuItemRadio3Props = mergeOptionalSlot(sdn.menuItemRadio3, menuItemRadio3, seldonRefs)
  const icon4Props = mergeSlot(sdn.icon4, icon4, seldonRefs)
  const textLabel8Props = mergeOptionalSlot(sdn.textLabel8, textLabel8, seldonRefs)
  const menuItemRadio4Props = mergeOptionalSlot(sdn.menuItemRadio4, menuItemRadio4, seldonRefs)
  const icon5Props = mergeSlot(sdn.icon5, icon5, seldonRefs)
  const textLabel9Props = mergeOptionalSlot(sdn.textLabel9, textLabel9, seldonRefs)
  const formControlRadio3Props = mergeSlot(sdn.formControlRadio3, formControlRadio3, seldonRefs)
  const textLabel10Props = mergeOptionalSlot(sdn.textLabel10, textLabel10, seldonRefs)
  const frame4Props = mergeSlot(sdn.frame4, frame4, seldonRefs)
  const menuItemRadio5Props = mergeOptionalSlot(sdn.menuItemRadio5, menuItemRadio5, seldonRefs)
  const icon6Props = mergeSlot(sdn.icon6, icon6, seldonRefs)
  const textLabel11Props = mergeOptionalSlot(sdn.textLabel11, textLabel11, seldonRefs)
  const menuItemRadio6Props = mergeOptionalSlot(sdn.menuItemRadio6, menuItemRadio6, seldonRefs)
  const icon7Props = mergeSlot(sdn.icon7, icon7, seldonRefs)
  const textLabel12Props = mergeOptionalSlot(sdn.textLabel12, textLabel12, seldonRefs)
  const formControlRadio4Props = mergeOptionalSlot(
    sdn.formControlRadio4,
    formControlRadio4,
    seldonRefs,
  )
  const textLabel13Props = mergeOptionalSlot(sdn.textLabel13, textLabel13, seldonRefs)
  const frame5Props = mergeSlot(sdn.frame5, frame5, seldonRefs)
  const menuItemRadio7Props = mergeOptionalSlot(sdn.menuItemRadio7, menuItemRadio7, seldonRefs)
  const icon8Props = mergeSlot(sdn.icon8, icon8, seldonRefs)
  const textLabel14Props = mergeOptionalSlot(sdn.textLabel14, textLabel14, seldonRefs)
  const menuItemRadio8Props = mergeOptionalSlot(sdn.menuItemRadio8, menuItemRadio8, seldonRefs)
  const icon9Props = mergeSlot(sdn.icon9, icon9, seldonRefs)
  const textLabel15Props = mergeOptionalSlot(sdn.textLabel15, textLabel15, seldonRefs)
  const formControlRadio5Props = mergeOptionalSlot(
    sdn.formControlRadio5,
    formControlRadio5,
    seldonRefs,
  )
  const textLabel16Props = mergeOptionalSlot(sdn.textLabel16, textLabel16, seldonRefs)
  const frame6Props = mergeSlot(sdn.frame6, frame6, seldonRefs)
  const menuItemRadio9Props = mergeOptionalSlot(sdn.menuItemRadio9, menuItemRadio9, seldonRefs)
  const icon10Props = mergeSlot(sdn.icon10, icon10, seldonRefs)
  const textLabel17Props = mergeOptionalSlot(sdn.textLabel17, textLabel17, seldonRefs)
  const menuItemRadio10Props = mergeOptionalSlot(sdn.menuItemRadio10, menuItemRadio10, seldonRefs)
  const icon11Props = mergeSlot(sdn.icon11, icon11, seldonRefs)
  const textLabel18Props = mergeOptionalSlot(sdn.textLabel18, textLabel18, seldonRefs)
  const formControlRadio6Props = mergeOptionalSlot(
    sdn.formControlRadio6,
    formControlRadio6,
    seldonRefs,
  )
  const textLabel19Props = mergeOptionalSlot(sdn.textLabel19, textLabel19, seldonRefs)
  const frame7Props = mergeSlot(sdn.frame7, frame7, seldonRefs)
  const menuItemRadio11Props = mergeOptionalSlot(sdn.menuItemRadio11, menuItemRadio11, seldonRefs)
  const icon12Props = mergeSlot(sdn.icon12, icon12, seldonRefs)
  const textLabel20Props = mergeOptionalSlot(sdn.textLabel20, textLabel20, seldonRefs)
  const menuItemRadio12Props = mergeOptionalSlot(sdn.menuItemRadio12, menuItemRadio12, seldonRefs)
  const icon13Props = mergeSlot(sdn.icon13, icon13, seldonRefs)
  const textLabel21Props = mergeOptionalSlot(sdn.textLabel21, textLabel21, seldonRefs)
  const formControlRadio7Props = mergeOptionalSlot(
    sdn.formControlRadio7,
    formControlRadio7,
    seldonRefs,
  )
  const textLabel22Props = mergeOptionalSlot(sdn.textLabel22, textLabel22, seldonRefs)
  const frame8Props = mergeSlot(sdn.frame8, frame8, seldonRefs)
  const menuItemRadio13Props = mergeOptionalSlot(sdn.menuItemRadio13, menuItemRadio13, seldonRefs)
  const icon14Props = mergeSlot(sdn.icon14, icon14, seldonRefs)
  const textLabel23Props = mergeOptionalSlot(sdn.textLabel23, textLabel23, seldonRefs)
  const menuItemRadio14Props = mergeOptionalSlot(sdn.menuItemRadio14, menuItemRadio14, seldonRefs)
  const icon15Props = mergeSlot(sdn.icon15, icon15, seldonRefs)
  const textLabel24Props = mergeOptionalSlot(sdn.textLabel24, textLabel24, seldonRefs)

  const barButtonsProps = mergeSlot(sdn.barButtons, barButtons, seldonRefs)
  const buttonProps = mergeSlot(sdn.button, button, seldonRefs)
  const icon16Props = mergeSlot(sdn.icon16, icon16, seldonRefs)
  const textLabel25Props = mergeOptionalSlot(sdn.textLabel25, textLabel25, seldonRefs)
  const button2Props = mergeSlot(sdn.button2, button2, seldonRefs)
  const icon17Props = mergeSlot(sdn.icon17, icon17, seldonRefs)
  const textLabel26Props = mergeOptionalSlot(sdn.textLabel26, textLabel26, seldonRefs)

  return (
    <HTMLDiv className={dialogExportComponentClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {barProps !== null && (
            <Bar {...barProps}>{textTitleProps !== null && <TextTitle {...textTitleProps} />}</Bar>
          )}
          <Frame {...frameProps}>
            {formControlProps !== null && (
              <FormControl {...formControlProps}>
                {textLabelProps !== null && <TextLabel {...textLabelProps} />}
                {inputProps !== null && <Input {...inputProps} />}
              </FormControl>
            )}
            {formControl2Props !== null && (
              <FormControl {...formControl2Props}>
                {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
                {input2Props !== null && <Input {...input2Props} />}
              </FormControl>
            )}
            {formControl3Props !== null && (
              <FormControl {...formControl3Props}>
                {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
                {comboboxFieldProps !== null && (
                  <ComboboxField
                    {...comboboxFieldProps}
                    input={input3Props}
                    buttonIconic={buttonIconicProps}
                    icon2={iconProps}
                    icon={null}
                  />
                )}
              </FormControl>
            )}
            {formControlRadioProps !== null && (
              <FormControlRadio {...formControlRadioProps}>
                {textLabel4Props !== null && <TextLabel {...textLabel4Props} />}
                <Frame {...frame2Props}>
                  {menuItemRadioProps !== null && (
                    <MenuItemRadio {...menuItemRadioProps}>
                      {icon2Props !== null && <Icon {...icon2Props} />}
                      {textLabel5Props !== null && <TextLabel {...textLabel5Props} />}
                    </MenuItemRadio>
                  )}
                  {menuItemRadio2Props !== null && (
                    <MenuItemRadio {...menuItemRadio2Props}>
                      {icon3Props !== null && <Icon {...icon3Props} />}
                      {textLabel6Props !== null && <TextLabel {...textLabel6Props} />}
                    </MenuItemRadio>
                  )}
                </Frame>
              </FormControlRadio>
            )}
            {fieldsetProps !== null && (
              <Fieldset {...fieldsetProps}>
                {legendProps !== null && <Legend {...legendProps} />}
                {formControlRadio2Props !== null && (
                  <FormControlRadio {...formControlRadio2Props}>
                    {textLabel7Props !== null && <TextLabel {...textLabel7Props} />}
                    <Frame {...frame3Props}>
                      {menuItemRadio3Props !== null && (
                        <MenuItemRadio {...menuItemRadio3Props}>
                          {icon4Props !== null && <Icon {...icon4Props} />}
                          {textLabel8Props !== null && <TextLabel {...textLabel8Props} />}
                        </MenuItemRadio>
                      )}
                      {menuItemRadio4Props !== null && (
                        <MenuItemRadio {...menuItemRadio4Props}>
                          {icon5Props !== null && <Icon {...icon5Props} />}
                          {textLabel9Props !== null && <TextLabel {...textLabel9Props} />}
                        </MenuItemRadio>
                      )}
                    </Frame>
                  </FormControlRadio>
                )}
                {formControlRadio3Props !== null && (
                  <FormControlRadio {...formControlRadio3Props}>
                    {textLabel10Props !== null && <TextLabel {...textLabel10Props} />}
                    <Frame {...frame4Props}>
                      {menuItemRadio5Props !== null && (
                        <MenuItemRadio {...menuItemRadio5Props}>
                          {icon6Props !== null && <Icon {...icon6Props} />}
                          {textLabel11Props !== null && <TextLabel {...textLabel11Props} />}
                        </MenuItemRadio>
                      )}
                      {menuItemRadio6Props !== null && (
                        <MenuItemRadio {...menuItemRadio6Props}>
                          {icon7Props !== null && <Icon {...icon7Props} />}
                          {textLabel12Props !== null && <TextLabel {...textLabel12Props} />}
                        </MenuItemRadio>
                      )}
                    </Frame>
                  </FormControlRadio>
                )}
                {formControlRadio4Props !== null && (
                  <FormControlRadio {...formControlRadio4Props}>
                    {textLabel13Props !== null && <TextLabel {...textLabel13Props} />}
                    <Frame {...frame5Props}>
                      {menuItemRadio7Props !== null && (
                        <MenuItemRadio {...menuItemRadio7Props}>
                          {icon8Props !== null && <Icon {...icon8Props} />}
                          {textLabel14Props !== null && <TextLabel {...textLabel14Props} />}
                        </MenuItemRadio>
                      )}
                      {menuItemRadio8Props !== null && (
                        <MenuItemRadio {...menuItemRadio8Props}>
                          {icon9Props !== null && <Icon {...icon9Props} />}
                          {textLabel15Props !== null && <TextLabel {...textLabel15Props} />}
                        </MenuItemRadio>
                      )}
                    </Frame>
                  </FormControlRadio>
                )}
                {formControlRadio5Props !== null && (
                  <FormControlRadio {...formControlRadio5Props}>
                    {textLabel16Props !== null && <TextLabel {...textLabel16Props} />}
                    <Frame {...frame6Props}>
                      {menuItemRadio9Props !== null && (
                        <MenuItemRadio {...menuItemRadio9Props}>
                          {icon10Props !== null && <Icon {...icon10Props} />}
                          {textLabel17Props !== null && <TextLabel {...textLabel17Props} />}
                        </MenuItemRadio>
                      )}
                      {menuItemRadio10Props !== null && (
                        <MenuItemRadio {...menuItemRadio10Props}>
                          {icon11Props !== null && <Icon {...icon11Props} />}
                          {textLabel18Props !== null && <TextLabel {...textLabel18Props} />}
                        </MenuItemRadio>
                      )}
                    </Frame>
                  </FormControlRadio>
                )}
                {formControlRadio6Props !== null && (
                  <FormControlRadio {...formControlRadio6Props}>
                    {textLabel19Props !== null && <TextLabel {...textLabel19Props} />}
                    <Frame {...frame7Props}>
                      {menuItemRadio11Props !== null && (
                        <MenuItemRadio {...menuItemRadio11Props}>
                          {icon12Props !== null && <Icon {...icon12Props} />}
                          {textLabel20Props !== null && <TextLabel {...textLabel20Props} />}
                        </MenuItemRadio>
                      )}
                      {menuItemRadio12Props !== null && (
                        <MenuItemRadio {...menuItemRadio12Props}>
                          {icon13Props !== null && <Icon {...icon13Props} />}
                          {textLabel21Props !== null && <TextLabel {...textLabel21Props} />}
                        </MenuItemRadio>
                      )}
                    </Frame>
                  </FormControlRadio>
                )}
                {formControlRadio7Props !== null && (
                  <FormControlRadio {...formControlRadio7Props}>
                    {textLabel22Props !== null && <TextLabel {...textLabel22Props} />}
                    <Frame {...frame8Props}>
                      {menuItemRadio13Props !== null && (
                        <MenuItemRadio {...menuItemRadio13Props}>
                          {icon14Props !== null && <Icon {...icon14Props} />}
                          {textLabel23Props !== null && <TextLabel {...textLabel23Props} />}
                        </MenuItemRadio>
                      )}
                      {menuItemRadio14Props !== null && (
                        <MenuItemRadio {...menuItemRadio14Props}>
                          {icon15Props !== null && <Icon {...icon15Props} />}
                          {textLabel24Props !== null && <TextLabel {...textLabel24Props} />}
                        </MenuItemRadio>
                      )}
                    </Frame>
                  </FormControlRadio>
                )}
              </Fieldset>
            )}
          </Frame>
          {barButtonsProps !== null && (
            <BarButtons
              {...barButtonsProps}
              button4={buttonProps}
              icon4={icon16Props}
              textLabel4={textLabel25Props}
              button5={button2Props}
              icon5={icon17Props}
              textLabel5={textLabel26Props}
            />
          )}
        </>
      )}
    </HTMLDiv>
  )
}
