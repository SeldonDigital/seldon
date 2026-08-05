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
import {
  FormControlRadioButtonControl,
  FormControlRadioButtonControlProps,
} from "../elements/FormControlRadioButtonControl"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { Bar, BarProps } from "../parts/Bar"
import { BarButtons, BarButtonsProps } from "../parts/BarButtons"
import { Fieldset, FieldsetProps } from "../parts/Fieldset"
import { IconProps } from "../primitives/Icon"
import { Input, InputProps } from "../primitives/Input"
import { InputRadioButton, InputRadioButtonProps } from "../primitives/InputRadioButton"
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
  formControlRadioButtonControl?: FormControlRadioButtonControlProps | null
  inputRadioButton?: InputRadioButtonProps | null
  textLabel5?: TextLabelProps | null
  formControlRadioButtonControl2?: FormControlRadioButtonControlProps | null
  inputRadioButton2?: InputRadioButtonProps | null
  textLabel6?: TextLabelProps | null
  fieldset?: FieldsetProps | null
  legend?: LegendProps | null
  formControlRadio2?: FormControlRadioProps | null
  textLabel7?: TextLabelProps | null
  frame3?: FrameProps | null
  formControlRadioButtonControl3?: FormControlRadioButtonControlProps | null
  inputRadioButton3?: InputRadioButtonProps | null
  textLabel8?: TextLabelProps | null
  formControlRadioButtonControl4?: FormControlRadioButtonControlProps | null
  inputRadioButton4?: InputRadioButtonProps | null
  textLabel9?: TextLabelProps | null
  formControlRadio3?: FormControlRadioProps | null
  textLabel10?: TextLabelProps | null
  frame4?: FrameProps | null
  formControlRadioButtonControl5?: FormControlRadioButtonControlProps | null
  inputRadioButton5?: InputRadioButtonProps | null
  textLabel11?: TextLabelProps | null
  formControlRadioButtonControl6?: FormControlRadioButtonControlProps | null
  inputRadioButton6?: InputRadioButtonProps | null
  textLabel12?: TextLabelProps | null
  formControlRadio4?: FormControlRadioProps | null
  textLabel13?: TextLabelProps | null
  frame5?: FrameProps | null
  formControlRadioButtonControl7?: FormControlRadioButtonControlProps | null
  inputRadioButton7?: InputRadioButtonProps | null
  textLabel14?: TextLabelProps | null
  formControlRadioButtonControl8?: FormControlRadioButtonControlProps | null
  inputRadioButton8?: InputRadioButtonProps | null
  textLabel15?: TextLabelProps | null
  formControlRadio5?: FormControlRadioProps | null
  textLabel16?: TextLabelProps | null
  frame6?: FrameProps | null
  formControlRadioButtonControl9?: FormControlRadioButtonControlProps | null
  inputRadioButton9?: InputRadioButtonProps | null
  textLabel17?: TextLabelProps | null
  formControlRadioButtonControl10?: FormControlRadioButtonControlProps | null
  inputRadioButton10?: InputRadioButtonProps | null
  textLabel18?: TextLabelProps | null
  formControlRadio6?: FormControlRadioProps | null
  textLabel19?: TextLabelProps | null
  frame7?: FrameProps | null
  formControlRadioButtonControl11?: FormControlRadioButtonControlProps | null
  inputRadioButton11?: InputRadioButtonProps | null
  textLabel20?: TextLabelProps | null
  formControlRadioButtonControl12?: FormControlRadioButtonControlProps | null
  inputRadioButton12?: InputRadioButtonProps | null
  textLabel21?: TextLabelProps | null
  formControlRadio7?: FormControlRadioProps | null
  textLabel22?: TextLabelProps | null
  frame8?: FrameProps | null
  formControlRadioButtonControl13?: FormControlRadioButtonControlProps | null
  inputRadioButton13?: InputRadioButtonProps | null
  textLabel23?: TextLabelProps | null
  formControlRadioButtonControl14?: FormControlRadioButtonControlProps | null
  inputRadioButton14?: InputRadioButtonProps | null
  textLabel24?: TextLabelProps | null

  barButtons?: BarButtonsProps | null
  button?: ButtonProps | null
  icon2?: IconProps | null
  textLabel25?: TextLabelProps | null
  button2?: ButtonProps | null
  icon3?: IconProps | null
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
    className: "sdn-text-title sdn-text-title--j8d9",
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
    icon: "material-keyboardArrowDown",
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
  formControlRadioButtonControl: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio-button-control--0acl",
    "data-seldon-ref": "exportFontLinksYes",
  },
  inputRadioButton: {
    placeholder: "Placeholder text",
    type: "radio",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel5: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--uqg6",
  },
  formControlRadioButtonControl2: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio-button-control--0acl",
    "data-seldon-ref": "exportFontLinksNo",
  },
  inputRadioButton2: {
    placeholder: "Placeholder text",
    type: "radio",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel6: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--uqg6",
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
  formControlRadioButtonControl3: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio-button-control--0acl",
    "data-seldon-ref": "exportHiddenYes",
  },
  inputRadioButton3: {
    placeholder: "Placeholder text",
    type: "radio",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel8: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--uqg6",
  },
  formControlRadioButtonControl4: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio-button-control--0acl",
    "data-seldon-ref": "exportHiddenNo",
  },
  inputRadioButton4: {
    placeholder: "Placeholder text",
    type: "radio",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel9: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--uqg6",
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
  formControlRadioButtonControl5: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio-button-control--0acl",
    "data-seldon-ref": "exportAllThemesYes",
  },
  inputRadioButton5: {
    placeholder: "Placeholder text",
    type: "radio",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel11: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--uqg6",
  },
  formControlRadioButtonControl6: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio-button-control--0acl",
    "data-seldon-ref": "exportAllThemesNo",
  },
  inputRadioButton6: {
    placeholder: "Placeholder text",
    type: "radio",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel12: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--uqg6",
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
  formControlRadioButtonControl7: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio-button-control--0acl",
    "data-seldon-ref": "exportAllFontsYes",
  },
  inputRadioButton7: {
    placeholder: "Placeholder text",
    type: "radio",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel14: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--uqg6",
  },
  formControlRadioButtonControl8: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio-button-control--0acl",
    "data-seldon-ref": "exportAllFontsNo",
  },
  inputRadioButton8: {
    placeholder: "Placeholder text",
    type: "radio",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel15: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--uqg6",
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
  formControlRadioButtonControl9: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio-button-control--0acl",
    "data-seldon-ref": "exportAllIconsYes",
  },
  inputRadioButton9: {
    placeholder: "Placeholder text",
    type: "radio",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel17: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--uqg6",
  },
  formControlRadioButtonControl10: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio-button-control--0acl",
    "data-seldon-ref": "exportAllIconsNo",
  },
  inputRadioButton10: {
    placeholder: "Placeholder text",
    type: "radio",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel18: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--uqg6",
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
  formControlRadioButtonControl11: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio-button-control--0acl",
    "data-seldon-ref": "exportSavedWorkspaceYes",
  },
  inputRadioButton11: {
    placeholder: "Placeholder text",
    type: "radio",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel20: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--uqg6",
  },
  formControlRadioButtonControl12: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio-button-control--0acl",
    "data-seldon-ref": "exportSavedWorkspaceNo",
  },
  inputRadioButton12: {
    placeholder: "Placeholder text",
    type: "radio",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel21: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--uqg6",
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
  formControlRadioButtonControl13: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio-button-control--0acl",
    "data-seldon-ref": "exportScriptsYes",
  },
  inputRadioButton13: {
    placeholder: "Placeholder text",
    type: "radio",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel23: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--uqg6",
  },
  formControlRadioButtonControl14: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio-button-control--0acl",
    "data-seldon-ref": "exportScriptsNo",
  },
  inputRadioButton14: {
    placeholder: "Placeholder text",
    type: "radio",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel24: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--uqg6",
  },

  barButtons: {
    "aria-hidden": "false",
    className: "sdn-bar-buttons sdn-bar-buttons--36qz",
  },
  button: {
    className: "sdn-button sdn-button--wjtm",
    "data-seldon-ref": "exportCancel",
  },
  icon2: {
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
    className: "sdn-button sdn-button--wjtm",
    "data-seldon-ref": "exportConfirm",
  },
  icon3: {
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
 *   Bar                                    bar
 *     TextTitle                            textTitle
 *   Frame                                  frame
 *     FormControl                          formControl
 *       TextLabel                          textLabel
 *       Input                              input                            -> exportWorkspaceName
 *     FormControl                          formControl2
 *       TextLabel                          textLabel2
 *       Input                              input2                           -> exportRootPath
 *     FormControl                          formControl3
 *       TextLabel                          textLabel3
 *       ComboboxField                      comboboxField
 *         Input                            input3                           -> exportPlatform
 *         ButtonIconic                     buttonIconic
 *           Icon                           icon
 *     FormControlRadio                     formControlRadio
 *       TextLabel                          textLabel4
 *       Frame                              frame2
 *         FormControlRadioButtonControl    formControlRadioButtonControl    -> exportFontLinksYes
 *           InputRadioButton               inputRadioButton
 *           TextLabel                      textLabel5
 *         FormControlRadioButtonControl    formControlRadioButtonControl2   -> exportFontLinksNo
 *           InputRadioButton               inputRadioButton2
 *           TextLabel                      textLabel6
 *     Fieldset                             fieldset
 *       Legend                             legend
 *       FormControlRadio                   formControlRadio2
 *         TextLabel                        textLabel7
 *         Frame                            frame3
 *           FormControlRadioButtonControl  formControlRadioButtonControl3   -> exportHiddenYes
 *             InputRadioButton             inputRadioButton3
 *             TextLabel                    textLabel8
 *           FormControlRadioButtonControl  formControlRadioButtonControl4   -> exportHiddenNo
 *             InputRadioButton             inputRadioButton4
 *             TextLabel                    textLabel9
 *       FormControlRadio                   formControlRadio3
 *         TextLabel                        textLabel10
 *         Frame                            frame4
 *           FormControlRadioButtonControl  formControlRadioButtonControl5   -> exportAllThemesYes
 *             InputRadioButton             inputRadioButton5
 *             TextLabel                    textLabel11
 *           FormControlRadioButtonControl  formControlRadioButtonControl6   -> exportAllThemesNo
 *             InputRadioButton             inputRadioButton6
 *             TextLabel                    textLabel12
 *       FormControlRadio                   formControlRadio4
 *         TextLabel                        textLabel13
 *         Frame                            frame5
 *           FormControlRadioButtonControl  formControlRadioButtonControl7   -> exportAllFontsYes
 *             InputRadioButton             inputRadioButton7
 *             TextLabel                    textLabel14
 *           FormControlRadioButtonControl  formControlRadioButtonControl8   -> exportAllFontsNo
 *             InputRadioButton             inputRadioButton8
 *             TextLabel                    textLabel15
 *       FormControlRadio                   formControlRadio5
 *         TextLabel                        textLabel16
 *         Frame                            frame6
 *           FormControlRadioButtonControl  formControlRadioButtonControl9   -> exportAllIconsYes
 *             InputRadioButton             inputRadioButton9
 *             TextLabel                    textLabel17
 *           FormControlRadioButtonControl  formControlRadioButtonControl10  -> exportAllIconsNo
 *             InputRadioButton             inputRadioButton10
 *             TextLabel                    textLabel18
 *       FormControlRadio                   formControlRadio6
 *         TextLabel                        textLabel19
 *         Frame                            frame7
 *           FormControlRadioButtonControl  formControlRadioButtonControl11  -> exportSavedWorkspaceYes
 *             InputRadioButton             inputRadioButton11
 *             TextLabel                    textLabel20
 *           FormControlRadioButtonControl  formControlRadioButtonControl12  -> exportSavedWorkspaceNo
 *             InputRadioButton             inputRadioButton12
 *             TextLabel                    textLabel21
 *       FormControlRadio                   formControlRadio7
 *         TextLabel                        textLabel22
 *         Frame                            frame8
 *           FormControlRadioButtonControl  formControlRadioButtonControl13  -> exportScriptsYes
 *             InputRadioButton             inputRadioButton13
 *             TextLabel                    textLabel23
 *           FormControlRadioButtonControl  formControlRadioButtonControl14  -> exportScriptsNo
 *             InputRadioButton             inputRadioButton14
 *             TextLabel                    textLabel24
 *   BarButtons                             barButtons
 *     Button                               button                           -> exportCancel
 *       Icon                               icon2
 *       TextLabel                          textLabel25
 *     Button                               button2                          -> exportConfirm
 *       Icon                               icon3
 *       TextLabel                          textLabel26
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
 *   formControlRadioButtonControl="{}"
 *   inputRadioButton="{}"
 *   formControlRadioButtonControl2="{}"
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
  formControlRadioButtonControl,
  inputRadioButton,
  textLabel5,
  formControlRadioButtonControl2,
  inputRadioButton2,
  textLabel6,
  fieldset,
  legend,
  formControlRadio2,
  textLabel7,
  frame3,
  formControlRadioButtonControl3,
  inputRadioButton3,
  textLabel8,
  formControlRadioButtonControl4,
  inputRadioButton4,
  textLabel9,
  formControlRadio3,
  textLabel10,
  frame4,
  formControlRadioButtonControl5,
  inputRadioButton5,
  textLabel11,
  formControlRadioButtonControl6,
  inputRadioButton6,
  textLabel12,
  formControlRadio4,
  textLabel13,
  frame5,
  formControlRadioButtonControl7,
  inputRadioButton7,
  textLabel14,
  formControlRadioButtonControl8,
  inputRadioButton8,
  textLabel15,
  formControlRadio5,
  textLabel16,
  frame6,
  formControlRadioButtonControl9,
  inputRadioButton9,
  textLabel17,
  formControlRadioButtonControl10,
  inputRadioButton10,
  textLabel18,
  formControlRadio6,
  textLabel19,
  frame7,
  formControlRadioButtonControl11,
  inputRadioButton11,
  textLabel20,
  formControlRadioButtonControl12,
  inputRadioButton12,
  textLabel21,
  formControlRadio7,
  textLabel22,
  frame8,
  formControlRadioButtonControl13,
  inputRadioButton13,
  textLabel23,
  formControlRadioButtonControl14,
  inputRadioButton14,
  textLabel24,

  barButtons,
  button,
  icon2,
  textLabel25,
  button2,
  icon3,
  textLabel26,

  children,
  seldonRefs,
  ...props
}: DialogExportComponentProps) {
  const dialogExportComponentClassName = combineClassNames("sdn-dialog", className)

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
  const formControlRadioButtonControlProps = mergeOptionalSlot(
    sdn.formControlRadioButtonControl,
    formControlRadioButtonControl,
    seldonRefs,
  )
  const inputRadioButtonProps = mergeOptionalSlot(
    sdn.inputRadioButton,
    inputRadioButton,
    seldonRefs,
  )
  const textLabel5Props = mergeOptionalSlot(sdn.textLabel5, textLabel5, seldonRefs)
  const formControlRadioButtonControl2Props = mergeOptionalSlot(
    sdn.formControlRadioButtonControl2,
    formControlRadioButtonControl2,
    seldonRefs,
  )
  const inputRadioButton2Props = mergeOptionalSlot(
    sdn.inputRadioButton2,
    inputRadioButton2,
    seldonRefs,
  )
  const textLabel6Props = mergeOptionalSlot(sdn.textLabel6, textLabel6, seldonRefs)
  const fieldsetProps = mergeOptionalSlot(sdn.fieldset, fieldset, seldonRefs)
  const legendProps = mergeSlot(sdn.legend, legend, seldonRefs)
  const formControlRadio2Props = mergeSlot(sdn.formControlRadio2, formControlRadio2, seldonRefs)
  const textLabel7Props = mergeOptionalSlot(sdn.textLabel7, textLabel7, seldonRefs)
  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const formControlRadioButtonControl3Props = mergeOptionalSlot(
    sdn.formControlRadioButtonControl3,
    formControlRadioButtonControl3,
    seldonRefs,
  )
  const inputRadioButton3Props = mergeOptionalSlot(
    sdn.inputRadioButton3,
    inputRadioButton3,
    seldonRefs,
  )
  const textLabel8Props = mergeOptionalSlot(sdn.textLabel8, textLabel8, seldonRefs)
  const formControlRadioButtonControl4Props = mergeOptionalSlot(
    sdn.formControlRadioButtonControl4,
    formControlRadioButtonControl4,
    seldonRefs,
  )
  const inputRadioButton4Props = mergeOptionalSlot(
    sdn.inputRadioButton4,
    inputRadioButton4,
    seldonRefs,
  )
  const textLabel9Props = mergeOptionalSlot(sdn.textLabel9, textLabel9, seldonRefs)
  const formControlRadio3Props = mergeSlot(sdn.formControlRadio3, formControlRadio3, seldonRefs)
  const textLabel10Props = mergeOptionalSlot(sdn.textLabel10, textLabel10, seldonRefs)
  const frame4Props = mergeSlot(sdn.frame4, frame4, seldonRefs)
  const formControlRadioButtonControl5Props = mergeOptionalSlot(
    sdn.formControlRadioButtonControl5,
    formControlRadioButtonControl5,
    seldonRefs,
  )
  const inputRadioButton5Props = mergeOptionalSlot(
    sdn.inputRadioButton5,
    inputRadioButton5,
    seldonRefs,
  )
  const textLabel11Props = mergeOptionalSlot(sdn.textLabel11, textLabel11, seldonRefs)
  const formControlRadioButtonControl6Props = mergeOptionalSlot(
    sdn.formControlRadioButtonControl6,
    formControlRadioButtonControl6,
    seldonRefs,
  )
  const inputRadioButton6Props = mergeOptionalSlot(
    sdn.inputRadioButton6,
    inputRadioButton6,
    seldonRefs,
  )
  const textLabel12Props = mergeOptionalSlot(sdn.textLabel12, textLabel12, seldonRefs)
  const formControlRadio4Props = mergeOptionalSlot(
    sdn.formControlRadio4,
    formControlRadio4,
    seldonRefs,
  )
  const textLabel13Props = mergeOptionalSlot(sdn.textLabel13, textLabel13, seldonRefs)
  const frame5Props = mergeSlot(sdn.frame5, frame5, seldonRefs)
  const formControlRadioButtonControl7Props = mergeOptionalSlot(
    sdn.formControlRadioButtonControl7,
    formControlRadioButtonControl7,
    seldonRefs,
  )
  const inputRadioButton7Props = mergeOptionalSlot(
    sdn.inputRadioButton7,
    inputRadioButton7,
    seldonRefs,
  )
  const textLabel14Props = mergeOptionalSlot(sdn.textLabel14, textLabel14, seldonRefs)
  const formControlRadioButtonControl8Props = mergeOptionalSlot(
    sdn.formControlRadioButtonControl8,
    formControlRadioButtonControl8,
    seldonRefs,
  )
  const inputRadioButton8Props = mergeOptionalSlot(
    sdn.inputRadioButton8,
    inputRadioButton8,
    seldonRefs,
  )
  const textLabel15Props = mergeOptionalSlot(sdn.textLabel15, textLabel15, seldonRefs)
  const formControlRadio5Props = mergeOptionalSlot(
    sdn.formControlRadio5,
    formControlRadio5,
    seldonRefs,
  )
  const textLabel16Props = mergeOptionalSlot(sdn.textLabel16, textLabel16, seldonRefs)
  const frame6Props = mergeSlot(sdn.frame6, frame6, seldonRefs)
  const formControlRadioButtonControl9Props = mergeOptionalSlot(
    sdn.formControlRadioButtonControl9,
    formControlRadioButtonControl9,
    seldonRefs,
  )
  const inputRadioButton9Props = mergeOptionalSlot(
    sdn.inputRadioButton9,
    inputRadioButton9,
    seldonRefs,
  )
  const textLabel17Props = mergeOptionalSlot(sdn.textLabel17, textLabel17, seldonRefs)
  const formControlRadioButtonControl10Props = mergeOptionalSlot(
    sdn.formControlRadioButtonControl10,
    formControlRadioButtonControl10,
    seldonRefs,
  )
  const inputRadioButton10Props = mergeOptionalSlot(
    sdn.inputRadioButton10,
    inputRadioButton10,
    seldonRefs,
  )
  const textLabel18Props = mergeOptionalSlot(sdn.textLabel18, textLabel18, seldonRefs)
  const formControlRadio6Props = mergeOptionalSlot(
    sdn.formControlRadio6,
    formControlRadio6,
    seldonRefs,
  )
  const textLabel19Props = mergeOptionalSlot(sdn.textLabel19, textLabel19, seldonRefs)
  const frame7Props = mergeSlot(sdn.frame7, frame7, seldonRefs)
  const formControlRadioButtonControl11Props = mergeOptionalSlot(
    sdn.formControlRadioButtonControl11,
    formControlRadioButtonControl11,
    seldonRefs,
  )
  const inputRadioButton11Props = mergeOptionalSlot(
    sdn.inputRadioButton11,
    inputRadioButton11,
    seldonRefs,
  )
  const textLabel20Props = mergeOptionalSlot(sdn.textLabel20, textLabel20, seldonRefs)
  const formControlRadioButtonControl12Props = mergeOptionalSlot(
    sdn.formControlRadioButtonControl12,
    formControlRadioButtonControl12,
    seldonRefs,
  )
  const inputRadioButton12Props = mergeOptionalSlot(
    sdn.inputRadioButton12,
    inputRadioButton12,
    seldonRefs,
  )
  const textLabel21Props = mergeOptionalSlot(sdn.textLabel21, textLabel21, seldonRefs)
  const formControlRadio7Props = mergeOptionalSlot(
    sdn.formControlRadio7,
    formControlRadio7,
    seldonRefs,
  )
  const textLabel22Props = mergeOptionalSlot(sdn.textLabel22, textLabel22, seldonRefs)
  const frame8Props = mergeSlot(sdn.frame8, frame8, seldonRefs)
  const formControlRadioButtonControl13Props = mergeOptionalSlot(
    sdn.formControlRadioButtonControl13,
    formControlRadioButtonControl13,
    seldonRefs,
  )
  const inputRadioButton13Props = mergeOptionalSlot(
    sdn.inputRadioButton13,
    inputRadioButton13,
    seldonRefs,
  )
  const textLabel23Props = mergeOptionalSlot(sdn.textLabel23, textLabel23, seldonRefs)
  const formControlRadioButtonControl14Props = mergeOptionalSlot(
    sdn.formControlRadioButtonControl14,
    formControlRadioButtonControl14,
    seldonRefs,
  )
  const inputRadioButton14Props = mergeOptionalSlot(
    sdn.inputRadioButton14,
    inputRadioButton14,
    seldonRefs,
  )
  const textLabel24Props = mergeOptionalSlot(sdn.textLabel24, textLabel24, seldonRefs)

  const barButtonsProps = mergeSlot(sdn.barButtons, barButtons, seldonRefs)
  const buttonProps = mergeSlot(sdn.button, button, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)
  const textLabel25Props = mergeOptionalSlot(sdn.textLabel25, textLabel25, seldonRefs)
  const button2Props = mergeSlot(sdn.button2, button2, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)
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
                  {formControlRadioButtonControlProps !== null && (
                    <FormControlRadioButtonControl {...formControlRadioButtonControlProps}>
                      {inputRadioButtonProps !== null && (
                        <InputRadioButton {...inputRadioButtonProps} />
                      )}
                      {textLabel5Props !== null && <TextLabel {...textLabel5Props} />}
                    </FormControlRadioButtonControl>
                  )}
                  {formControlRadioButtonControl2Props !== null && (
                    <FormControlRadioButtonControl {...formControlRadioButtonControl2Props}>
                      {inputRadioButton2Props !== null && (
                        <InputRadioButton {...inputRadioButton2Props} />
                      )}
                      {textLabel6Props !== null && <TextLabel {...textLabel6Props} />}
                    </FormControlRadioButtonControl>
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
                      {formControlRadioButtonControl3Props !== null && (
                        <FormControlRadioButtonControl {...formControlRadioButtonControl3Props}>
                          {inputRadioButton3Props !== null && (
                            <InputRadioButton {...inputRadioButton3Props} />
                          )}
                          {textLabel8Props !== null && <TextLabel {...textLabel8Props} />}
                        </FormControlRadioButtonControl>
                      )}
                      {formControlRadioButtonControl4Props !== null && (
                        <FormControlRadioButtonControl {...formControlRadioButtonControl4Props}>
                          {inputRadioButton4Props !== null && (
                            <InputRadioButton {...inputRadioButton4Props} />
                          )}
                          {textLabel9Props !== null && <TextLabel {...textLabel9Props} />}
                        </FormControlRadioButtonControl>
                      )}
                    </Frame>
                  </FormControlRadio>
                )}
                {formControlRadio3Props !== null && (
                  <FormControlRadio {...formControlRadio3Props}>
                    {textLabel10Props !== null && <TextLabel {...textLabel10Props} />}
                    <Frame {...frame4Props}>
                      {formControlRadioButtonControl5Props !== null && (
                        <FormControlRadioButtonControl {...formControlRadioButtonControl5Props}>
                          {inputRadioButton5Props !== null && (
                            <InputRadioButton {...inputRadioButton5Props} />
                          )}
                          {textLabel11Props !== null && <TextLabel {...textLabel11Props} />}
                        </FormControlRadioButtonControl>
                      )}
                      {formControlRadioButtonControl6Props !== null && (
                        <FormControlRadioButtonControl {...formControlRadioButtonControl6Props}>
                          {inputRadioButton6Props !== null && (
                            <InputRadioButton {...inputRadioButton6Props} />
                          )}
                          {textLabel12Props !== null && <TextLabel {...textLabel12Props} />}
                        </FormControlRadioButtonControl>
                      )}
                    </Frame>
                  </FormControlRadio>
                )}
                {formControlRadio4Props !== null && (
                  <FormControlRadio {...formControlRadio4Props}>
                    {textLabel13Props !== null && <TextLabel {...textLabel13Props} />}
                    <Frame {...frame5Props}>
                      {formControlRadioButtonControl7Props !== null && (
                        <FormControlRadioButtonControl {...formControlRadioButtonControl7Props}>
                          {inputRadioButton7Props !== null && (
                            <InputRadioButton {...inputRadioButton7Props} />
                          )}
                          {textLabel14Props !== null && <TextLabel {...textLabel14Props} />}
                        </FormControlRadioButtonControl>
                      )}
                      {formControlRadioButtonControl8Props !== null && (
                        <FormControlRadioButtonControl {...formControlRadioButtonControl8Props}>
                          {inputRadioButton8Props !== null && (
                            <InputRadioButton {...inputRadioButton8Props} />
                          )}
                          {textLabel15Props !== null && <TextLabel {...textLabel15Props} />}
                        </FormControlRadioButtonControl>
                      )}
                    </Frame>
                  </FormControlRadio>
                )}
                {formControlRadio5Props !== null && (
                  <FormControlRadio {...formControlRadio5Props}>
                    {textLabel16Props !== null && <TextLabel {...textLabel16Props} />}
                    <Frame {...frame6Props}>
                      {formControlRadioButtonControl9Props !== null && (
                        <FormControlRadioButtonControl {...formControlRadioButtonControl9Props}>
                          {inputRadioButton9Props !== null && (
                            <InputRadioButton {...inputRadioButton9Props} />
                          )}
                          {textLabel17Props !== null && <TextLabel {...textLabel17Props} />}
                        </FormControlRadioButtonControl>
                      )}
                      {formControlRadioButtonControl10Props !== null && (
                        <FormControlRadioButtonControl {...formControlRadioButtonControl10Props}>
                          {inputRadioButton10Props !== null && (
                            <InputRadioButton {...inputRadioButton10Props} />
                          )}
                          {textLabel18Props !== null && <TextLabel {...textLabel18Props} />}
                        </FormControlRadioButtonControl>
                      )}
                    </Frame>
                  </FormControlRadio>
                )}
                {formControlRadio6Props !== null && (
                  <FormControlRadio {...formControlRadio6Props}>
                    {textLabel19Props !== null && <TextLabel {...textLabel19Props} />}
                    <Frame {...frame7Props}>
                      {formControlRadioButtonControl11Props !== null && (
                        <FormControlRadioButtonControl {...formControlRadioButtonControl11Props}>
                          {inputRadioButton11Props !== null && (
                            <InputRadioButton {...inputRadioButton11Props} />
                          )}
                          {textLabel20Props !== null && <TextLabel {...textLabel20Props} />}
                        </FormControlRadioButtonControl>
                      )}
                      {formControlRadioButtonControl12Props !== null && (
                        <FormControlRadioButtonControl {...formControlRadioButtonControl12Props}>
                          {inputRadioButton12Props !== null && (
                            <InputRadioButton {...inputRadioButton12Props} />
                          )}
                          {textLabel21Props !== null && <TextLabel {...textLabel21Props} />}
                        </FormControlRadioButtonControl>
                      )}
                    </Frame>
                  </FormControlRadio>
                )}
                {formControlRadio7Props !== null && (
                  <FormControlRadio {...formControlRadio7Props}>
                    {textLabel22Props !== null && <TextLabel {...textLabel22Props} />}
                    <Frame {...frame8Props}>
                      {formControlRadioButtonControl13Props !== null && (
                        <FormControlRadioButtonControl {...formControlRadioButtonControl13Props}>
                          {inputRadioButton13Props !== null && (
                            <InputRadioButton {...inputRadioButton13Props} />
                          )}
                          {textLabel23Props !== null && <TextLabel {...textLabel23Props} />}
                        </FormControlRadioButtonControl>
                      )}
                      {formControlRadioButtonControl14Props !== null && (
                        <FormControlRadioButtonControl {...formControlRadioButtonControl14Props}>
                          {inputRadioButton14Props !== null && (
                            <InputRadioButton {...inputRadioButton14Props} />
                          )}
                          {textLabel24Props !== null && <TextLabel {...textLabel24Props} />}
                        </FormControlRadioButtonControl>
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
              icon4={icon2Props}
              textLabel4={textLabel25Props}
              button5={button2Props}
              icon5={icon3Props}
              textLabel5={textLabel26Props}
            />
          )}
        </>
      )}
    </HTMLDiv>
  )
}
