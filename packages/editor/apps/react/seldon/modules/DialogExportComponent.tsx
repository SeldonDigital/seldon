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
import { Icon, IconProps } from "../primitives/Icon"
import { Input, InputProps } from "../primitives/Input"
import { TextDescription, TextDescriptionProps } from "../primitives/TextDescription"
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
  comboboxField?: ComboboxFieldProps | null
  input2?: InputProps | null
  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null
  formControlRadio?: FormControlRadioProps | null
  frame2?: FrameProps | null
  textLabel3?: TextLabelProps | null
  textDescription?: TextDescriptionProps | null
  frame3?: FrameProps | null
  menuItemRadio?: MenuItemRadioProps | null
  icon2?: IconProps | null
  textLabel4?: TextLabelProps | null
  menuItemRadio2?: MenuItemRadioProps | null
  icon3?: IconProps | null
  textLabel5?: TextLabelProps | null
  formControlRadio2?: FormControlRadioProps | null
  frame4?: FrameProps | null
  textLabel6?: TextLabelProps | null
  textDescription2?: TextDescriptionProps | null
  frame5?: FrameProps | null
  menuItemRadio3?: MenuItemRadioProps | null
  icon4?: IconProps | null
  textLabel7?: TextLabelProps | null
  menuItemRadio4?: MenuItemRadioProps | null
  icon5?: IconProps | null
  textLabel8?: TextLabelProps | null
  formControlRadio3?: FormControlRadioProps | null
  frame6?: FrameProps | null
  textLabel9?: TextLabelProps | null
  textDescription3?: TextDescriptionProps | null
  frame7?: FrameProps | null
  menuItemRadio5?: MenuItemRadioProps | null
  icon6?: IconProps | null
  textLabel10?: TextLabelProps | null
  menuItemRadio6?: MenuItemRadioProps | null
  icon7?: IconProps | null
  textLabel11?: TextLabelProps | null
  formControlRadio4?: FormControlRadioProps | null
  frame8?: FrameProps | null
  textLabel12?: TextLabelProps | null
  textDescription4?: TextDescriptionProps | null
  frame9?: FrameProps | null
  menuItemRadio7?: MenuItemRadioProps | null
  icon8?: IconProps | null
  textLabel13?: TextLabelProps | null
  menuItemRadio8?: MenuItemRadioProps | null
  icon9?: IconProps | null
  textLabel14?: TextLabelProps | null
  formControlRadio5?: FormControlRadioProps | null
  frame10?: FrameProps | null
  textLabel15?: TextLabelProps | null
  textDescription5?: TextDescriptionProps | null
  frame11?: FrameProps | null
  menuItemRadio9?: MenuItemRadioProps | null
  icon10?: IconProps | null
  textLabel16?: TextLabelProps | null
  menuItemRadio10?: MenuItemRadioProps | null
  icon11?: IconProps | null
  textLabel17?: TextLabelProps | null

  barButtons?: BarButtonsProps | null
  button?: ButtonProps | null
  icon12?: IconProps | null
  textLabel18?: TextLabelProps | null
  button2?: ButtonProps | null
  icon13?: IconProps | null
  textLabel19?: TextLabelProps | null
}

//
// Default property values
//
const sdn: DialogExportComponentProps = {
  "aria-hidden": "false",
  bar: {
    "aria-hidden": "false",
    className: "sdn-bar sdn-bar--zhvk",
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
    children: "Export to",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--l6fl",
  },
  input: {
    placeholder: "Placeholder text",
    type: "text",
    className: "sdn-input sdn-input--qirj",
    "data-seldon-ref": "exportRootPath",
  },
  formControl2: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--vmxp",
  },
  textLabel2: {
    children: "Platform",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--l6fl",
  },
  comboboxField: {
    "aria-hidden": "false",
    className: "sdn-combobox-field sdn-combobox-field--ull6",
  },
  input2: {
    placeholder: "Platform",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--twyx",
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
    className: "sdn-form-control sdn-form-control-radio--9dpd",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ejha",
  },
  textLabel3: {
    children: "Include Hidden Components",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s1qr",
  },
  textDescription: {
    children: "When enabled, components hidden with Exclude or Mock are also exported.",
    htmlElement: "p",
    "aria-hidden": "false",
    className: "sdn-text-description sdn-text-description--ljmd",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pwes",
  },
  menuItemRadio: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportHiddenYes",
  },
  icon2: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel4: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  menuItemRadio2: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportHiddenNo",
  },
  icon3: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel5: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  formControlRadio2: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio--9dpd",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ejha",
  },
  textLabel6: {
    children: "Include All Themes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s1qr",
  },
  textDescription2: {
    children: "Export all themes regardless if they are used in the workspace.",
    htmlElement: "p",
    "aria-hidden": "false",
    className: "sdn-text-description sdn-text-description--ljmd",
  },
  frame5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pwes",
  },
  menuItemRadio3: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportAllThemesYes",
  },
  icon4: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel7: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  menuItemRadio4: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportAllThemesNo",
  },
  icon5: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel8: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  formControlRadio3: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio--9dpd",
  },
  frame6: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ejha",
  },
  textLabel9: {
    children: "Include All Fonts",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s1qr",
  },
  textDescription3: {
    children: "Export all fonts regardless if they used in the workspace.",
    htmlElement: "p",
    "aria-hidden": "false",
    className: "sdn-text-description sdn-text-description--ljmd",
  },
  frame7: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pwes",
  },
  menuItemRadio5: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportAllFontsYes",
  },
  icon6: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel10: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  menuItemRadio6: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportAllFontsNo",
  },
  icon7: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel11: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  formControlRadio4: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio--9dpd",
  },
  frame8: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ejha",
  },
  textLabel12: {
    children: "Generate Font Links",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s1qr",
  },
  textDescription4: {
    children:
      "When enabled, add Google Fonts links, which makes requests to Google. When set to off, keep export request free.",
    htmlElement: "p",
    "aria-hidden": "false",
    className: "sdn-text-description sdn-text-description--ljmd",
  },
  frame9: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pwes",
  },
  menuItemRadio7: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportFontLinksYes",
  },
  icon8: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel13: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  menuItemRadio8: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportFontLinksNo",
  },
  icon9: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel14: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  formControlRadio5: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio--9dpd",
  },
  frame10: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ejha",
  },
  textLabel15: {
    children: "Include All Icons",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s1qr",
  },
  textDescription5: {
    children: "Export all icons regardless if they are used in the workspace.",
    htmlElement: "p",
    "aria-hidden": "false",
    className: "sdn-text-description sdn-text-description--ljmd",
  },
  frame11: {
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
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel16: {
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
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel17: {
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
  icon12: {
    icon: "seldon-none",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel18: {
    children: "Cancel",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button2: {
    className: "sdn-button sdn-button--upjl",
    "data-seldon-ref": "exportConfirm",
  },
  icon13: {
    icon: "material-save",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel19: {
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
  comboboxField,
  input2,
  buttonIconic,
  icon,
  formControlRadio,
  frame2,
  textLabel3,
  textDescription,
  frame3,
  menuItemRadio,
  icon2,
  textLabel4,
  menuItemRadio2,
  icon3,
  textLabel5,
  formControlRadio2,
  frame4,
  textLabel6,
  textDescription2,
  frame5,
  menuItemRadio3,
  icon4,
  textLabel7,
  menuItemRadio4,
  icon5,
  textLabel8,
  formControlRadio3,
  frame6,
  textLabel9,
  textDescription3,
  frame7,
  menuItemRadio5,
  icon6,
  textLabel10,
  menuItemRadio6,
  icon7,
  textLabel11,
  formControlRadio4,
  frame8,
  textLabel12,
  textDescription4,
  frame9,
  menuItemRadio7,
  icon8,
  textLabel13,
  menuItemRadio8,
  icon9,
  textLabel14,
  formControlRadio5,
  frame10,
  textLabel15,
  textDescription5,
  frame11,
  menuItemRadio9,
  icon10,
  textLabel16,
  menuItemRadio10,
  icon11,
  textLabel17,

  barButtons,
  button,
  icon12,
  textLabel18,
  button2,
  icon13,
  textLabel19,

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
  const comboboxFieldProps = mergeOptionalSlot(sdn.comboboxField, comboboxField, seldonRefs)
  const input2Props = mergeSlot(sdn.input2, input2, seldonRefs)
  const buttonIconicProps = mergeSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const formControlRadioProps = mergeOptionalSlot(
    sdn.formControlRadio,
    formControlRadio,
    seldonRefs,
  )
  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)
  const textDescriptionProps = mergeOptionalSlot(sdn.textDescription, textDescription, seldonRefs)
  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const menuItemRadioProps = mergeOptionalSlot(sdn.menuItemRadio, menuItemRadio, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)
  const textLabel4Props = mergeOptionalSlot(sdn.textLabel4, textLabel4, seldonRefs)
  const menuItemRadio2Props = mergeOptionalSlot(sdn.menuItemRadio2, menuItemRadio2, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)
  const textLabel5Props = mergeOptionalSlot(sdn.textLabel5, textLabel5, seldonRefs)
  const formControlRadio2Props = mergeOptionalSlot(
    sdn.formControlRadio2,
    formControlRadio2,
    seldonRefs,
  )
  const frame4Props = mergeSlot(sdn.frame4, frame4, seldonRefs)
  const textLabel6Props = mergeOptionalSlot(sdn.textLabel6, textLabel6, seldonRefs)
  const textDescription2Props = mergeOptionalSlot(
    sdn.textDescription2,
    textDescription2,
    seldonRefs,
  )
  const frame5Props = mergeSlot(sdn.frame5, frame5, seldonRefs)
  const menuItemRadio3Props = mergeOptionalSlot(sdn.menuItemRadio3, menuItemRadio3, seldonRefs)
  const icon4Props = mergeSlot(sdn.icon4, icon4, seldonRefs)
  const textLabel7Props = mergeOptionalSlot(sdn.textLabel7, textLabel7, seldonRefs)
  const menuItemRadio4Props = mergeOptionalSlot(sdn.menuItemRadio4, menuItemRadio4, seldonRefs)
  const icon5Props = mergeSlot(sdn.icon5, icon5, seldonRefs)
  const textLabel8Props = mergeOptionalSlot(sdn.textLabel8, textLabel8, seldonRefs)
  const formControlRadio3Props = mergeOptionalSlot(
    sdn.formControlRadio3,
    formControlRadio3,
    seldonRefs,
  )
  const frame6Props = mergeSlot(sdn.frame6, frame6, seldonRefs)
  const textLabel9Props = mergeOptionalSlot(sdn.textLabel9, textLabel9, seldonRefs)
  const textDescription3Props = mergeOptionalSlot(
    sdn.textDescription3,
    textDescription3,
    seldonRefs,
  )
  const frame7Props = mergeSlot(sdn.frame7, frame7, seldonRefs)
  const menuItemRadio5Props = mergeOptionalSlot(sdn.menuItemRadio5, menuItemRadio5, seldonRefs)
  const icon6Props = mergeSlot(sdn.icon6, icon6, seldonRefs)
  const textLabel10Props = mergeOptionalSlot(sdn.textLabel10, textLabel10, seldonRefs)
  const menuItemRadio6Props = mergeOptionalSlot(sdn.menuItemRadio6, menuItemRadio6, seldonRefs)
  const icon7Props = mergeSlot(sdn.icon7, icon7, seldonRefs)
  const textLabel11Props = mergeOptionalSlot(sdn.textLabel11, textLabel11, seldonRefs)
  const formControlRadio4Props = mergeOptionalSlot(
    sdn.formControlRadio4,
    formControlRadio4,
    seldonRefs,
  )
  const frame8Props = mergeSlot(sdn.frame8, frame8, seldonRefs)
  const textLabel12Props = mergeOptionalSlot(sdn.textLabel12, textLabel12, seldonRefs)
  const textDescription4Props = mergeOptionalSlot(
    sdn.textDescription4,
    textDescription4,
    seldonRefs,
  )
  const frame9Props = mergeSlot(sdn.frame9, frame9, seldonRefs)
  const menuItemRadio7Props = mergeOptionalSlot(sdn.menuItemRadio7, menuItemRadio7, seldonRefs)
  const icon8Props = mergeSlot(sdn.icon8, icon8, seldonRefs)
  const textLabel13Props = mergeOptionalSlot(sdn.textLabel13, textLabel13, seldonRefs)
  const menuItemRadio8Props = mergeOptionalSlot(sdn.menuItemRadio8, menuItemRadio8, seldonRefs)
  const icon9Props = mergeSlot(sdn.icon9, icon9, seldonRefs)
  const textLabel14Props = mergeOptionalSlot(sdn.textLabel14, textLabel14, seldonRefs)
  const formControlRadio5Props = mergeOptionalSlot(
    sdn.formControlRadio5,
    formControlRadio5,
    seldonRefs,
  )
  const frame10Props = mergeSlot(sdn.frame10, frame10, seldonRefs)
  const textLabel15Props = mergeOptionalSlot(sdn.textLabel15, textLabel15, seldonRefs)
  const textDescription5Props = mergeOptionalSlot(
    sdn.textDescription5,
    textDescription5,
    seldonRefs,
  )
  const frame11Props = mergeSlot(sdn.frame11, frame11, seldonRefs)
  const menuItemRadio9Props = mergeOptionalSlot(sdn.menuItemRadio9, menuItemRadio9, seldonRefs)
  const icon10Props = mergeSlot(sdn.icon10, icon10, seldonRefs)
  const textLabel16Props = mergeOptionalSlot(sdn.textLabel16, textLabel16, seldonRefs)
  const menuItemRadio10Props = mergeOptionalSlot(sdn.menuItemRadio10, menuItemRadio10, seldonRefs)
  const icon11Props = mergeSlot(sdn.icon11, icon11, seldonRefs)
  const textLabel17Props = mergeOptionalSlot(sdn.textLabel17, textLabel17, seldonRefs)

  const barButtonsProps = mergeSlot(sdn.barButtons, barButtons, seldonRefs)
  const buttonProps = mergeSlot(sdn.button, button, seldonRefs)
  const icon12Props = mergeSlot(sdn.icon12, icon12, seldonRefs)
  const textLabel18Props = mergeOptionalSlot(sdn.textLabel18, textLabel18, seldonRefs)
  const button2Props = mergeSlot(sdn.button2, button2, seldonRefs)
  const icon13Props = mergeSlot(sdn.icon13, icon13, seldonRefs)
  const textLabel19Props = mergeOptionalSlot(sdn.textLabel19, textLabel19, seldonRefs)

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
                {comboboxFieldProps !== null && (
                  <ComboboxField
                    {...comboboxFieldProps}
                    input={input2Props}
                    buttonIconic={buttonIconicProps}
                    icon2={iconProps}
                    icon={null}
                  />
                )}
              </FormControl>
            )}
            {formControlRadioProps !== null && (
              <FormControlRadio {...formControlRadioProps}>
                <Frame {...frame2Props}>
                  {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
                  {textDescriptionProps !== null && <TextDescription {...textDescriptionProps} />}
                </Frame>
                <Frame {...frame3Props}>
                  {menuItemRadioProps !== null && (
                    <MenuItemRadio {...menuItemRadioProps}>
                      {icon2Props !== null && <Icon {...icon2Props} />}
                      {textLabel4Props !== null && <TextLabel {...textLabel4Props} />}
                    </MenuItemRadio>
                  )}
                  {menuItemRadio2Props !== null && (
                    <MenuItemRadio {...menuItemRadio2Props}>
                      {icon3Props !== null && <Icon {...icon3Props} />}
                      {textLabel5Props !== null && <TextLabel {...textLabel5Props} />}
                    </MenuItemRadio>
                  )}
                </Frame>
              </FormControlRadio>
            )}
            {formControlRadio2Props !== null && (
              <FormControlRadio {...formControlRadio2Props}>
                <Frame {...frame4Props}>
                  {textLabel6Props !== null && <TextLabel {...textLabel6Props} />}
                  {textDescription2Props !== null && <TextDescription {...textDescription2Props} />}
                </Frame>
                <Frame {...frame5Props}>
                  {menuItemRadio3Props !== null && (
                    <MenuItemRadio {...menuItemRadio3Props}>
                      {icon4Props !== null && <Icon {...icon4Props} />}
                      {textLabel7Props !== null && <TextLabel {...textLabel7Props} />}
                    </MenuItemRadio>
                  )}
                  {menuItemRadio4Props !== null && (
                    <MenuItemRadio {...menuItemRadio4Props}>
                      {icon5Props !== null && <Icon {...icon5Props} />}
                      {textLabel8Props !== null && <TextLabel {...textLabel8Props} />}
                    </MenuItemRadio>
                  )}
                </Frame>
              </FormControlRadio>
            )}
            {formControlRadio3Props !== null && (
              <FormControlRadio {...formControlRadio3Props}>
                <Frame {...frame6Props}>
                  {textLabel9Props !== null && <TextLabel {...textLabel9Props} />}
                  {textDescription3Props !== null && <TextDescription {...textDescription3Props} />}
                </Frame>
                <Frame {...frame7Props}>
                  {menuItemRadio5Props !== null && (
                    <MenuItemRadio {...menuItemRadio5Props}>
                      {icon6Props !== null && <Icon {...icon6Props} />}
                      {textLabel10Props !== null && <TextLabel {...textLabel10Props} />}
                    </MenuItemRadio>
                  )}
                  {menuItemRadio6Props !== null && (
                    <MenuItemRadio {...menuItemRadio6Props}>
                      {icon7Props !== null && <Icon {...icon7Props} />}
                      {textLabel11Props !== null && <TextLabel {...textLabel11Props} />}
                    </MenuItemRadio>
                  )}
                </Frame>
              </FormControlRadio>
            )}
            {formControlRadio4Props !== null && (
              <FormControlRadio {...formControlRadio4Props}>
                <Frame {...frame8Props}>
                  {textLabel12Props !== null && <TextLabel {...textLabel12Props} />}
                  {textDescription4Props !== null && <TextDescription {...textDescription4Props} />}
                </Frame>
                <Frame {...frame9Props}>
                  {menuItemRadio7Props !== null && (
                    <MenuItemRadio {...menuItemRadio7Props}>
                      {icon8Props !== null && <Icon {...icon8Props} />}
                      {textLabel13Props !== null && <TextLabel {...textLabel13Props} />}
                    </MenuItemRadio>
                  )}
                  {menuItemRadio8Props !== null && (
                    <MenuItemRadio {...menuItemRadio8Props}>
                      {icon9Props !== null && <Icon {...icon9Props} />}
                      {textLabel14Props !== null && <TextLabel {...textLabel14Props} />}
                    </MenuItemRadio>
                  )}
                </Frame>
              </FormControlRadio>
            )}
            {formControlRadio5Props !== null && (
              <FormControlRadio {...formControlRadio5Props}>
                <Frame {...frame10Props}>
                  {textLabel15Props !== null && <TextLabel {...textLabel15Props} />}
                  {textDescription5Props !== null && <TextDescription {...textDescription5Props} />}
                </Frame>
                <Frame {...frame11Props}>
                  {menuItemRadio9Props !== null && (
                    <MenuItemRadio {...menuItemRadio9Props}>
                      {icon10Props !== null && <Icon {...icon10Props} />}
                      {textLabel16Props !== null && <TextLabel {...textLabel16Props} />}
                    </MenuItemRadio>
                  )}
                  {menuItemRadio10Props !== null && (
                    <MenuItemRadio {...menuItemRadio10Props}>
                      {icon11Props !== null && <Icon {...icon11Props} />}
                      {textLabel17Props !== null && <TextLabel {...textLabel17Props} />}
                    </MenuItemRadio>
                  )}
                </Frame>
              </FormControlRadio>
            )}
          </Frame>
          {barButtonsProps !== null && (
            <BarButtons
              {...barButtonsProps}
              button4={buttonProps}
              icon4={icon12Props}
              textLabel4={textLabel18Props}
              button5={button2Props}
              icon5={icon13Props}
              textLabel5={textLabel19Props}
            />
          )}
        </>
      )}
    </HTMLDiv>
  )
}
