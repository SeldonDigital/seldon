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
import { Avatar } from "../elements/Avatar"
import { ButtonSimple } from "../elements/ButtonSimple"
import { Chip } from "../elements/Chip"
import { ComboboxField } from "../elements/ComboboxField"
import { FormControl } from "../elements/FormControl"
import { FormControlRadio } from "../elements/FormControlRadio"
import { FormControlRadioButtonControl } from "../elements/FormControlRadioButtonControl"
import { Frame } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { ArticleCard } from "../parts/ArticleCard"
import { Bar } from "../parts/Bar"
import { BarButtons } from "../parts/BarButtons"
import { Fieldset } from "../parts/Fieldset"
import { Image } from "../primitives/Image"
import { Input } from "../primitives/Input"
import { InputRadioButton } from "../primitives/InputRadioButton"
import { Legend } from "../primitives/Legend"
import { TextDescription } from "../primitives/TextDescription"
import { TextHeading } from "../primitives/TextHeading"
import { TextLabel } from "../primitives/TextLabel"
import { TextTitle } from "../primitives/TextTitle"
import { combineClassNames } from "../utils/class-name"
import { mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

import type { AvatarProps } from "../elements/Avatar"
import type { ButtonProps } from "../elements/Button"
import type { ButtonIconicProps } from "../elements/ButtonIconic"
import type { ButtonSimpleProps } from "../elements/ButtonSimple"
import type { ChipProps } from "../elements/Chip"
import type { ComboboxFieldProps } from "../elements/ComboboxField"
import type { FormControlProps } from "../elements/FormControl"
import type { FormControlRadioProps } from "../elements/FormControlRadio"
import type { FormControlRadioButtonControlProps } from "../elements/FormControlRadioButtonControl"
import type { FrameProps } from "../frames/Frame"
import type { ArticleCardProps } from "../parts/ArticleCard"
import type { BarProps } from "../parts/Bar"
import type { BarButtonsProps } from "../parts/BarButtons"
import type { FieldsetProps } from "../parts/Fieldset"
import type { IconProps } from "../primitives/Icon"
import type { ImageProps } from "../primitives/Image"
import type { InputProps } from "../primitives/Input"
import type { InputRadioButtonProps } from "../primitives/InputRadioButton"
import type { LegendProps } from "../primitives/Legend"
import type { TextDescriptionProps } from "../primitives/TextDescription"
import type { TextHeadingProps } from "../primitives/TextHeading"
import type { TextLabelProps } from "../primitives/TextLabel"
import type { TextTitleProps } from "../primitives/TextTitle"
import type { SeldonRefs } from "../utils/merge-slot"
import type { HTMLAttributes } from "react"

export interface DialogExportComponentProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  bar?: BarProps | null
  textTitle?: TextTitleProps | null

  frame?: FrameProps | null
  articleCard?: ArticleCardProps | null
  image?: ImageProps | null
  frame2?: FrameProps | null
  chip?: ChipProps | null
  textLabel?: TextLabelProps | null
  textHeading?: TextHeadingProps | null
  textDescription?: TextDescriptionProps | null
  frame3?: FrameProps | null
  avatar?: AvatarProps | null
  image2?: ImageProps | null
  frame4?: FrameProps | null
  textLabel2?: TextLabelProps | null
  textLabel3?: TextLabelProps | null
  buttonSimple?: ButtonSimpleProps | null
  textLabel4?: TextLabelProps | null
  formControl?: FormControlProps | null
  textLabel5?: TextLabelProps | null
  input?: InputProps | null
  formControl2?: FormControlProps | null
  textLabel6?: TextLabelProps | null
  comboboxField?: ComboboxFieldProps | null
  input2?: InputProps | null
  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null
  formControl3?: FormControlProps | null
  textLabel7?: TextLabelProps | null
  comboboxField2?: ComboboxFieldProps | null
  input3?: InputProps | null
  buttonIconic2?: ButtonIconicProps | null
  icon2?: IconProps | null
  formControl4?: FormControlProps | null
  textLabel8?: TextLabelProps | null
  input4?: InputProps | null
  formControlRadio?: FormControlRadioProps | null
  textLabel9?: TextLabelProps | null
  frame5?: FrameProps | null
  formControlRadioButtonControl?: FormControlRadioButtonControlProps | null
  inputRadioButton?: InputRadioButtonProps | null
  textLabel10?: TextLabelProps | null
  formControlRadioButtonControl2?: FormControlRadioButtonControlProps | null
  inputRadioButton2?: InputRadioButtonProps | null
  textLabel11?: TextLabelProps | null
  fieldset?: FieldsetProps | null
  legend?: LegendProps | null
  formControlRadio2?: FormControlRadioProps | null
  textLabel12?: TextLabelProps | null
  frame6?: FrameProps | null
  formControlRadioButtonControl3?: FormControlRadioButtonControlProps | null
  inputRadioButton3?: InputRadioButtonProps | null
  textLabel13?: TextLabelProps | null
  formControlRadioButtonControl4?: FormControlRadioButtonControlProps | null
  inputRadioButton4?: InputRadioButtonProps | null
  textLabel14?: TextLabelProps | null
  formControlRadio3?: FormControlRadioProps | null
  textLabel15?: TextLabelProps | null
  frame7?: FrameProps | null
  formControlRadioButtonControl5?: FormControlRadioButtonControlProps | null
  inputRadioButton5?: InputRadioButtonProps | null
  textLabel16?: TextLabelProps | null
  formControlRadioButtonControl6?: FormControlRadioButtonControlProps | null
  inputRadioButton6?: InputRadioButtonProps | null
  textLabel17?: TextLabelProps | null
  formControlRadio4?: FormControlRadioProps | null
  textLabel18?: TextLabelProps | null
  frame8?: FrameProps | null
  formControlRadioButtonControl7?: FormControlRadioButtonControlProps | null
  inputRadioButton7?: InputRadioButtonProps | null
  textLabel19?: TextLabelProps | null
  formControlRadioButtonControl8?: FormControlRadioButtonControlProps | null
  inputRadioButton8?: InputRadioButtonProps | null
  textLabel20?: TextLabelProps | null
  formControlRadio5?: FormControlRadioProps | null
  textLabel21?: TextLabelProps | null
  frame9?: FrameProps | null
  formControlRadioButtonControl9?: FormControlRadioButtonControlProps | null
  inputRadioButton9?: InputRadioButtonProps | null
  textLabel22?: TextLabelProps | null
  formControlRadioButtonControl10?: FormControlRadioButtonControlProps | null
  inputRadioButton10?: InputRadioButtonProps | null
  textLabel23?: TextLabelProps | null
  formControlRadio6?: FormControlRadioProps | null
  textLabel24?: TextLabelProps | null
  frame10?: FrameProps | null
  formControlRadioButtonControl11?: FormControlRadioButtonControlProps | null
  inputRadioButton11?: InputRadioButtonProps | null
  textLabel25?: TextLabelProps | null
  formControlRadioButtonControl12?: FormControlRadioButtonControlProps | null
  inputRadioButton12?: InputRadioButtonProps | null
  textLabel26?: TextLabelProps | null
  formControlRadio7?: FormControlRadioProps | null
  textLabel27?: TextLabelProps | null
  frame11?: FrameProps | null
  formControlRadioButtonControl13?: FormControlRadioButtonControlProps | null
  inputRadioButton13?: InputRadioButtonProps | null
  textLabel28?: TextLabelProps | null
  formControlRadioButtonControl14?: FormControlRadioButtonControlProps | null
  inputRadioButton14?: InputRadioButtonProps | null
  textLabel29?: TextLabelProps | null

  barButtons?: BarButtonsProps | null
  button?: ButtonProps | null
  icon3?: IconProps | null
  textLabel30?: TextLabelProps | null
  button2?: ButtonProps | null
  icon4?: IconProps | null
  textLabel31?: TextLabelProps | null
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
    "data-seldon-ref": "exportTitle",
  },

  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--q7m7",
    "data-seldon-ref": "exportComponentsOptions",
  },
  articleCard: {
    "aria-hidden": "false",
    className: "sdn-article-card sdn-article-card--z7hy",
  },
  image: {
    src: "/sdn/assets/background-default-light.jpg",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--yoiz",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--f3ng",
  },
  chip: {
    "aria-hidden": "false",
    className: "sdn-chip sdn-chip--jsvs",
  },
  textLabel: {
    children: "Design",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--lug5",
  },
  textHeading: {
    children: "How to design better cards",
    htmlElement: "h2",
    "aria-hidden": "false",
    className: "sdn-text-heading sdn-text-heading--q8wa",
  },
  textDescription: {
    children:
      "A short, two-line excerpt written for the card earns the click without giving everything away.",
    htmlElement: "p",
    "aria-hidden": "false",
    className: "sdn-text-description sdn-text-description--lwq7",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ts0m",
  },
  avatar: {
    "aria-hidden": "false",
    className: "sdn-avatar sdn-avatar-rounded--fb5j",
  },
  image2: {
    src: "/avatar-bentley.png",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--to5v",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--yuto",
  },
  textLabel2: {
    children: "Sir Bentley",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--idib",
  },
  textLabel3: {
    children: "Mar 30 · 5 min read",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-subheading--bxdp",
  },
  buttonSimple: {
    className: "sdn-button-simple sdn-button-simple--ldcn",
  },
  textLabel4: {
    children: "Read more",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--tge3",
  },
  formControl: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--vmxp",
    "data-seldon-ref": "exportWorkspaceName",
  },
  textLabel5: {
    children: "Workspace Name",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--l6fl",
    "data-seldon-ref": "exportWorkspaceNameLabel",
  },
  input: {
    placeholder: "Placeholder text",
    type: "text",
    className: "sdn-input sdn-input--j1ro",
    "data-seldon-ref": "exportWorkspaceNameField",
  },
  formControl2: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--vmxp",
    "data-seldon-ref": "exportFramework",
  },
  textLabel6: {
    children: "Framework",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--l6fl",
    "data-seldon-ref": "exportFrameworkLabel",
  },
  comboboxField: {
    "aria-hidden": "false",
    className: "sdn-combobox-field sdn-combobox-field--zfi3",
    "data-seldon-ref": "exportFrameworkCombobox",
  },
  input2: {
    placeholder: "Placeholder",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--pzcf",
    "data-seldon-ref": "exportFrameworkField",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon: {
    icon: "material-keyboardArrowDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  formControl3: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--vmxp",
    "data-seldon-ref": "exportPlatform",
  },
  textLabel7: {
    children: "Platform",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--l6fl",
    "data-seldon-ref": "exportPlatformLabel",
  },
  comboboxField2: {
    "aria-hidden": "false",
    className: "sdn-combobox-field sdn-combobox-field--zfi3",
    "data-seldon-ref": "exportPlatformCombobox",
  },
  input3: {
    placeholder: "Placeholder",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--pzcf",
    "data-seldon-ref": "exportPlatformField",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon2: {
    icon: "material-keyboardArrowDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  formControl4: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--vmxp",
    "data-seldon-ref": "exportProjectFolder",
  },
  textLabel8: {
    children: "Project Folder",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--l6fl",
    "data-seldon-ref": "exportProjectFolderLabel",
  },
  input4: {
    placeholder: "Placeholder text",
    type: "text",
    className: "sdn-input sdn-input--j1ro",
    "data-seldon-ref": "exportProjectFolderField",
  },
  formControlRadio: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio--4pts",
    "data-seldon-ref": "exportFontLinks",
  },
  textLabel9: {
    children: "Generate Google Font API Links",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--l6fl",
    "data-seldon-ref": "exportFontLinksLabel",
  },
  frame5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--scn7",
    "data-seldon-ref": "exportFontLinksRadios",
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
    "data-seldon-ref": "exportFontLinksYesInput",
  },
  textLabel10: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--uqg6",
    "data-seldon-ref": "exportFontLinksYesText",
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
    "data-seldon-ref": "exportFontLinksNoInput",
  },
  textLabel11: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--uqg6",
    "data-seldon-ref": "exportFontLinksNoText",
  },
  fieldset: {
    "aria-hidden": "false",
    className: "sdn-fieldset sdn-fieldset--6n0c",
    "data-seldon-ref": "exportFieldset",
  },
  legend: {
    children: "Include",
    "aria-hidden": "false",
    className: "sdn-legend sdn-legend--btym",
    "data-seldon-ref": "exportFieldsetLabel",
  },
  formControlRadio2: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio--9dpd",
    "data-seldon-ref": "exportHidden",
  },
  textLabel12: {
    children: "Hidden Components",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s1qr",
    "data-seldon-ref": "exportHiddenLabel",
  },
  frame6: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pwes",
    "data-seldon-ref": "exportHiddenRadios",
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
    "data-seldon-ref": "exportHiddenYesInput",
  },
  textLabel13: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--uqg6",
    "data-seldon-ref": "exportHiddenYesText",
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
    "data-seldon-ref": "exportHiddenNoInput",
  },
  textLabel14: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--uqg6",
    "data-seldon-ref": "exportHiddenNoText",
  },
  formControlRadio3: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio--9dpd",
    "data-seldon-ref": "exportAllThemes",
  },
  textLabel15: {
    children: "All Themes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s1qr",
    "data-seldon-ref": "exportAllThemesLabel",
  },
  frame7: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pwes",
    "data-seldon-ref": "exportAllThemesRadios",
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
    "data-seldon-ref": "exportAllThemesYesInput",
  },
  textLabel16: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--uqg6",
    "data-seldon-ref": "exportAllThemesYesText",
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
    "data-seldon-ref": "exportAllThemesNoInput",
  },
  textLabel17: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--uqg6",
    "data-seldon-ref": "exportAllThemesNoText",
  },
  formControlRadio4: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio--9dpd",
    "data-seldon-ref": "exportAllFonts",
  },
  textLabel18: {
    children: "All Fonts",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s1qr",
    "data-seldon-ref": "exportAllFontsLabel",
  },
  frame8: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pwes",
    "data-seldon-ref": "exportAllFontsRadios",
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
    "data-seldon-ref": "exportAllFontsYesInput",
  },
  textLabel19: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--uqg6",
    "data-seldon-ref": "exportAllFontsYesText",
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
    "data-seldon-ref": "exportAllFontsNoInput",
  },
  textLabel20: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--uqg6",
    "data-seldon-ref": "exportAllFontsNoText",
  },
  formControlRadio5: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio--9dpd",
    "data-seldon-ref": "exportAllIcons",
  },
  textLabel21: {
    children: "All Enabled Icons",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s1qr",
    "data-seldon-ref": "exportAllIconsLabel",
  },
  frame9: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pwes",
    "data-seldon-ref": "exportAllIconsRadios",
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
    "data-seldon-ref": "exportAllIconsYesInput",
  },
  textLabel22: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--uqg6",
    "data-seldon-ref": "exportAllIconsYesText",
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
    "data-seldon-ref": "exportAllIconsNoInput",
  },
  textLabel23: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--uqg6",
    "data-seldon-ref": "exportAllIconsNoText",
  },
  formControlRadio6: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio--9dpd",
    "data-seldon-ref": "exportWorkspace",
  },
  textLabel24: {
    children: "Workspace File",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s1qr",
    "data-seldon-ref": "exportWorkspaceLabel",
  },
  frame10: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pwes",
    "data-seldon-ref": "exportWorkspaceRadios",
  },
  formControlRadioButtonControl11: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio-button-control--0acl",
    "data-seldon-ref": "exportWorkspaceYes",
  },
  inputRadioButton11: {
    placeholder: "Placeholder text",
    type: "radio",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
    "data-seldon-ref": "exportWorkspaceYesInput",
  },
  textLabel25: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--uqg6",
    "data-seldon-ref": "exportWorkspaceYesText",
  },
  formControlRadioButtonControl12: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio-button-control--0acl",
    "data-seldon-ref": "exportWorkspaceNo",
  },
  inputRadioButton12: {
    placeholder: "Placeholder text",
    type: "radio",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
    "data-seldon-ref": "exportWorkspaceNoInput",
  },
  textLabel26: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--uqg6",
    "data-seldon-ref": "exportWorkspaceNoText",
  },
  formControlRadio7: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio--9dpd",
    "data-seldon-ref": "exportScripts",
  },
  textLabel27: {
    children: "CLI Utility Scripts",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s1qr",
    "data-seldon-ref": "exportScriptsLabel",
  },
  frame11: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pwes",
    "data-seldon-ref": "exportScriptsRadios",
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
    "data-seldon-ref": "exportScriptsYesInput",
  },
  textLabel28: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--uqg6",
    "data-seldon-ref": "exportScriptsYesText",
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
    "data-seldon-ref": "exportScriptsNoInput",
  },
  textLabel29: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--uqg6",
    "data-seldon-ref": "exportScriptsNoText",
  },

  barButtons: {
    "aria-hidden": "false",
    className: "sdn-bar-buttons sdn-bar-buttons--36qz",
  },
  button: {
    className: "sdn-button sdn-button--wjtm",
    "data-seldon-ref": "exportCancel",
  },
  icon3: {
    icon: "seldon-none",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel30: {
    children: "Cancel",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--wxqf",
    "data-seldon-ref": "exportCancelLabel",
  },
  button2: {
    className: "sdn-button sdn-button--wjtm",
    "data-seldon-ref": "exportConfirm",
  },
  icon4: {
    icon: "material-save",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel31: {
    children: "Export",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--wxqf",
    "data-seldon-ref": "exportConfirmLabel",
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
 *     TextTitle                            textTitle                        -> exportTitle
 *   Frame                                  frame                            -> exportComponentsOptions
 *     ArticleCard                          articleCard
 *       Image                              image
 *       Frame                              frame2
 *         Chip                             chip
 *           TextLabel                      textLabel
 *         TextHeading                      textHeading
 *         TextDescription                  textDescription
 *         Frame                            frame3
 *           Avatar                         avatar
 *             Image                        image2
 *           Frame                          frame4
 *             TextLabel                    textLabel2
 *             TextLabel                    textLabel3
 *           ButtonSimple                   buttonSimple
 *             TextLabel                    textLabel4
 *     FormControl                          formControl                      -> exportWorkspaceName
 *       TextLabel                          textLabel5                       -> exportWorkspaceNameLabel
 *       Input                              input                            -> exportWorkspaceNameField
 *     FormControl                          formControl2                     -> exportFramework
 *       TextLabel                          textLabel6                       -> exportFrameworkLabel
 *       ComboboxField                      comboboxField                    -> exportFrameworkCombobox
 *         Input                            input2                           -> exportFrameworkField
 *         ButtonIconic                     buttonIconic
 *           Icon                           icon
 *     FormControl                          formControl3                     -> exportPlatform
 *       TextLabel                          textLabel7                       -> exportPlatformLabel
 *       ComboboxField                      comboboxField2                   -> exportPlatformCombobox
 *         Input                            input3                           -> exportPlatformField
 *         ButtonIconic                     buttonIconic2
 *           Icon                           icon2
 *     FormControl                          formControl4                     -> exportProjectFolder
 *       TextLabel                          textLabel8                       -> exportProjectFolderLabel
 *       Input                              input4                           -> exportProjectFolderField
 *     FormControlRadio                     formControlRadio                 -> exportFontLinks
 *       TextLabel                          textLabel9                       -> exportFontLinksLabel
 *       Frame                              frame5                           -> exportFontLinksRadios
 *         FormControlRadioButtonControl    formControlRadioButtonControl    -> exportFontLinksYes
 *           InputRadioButton               inputRadioButton                 -> exportFontLinksYesInput
 *           TextLabel                      textLabel10                      -> exportFontLinksYesText
 *         FormControlRadioButtonControl    formControlRadioButtonControl2   -> exportFontLinksNo
 *           InputRadioButton               inputRadioButton2                -> exportFontLinksNoInput
 *           TextLabel                      textLabel11                      -> exportFontLinksNoText
 *     Fieldset                             fieldset                         -> exportFieldset
 *       Legend                             legend                           -> exportFieldsetLabel
 *       FormControlRadio                   formControlRadio2                -> exportHidden
 *         TextLabel                        textLabel12                      -> exportHiddenLabel
 *         Frame                            frame6                           -> exportHiddenRadios
 *           FormControlRadioButtonControl  formControlRadioButtonControl3   -> exportHiddenYes
 *             InputRadioButton             inputRadioButton3                -> exportHiddenYesInput
 *             TextLabel                    textLabel13                      -> exportHiddenYesText
 *           FormControlRadioButtonControl  formControlRadioButtonControl4   -> exportHiddenNo
 *             InputRadioButton             inputRadioButton4                -> exportHiddenNoInput
 *             TextLabel                    textLabel14                      -> exportHiddenNoText
 *       FormControlRadio                   formControlRadio3                -> exportAllThemes
 *         TextLabel                        textLabel15                      -> exportAllThemesLabel
 *         Frame                            frame7                           -> exportAllThemesRadios
 *           FormControlRadioButtonControl  formControlRadioButtonControl5   -> exportAllThemesYes
 *             InputRadioButton             inputRadioButton5                -> exportAllThemesYesInput
 *             TextLabel                    textLabel16                      -> exportAllThemesYesText
 *           FormControlRadioButtonControl  formControlRadioButtonControl6   -> exportAllThemesNo
 *             InputRadioButton             inputRadioButton6                -> exportAllThemesNoInput
 *             TextLabel                    textLabel17                      -> exportAllThemesNoText
 *       FormControlRadio                   formControlRadio4                -> exportAllFonts
 *         TextLabel                        textLabel18                      -> exportAllFontsLabel
 *         Frame                            frame8                           -> exportAllFontsRadios
 *           FormControlRadioButtonControl  formControlRadioButtonControl7   -> exportAllFontsYes
 *             InputRadioButton             inputRadioButton7                -> exportAllFontsYesInput
 *             TextLabel                    textLabel19                      -> exportAllFontsYesText
 *           FormControlRadioButtonControl  formControlRadioButtonControl8   -> exportAllFontsNo
 *             InputRadioButton             inputRadioButton8                -> exportAllFontsNoInput
 *             TextLabel                    textLabel20                      -> exportAllFontsNoText
 *       FormControlRadio                   formControlRadio5                -> exportAllIcons
 *         TextLabel                        textLabel21                      -> exportAllIconsLabel
 *         Frame                            frame9                           -> exportAllIconsRadios
 *           FormControlRadioButtonControl  formControlRadioButtonControl9   -> exportAllIconsYes
 *             InputRadioButton             inputRadioButton9                -> exportAllIconsYesInput
 *             TextLabel                    textLabel22                      -> exportAllIconsYesText
 *           FormControlRadioButtonControl  formControlRadioButtonControl10  -> exportAllIconsNo
 *             InputRadioButton             inputRadioButton10               -> exportAllIconsNoInput
 *             TextLabel                    textLabel23                      -> exportAllIconsNoText
 *       FormControlRadio                   formControlRadio6                -> exportWorkspace
 *         TextLabel                        textLabel24                      -> exportWorkspaceLabel
 *         Frame                            frame10                          -> exportWorkspaceRadios
 *           FormControlRadioButtonControl  formControlRadioButtonControl11  -> exportWorkspaceYes
 *             InputRadioButton             inputRadioButton11               -> exportWorkspaceYesInput
 *             TextLabel                    textLabel25                      -> exportWorkspaceYesText
 *           FormControlRadioButtonControl  formControlRadioButtonControl12  -> exportWorkspaceNo
 *             InputRadioButton             inputRadioButton12               -> exportWorkspaceNoInput
 *             TextLabel                    textLabel26                      -> exportWorkspaceNoText
 *       FormControlRadio                   formControlRadio7                -> exportScripts
 *         TextLabel                        textLabel27                      -> exportScriptsLabel
 *         Frame                            frame11                          -> exportScriptsRadios
 *           FormControlRadioButtonControl  formControlRadioButtonControl13  -> exportScriptsYes
 *             InputRadioButton             inputRadioButton13               -> exportScriptsYesInput
 *             TextLabel                    textLabel28                      -> exportScriptsYesText
 *           FormControlRadioButtonControl  formControlRadioButtonControl14  -> exportScriptsNo
 *             InputRadioButton             inputRadioButton14               -> exportScriptsNoInput
 *             TextLabel                    textLabel29                      -> exportScriptsNoText
 *   BarButtons                             barButtons
 *     Button                               button                           -> exportCancel
 *       Icon                               icon3
 *       TextLabel                          textLabel30                      -> exportCancelLabel
 *     Button                               button2                          -> exportConfirm
 *       Icon                               icon4
 *       TextLabel                          textLabel31                      -> exportConfirmLabel
 *
 * @example
 * ```tsx
 * <DialogExportComponent
 *   aria-hidden="false"
 *   bar="{}"
 *   textTitle="Product Title"
 *   frame="{}"
 *   articleCard="{}"
 *   image="/image.jpg"
 *   chip="{}"
 *   textLabel="{}"
 *   textHeading="{}"
 *   textDescription2="{}"
 *   avatar="/image.jpg"
 *   textLabel2="{}"
 *   buttonSimple={() => {}}
 *   formControl="{}"
 *   input="{}"
 *   formControl2="{}"
 *   comboboxField="{}"
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   formControl3="{}"
 *   formControl4="{}"
 *   formControlRadio5="{}"
 *   formControlRadioButtonControl="{}"
 *   inputRadioButton="{}"
 *   formControlRadioButtonControl2="{}"
 *   fieldset="{}"
 *   legend="{}"
 *   formControlRadio="{}"
 *   formControlRadio2="{}"
 *   formControlRadio3="{}"
 *   formControlRadio4="{}"
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
  articleCard,
  image,
  frame2,
  chip,
  textLabel,
  textHeading,
  textDescription,
  frame3,
  avatar,
  image2,
  frame4,
  textLabel2,
  textLabel3,
  buttonSimple,
  textLabel4,
  formControl,
  textLabel5,
  input,
  formControl2,
  textLabel6,
  comboboxField,
  input2,
  buttonIconic,
  icon,
  formControl3,
  textLabel7,
  comboboxField2,
  input3,
  buttonIconic2,
  icon2,
  formControl4,
  textLabel8,
  input4,
  formControlRadio,
  textLabel9,
  frame5,
  formControlRadioButtonControl,
  inputRadioButton,
  textLabel10,
  formControlRadioButtonControl2,
  inputRadioButton2,
  textLabel11,
  fieldset,
  legend,
  formControlRadio2,
  textLabel12,
  frame6,
  formControlRadioButtonControl3,
  inputRadioButton3,
  textLabel13,
  formControlRadioButtonControl4,
  inputRadioButton4,
  textLabel14,
  formControlRadio3,
  textLabel15,
  frame7,
  formControlRadioButtonControl5,
  inputRadioButton5,
  textLabel16,
  formControlRadioButtonControl6,
  inputRadioButton6,
  textLabel17,
  formControlRadio4,
  textLabel18,
  frame8,
  formControlRadioButtonControl7,
  inputRadioButton7,
  textLabel19,
  formControlRadioButtonControl8,
  inputRadioButton8,
  textLabel20,
  formControlRadio5,
  textLabel21,
  frame9,
  formControlRadioButtonControl9,
  inputRadioButton9,
  textLabel22,
  formControlRadioButtonControl10,
  inputRadioButton10,
  textLabel23,
  formControlRadio6,
  textLabel24,
  frame10,
  formControlRadioButtonControl11,
  inputRadioButton11,
  textLabel25,
  formControlRadioButtonControl12,
  inputRadioButton12,
  textLabel26,
  formControlRadio7,
  textLabel27,
  frame11,
  formControlRadioButtonControl13,
  inputRadioButton13,
  textLabel28,
  formControlRadioButtonControl14,
  inputRadioButton14,
  textLabel29,

  barButtons,
  button,
  icon3,
  textLabel30,
  button2,
  icon4,
  textLabel31,

  children,
  seldonRefs,
  ...props
}: DialogExportComponentProps) {
  const dialogExportComponentClassName = combineClassNames("sdn-dialog-export-component", className)

  const barProps = mergeSlot(sdn.bar, bar, seldonRefs)
  const textTitleProps = mergeOptionalSlot(sdn.textTitle, textTitle, seldonRefs)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const articleCardProps = mergeOptionalSlot(sdn.articleCard, articleCard, seldonRefs)
  const imageProps = mergeSlot(sdn.image, image, seldonRefs)
  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const chipProps = mergeOptionalSlot(sdn.chip, chip, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const textHeadingProps = mergeOptionalSlot(sdn.textHeading, textHeading, seldonRefs)
  const textDescriptionProps = mergeOptionalSlot(sdn.textDescription, textDescription, seldonRefs)
  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const avatarProps = mergeOptionalSlot(sdn.avatar, avatar, seldonRefs)
  const image2Props = mergeSlot(sdn.image2, image2, seldonRefs)
  const frame4Props = mergeSlot(sdn.frame4, frame4, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)
  const buttonSimpleProps = mergeOptionalSlot(sdn.buttonSimple, buttonSimple, seldonRefs)
  const textLabel4Props = mergeOptionalSlot(sdn.textLabel4, textLabel4, seldonRefs)
  const formControlProps = mergeOptionalSlot(sdn.formControl, formControl, seldonRefs)
  const textLabel5Props = mergeOptionalSlot(sdn.textLabel5, textLabel5, seldonRefs)
  const inputProps = mergeSlot(sdn.input, input, seldonRefs)
  const formControl2Props = mergeOptionalSlot(sdn.formControl2, formControl2, seldonRefs)
  const textLabel6Props = mergeOptionalSlot(sdn.textLabel6, textLabel6, seldonRefs)
  const comboboxFieldProps = mergeOptionalSlot(sdn.comboboxField, comboboxField, seldonRefs)
  const input2Props = mergeSlot(sdn.input2, input2, seldonRefs)
  const buttonIconicProps = mergeSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const formControl3Props = mergeOptionalSlot(sdn.formControl3, formControl3, seldonRefs)
  const textLabel7Props = mergeOptionalSlot(sdn.textLabel7, textLabel7, seldonRefs)
  const comboboxField2Props = mergeOptionalSlot(sdn.comboboxField2, comboboxField2, seldonRefs)
  const input3Props = mergeSlot(sdn.input3, input3, seldonRefs)
  const buttonIconic2Props = mergeSlot(sdn.buttonIconic2, buttonIconic2, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)
  const formControl4Props = mergeOptionalSlot(sdn.formControl4, formControl4, seldonRefs)
  const textLabel8Props = mergeOptionalSlot(sdn.textLabel8, textLabel8, seldonRefs)
  const input4Props = mergeSlot(sdn.input4, input4, seldonRefs)
  const formControlRadioProps = mergeOptionalSlot(
    sdn.formControlRadio,
    formControlRadio,
    seldonRefs,
  )
  const textLabel9Props = mergeOptionalSlot(sdn.textLabel9, textLabel9, seldonRefs)
  const frame5Props = mergeSlot(sdn.frame5, frame5, seldonRefs)
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
  const textLabel10Props = mergeOptionalSlot(sdn.textLabel10, textLabel10, seldonRefs)
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
  const textLabel11Props = mergeOptionalSlot(sdn.textLabel11, textLabel11, seldonRefs)
  const fieldsetProps = mergeOptionalSlot(sdn.fieldset, fieldset, seldonRefs)
  const legendProps = mergeSlot(sdn.legend, legend, seldonRefs)
  const formControlRadio2Props = mergeSlot(sdn.formControlRadio2, formControlRadio2, seldonRefs)
  const textLabel12Props = mergeOptionalSlot(sdn.textLabel12, textLabel12, seldonRefs)
  const frame6Props = mergeSlot(sdn.frame6, frame6, seldonRefs)
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
  const textLabel13Props = mergeOptionalSlot(sdn.textLabel13, textLabel13, seldonRefs)
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
  const textLabel14Props = mergeOptionalSlot(sdn.textLabel14, textLabel14, seldonRefs)
  const formControlRadio3Props = mergeSlot(sdn.formControlRadio3, formControlRadio3, seldonRefs)
  const textLabel15Props = mergeOptionalSlot(sdn.textLabel15, textLabel15, seldonRefs)
  const frame7Props = mergeSlot(sdn.frame7, frame7, seldonRefs)
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
  const textLabel16Props = mergeOptionalSlot(sdn.textLabel16, textLabel16, seldonRefs)
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
  const textLabel17Props = mergeOptionalSlot(sdn.textLabel17, textLabel17, seldonRefs)
  const formControlRadio4Props = mergeOptionalSlot(
    sdn.formControlRadio4,
    formControlRadio4,
    seldonRefs,
  )
  const textLabel18Props = mergeOptionalSlot(sdn.textLabel18, textLabel18, seldonRefs)
  const frame8Props = mergeSlot(sdn.frame8, frame8, seldonRefs)
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
  const textLabel19Props = mergeOptionalSlot(sdn.textLabel19, textLabel19, seldonRefs)
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
  const textLabel20Props = mergeOptionalSlot(sdn.textLabel20, textLabel20, seldonRefs)
  const formControlRadio5Props = mergeOptionalSlot(
    sdn.formControlRadio5,
    formControlRadio5,
    seldonRefs,
  )
  const textLabel21Props = mergeOptionalSlot(sdn.textLabel21, textLabel21, seldonRefs)
  const frame9Props = mergeSlot(sdn.frame9, frame9, seldonRefs)
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
  const textLabel22Props = mergeOptionalSlot(sdn.textLabel22, textLabel22, seldonRefs)
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
  const textLabel23Props = mergeOptionalSlot(sdn.textLabel23, textLabel23, seldonRefs)
  const formControlRadio6Props = mergeOptionalSlot(
    sdn.formControlRadio6,
    formControlRadio6,
    seldonRefs,
  )
  const textLabel24Props = mergeOptionalSlot(sdn.textLabel24, textLabel24, seldonRefs)
  const frame10Props = mergeSlot(sdn.frame10, frame10, seldonRefs)
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
  const textLabel25Props = mergeOptionalSlot(sdn.textLabel25, textLabel25, seldonRefs)
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
  const textLabel26Props = mergeOptionalSlot(sdn.textLabel26, textLabel26, seldonRefs)
  const formControlRadio7Props = mergeOptionalSlot(
    sdn.formControlRadio7,
    formControlRadio7,
    seldonRefs,
  )
  const textLabel27Props = mergeOptionalSlot(sdn.textLabel27, textLabel27, seldonRefs)
  const frame11Props = mergeSlot(sdn.frame11, frame11, seldonRefs)
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
  const textLabel28Props = mergeOptionalSlot(sdn.textLabel28, textLabel28, seldonRefs)
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
  const textLabel29Props = mergeOptionalSlot(sdn.textLabel29, textLabel29, seldonRefs)

  const barButtonsProps = mergeSlot(sdn.barButtons, barButtons, seldonRefs)
  const buttonProps = mergeSlot(sdn.button, button, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)
  const textLabel30Props = mergeOptionalSlot(sdn.textLabel30, textLabel30, seldonRefs)
  const button2Props = mergeSlot(sdn.button2, button2, seldonRefs)
  const icon4Props = mergeSlot(sdn.icon4, icon4, seldonRefs)
  const textLabel31Props = mergeOptionalSlot(sdn.textLabel31, textLabel31, seldonRefs)

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
            {frameProps?.children !== undefined ? (
              frameProps?.children
            ) : (
              <>
                {articleCardProps !== null && (
                  <ArticleCard {...articleCardProps}>
                    {imageProps !== null && <Image {...imageProps} />}
                    <Frame {...frame2Props}>
                      {chipProps !== null && (
                        <Chip {...chipProps}>
                          {textLabelProps !== null && <TextLabel {...textLabelProps} />}
                        </Chip>
                      )}
                      {textHeadingProps !== null && <TextHeading {...textHeadingProps} />}
                      {textDescriptionProps !== null && (
                        <TextDescription {...textDescriptionProps} />
                      )}
                      <Frame {...frame3Props}>
                        {avatarProps !== null && <Avatar {...avatarProps} image={image2Props} />}
                        <Frame {...frame4Props}>
                          {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
                          {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
                        </Frame>
                        {buttonSimpleProps !== null && (
                          <ButtonSimple {...buttonSimpleProps}>
                            {textLabel4Props !== null && <TextLabel {...textLabel4Props} />}
                          </ButtonSimple>
                        )}
                      </Frame>
                    </Frame>
                  </ArticleCard>
                )}
                {formControlProps !== null && (
                  <FormControl {...formControlProps}>
                    {textLabel5Props !== null && <TextLabel {...textLabel5Props} />}
                    {inputProps !== null && <Input {...inputProps} />}
                  </FormControl>
                )}
                {formControl2Props !== null && (
                  <FormControl {...formControl2Props}>
                    {textLabel6Props !== null && <TextLabel {...textLabel6Props} />}
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
                {formControl3Props !== null && (
                  <FormControl {...formControl3Props}>
                    {textLabel7Props !== null && <TextLabel {...textLabel7Props} />}
                    {comboboxField2Props !== null && (
                      <ComboboxField
                        {...comboboxField2Props}
                        input={input3Props}
                        buttonIconic={buttonIconic2Props}
                        icon2={icon2Props}
                        icon={null}
                      />
                    )}
                  </FormControl>
                )}
                {formControl4Props !== null && (
                  <FormControl {...formControl4Props}>
                    {textLabel8Props !== null && <TextLabel {...textLabel8Props} />}
                    {input4Props !== null && <Input {...input4Props} />}
                  </FormControl>
                )}
                {formControlRadioProps !== null && (
                  <FormControlRadio {...formControlRadioProps}>
                    {textLabel9Props !== null && <TextLabel {...textLabel9Props} />}
                    <Frame {...frame5Props}>
                      {frame5Props?.children !== undefined ? (
                        frame5Props?.children
                      ) : (
                        <>
                          {formControlRadioButtonControlProps !== null && (
                            <FormControlRadioButtonControl {...formControlRadioButtonControlProps}>
                              {inputRadioButtonProps !== null && (
                                <InputRadioButton {...inputRadioButtonProps} />
                              )}
                              {textLabel10Props !== null && <TextLabel {...textLabel10Props} />}
                            </FormControlRadioButtonControl>
                          )}
                          {formControlRadioButtonControl2Props !== null && (
                            <FormControlRadioButtonControl {...formControlRadioButtonControl2Props}>
                              {inputRadioButton2Props !== null && (
                                <InputRadioButton {...inputRadioButton2Props} />
                              )}
                              {textLabel11Props !== null && <TextLabel {...textLabel11Props} />}
                            </FormControlRadioButtonControl>
                          )}
                        </>
                      )}
                    </Frame>
                  </FormControlRadio>
                )}
                {fieldsetProps !== null && (
                  <Fieldset {...fieldsetProps}>
                    {legendProps !== null && <Legend {...legendProps} />}
                    {formControlRadio2Props !== null && (
                      <FormControlRadio {...formControlRadio2Props}>
                        {textLabel12Props !== null && <TextLabel {...textLabel12Props} />}
                        <Frame {...frame6Props}>
                          {frame6Props?.children !== undefined ? (
                            frame6Props?.children
                          ) : (
                            <>
                              {formControlRadioButtonControl3Props !== null && (
                                <FormControlRadioButtonControl
                                  {...formControlRadioButtonControl3Props}
                                >
                                  {inputRadioButton3Props !== null && (
                                    <InputRadioButton {...inputRadioButton3Props} />
                                  )}
                                  {textLabel13Props !== null && <TextLabel {...textLabel13Props} />}
                                </FormControlRadioButtonControl>
                              )}
                              {formControlRadioButtonControl4Props !== null && (
                                <FormControlRadioButtonControl
                                  {...formControlRadioButtonControl4Props}
                                >
                                  {inputRadioButton4Props !== null && (
                                    <InputRadioButton {...inputRadioButton4Props} />
                                  )}
                                  {textLabel14Props !== null && <TextLabel {...textLabel14Props} />}
                                </FormControlRadioButtonControl>
                              )}
                            </>
                          )}
                        </Frame>
                      </FormControlRadio>
                    )}
                    {formControlRadio3Props !== null && (
                      <FormControlRadio {...formControlRadio3Props}>
                        {textLabel15Props !== null && <TextLabel {...textLabel15Props} />}
                        <Frame {...frame7Props}>
                          {frame7Props?.children !== undefined ? (
                            frame7Props?.children
                          ) : (
                            <>
                              {formControlRadioButtonControl5Props !== null && (
                                <FormControlRadioButtonControl
                                  {...formControlRadioButtonControl5Props}
                                >
                                  {inputRadioButton5Props !== null && (
                                    <InputRadioButton {...inputRadioButton5Props} />
                                  )}
                                  {textLabel16Props !== null && <TextLabel {...textLabel16Props} />}
                                </FormControlRadioButtonControl>
                              )}
                              {formControlRadioButtonControl6Props !== null && (
                                <FormControlRadioButtonControl
                                  {...formControlRadioButtonControl6Props}
                                >
                                  {inputRadioButton6Props !== null && (
                                    <InputRadioButton {...inputRadioButton6Props} />
                                  )}
                                  {textLabel17Props !== null && <TextLabel {...textLabel17Props} />}
                                </FormControlRadioButtonControl>
                              )}
                            </>
                          )}
                        </Frame>
                      </FormControlRadio>
                    )}
                    {formControlRadio4Props !== null && (
                      <FormControlRadio {...formControlRadio4Props}>
                        {textLabel18Props !== null && <TextLabel {...textLabel18Props} />}
                        <Frame {...frame8Props}>
                          {frame8Props?.children !== undefined ? (
                            frame8Props?.children
                          ) : (
                            <>
                              {formControlRadioButtonControl7Props !== null && (
                                <FormControlRadioButtonControl
                                  {...formControlRadioButtonControl7Props}
                                >
                                  {inputRadioButton7Props !== null && (
                                    <InputRadioButton {...inputRadioButton7Props} />
                                  )}
                                  {textLabel19Props !== null && <TextLabel {...textLabel19Props} />}
                                </FormControlRadioButtonControl>
                              )}
                              {formControlRadioButtonControl8Props !== null && (
                                <FormControlRadioButtonControl
                                  {...formControlRadioButtonControl8Props}
                                >
                                  {inputRadioButton8Props !== null && (
                                    <InputRadioButton {...inputRadioButton8Props} />
                                  )}
                                  {textLabel20Props !== null && <TextLabel {...textLabel20Props} />}
                                </FormControlRadioButtonControl>
                              )}
                            </>
                          )}
                        </Frame>
                      </FormControlRadio>
                    )}
                    {formControlRadio5Props !== null && (
                      <FormControlRadio {...formControlRadio5Props}>
                        {textLabel21Props !== null && <TextLabel {...textLabel21Props} />}
                        <Frame {...frame9Props}>
                          {frame9Props?.children !== undefined ? (
                            frame9Props?.children
                          ) : (
                            <>
                              {formControlRadioButtonControl9Props !== null && (
                                <FormControlRadioButtonControl
                                  {...formControlRadioButtonControl9Props}
                                >
                                  {inputRadioButton9Props !== null && (
                                    <InputRadioButton {...inputRadioButton9Props} />
                                  )}
                                  {textLabel22Props !== null && <TextLabel {...textLabel22Props} />}
                                </FormControlRadioButtonControl>
                              )}
                              {formControlRadioButtonControl10Props !== null && (
                                <FormControlRadioButtonControl
                                  {...formControlRadioButtonControl10Props}
                                >
                                  {inputRadioButton10Props !== null && (
                                    <InputRadioButton {...inputRadioButton10Props} />
                                  )}
                                  {textLabel23Props !== null && <TextLabel {...textLabel23Props} />}
                                </FormControlRadioButtonControl>
                              )}
                            </>
                          )}
                        </Frame>
                      </FormControlRadio>
                    )}
                    {formControlRadio6Props !== null && (
                      <FormControlRadio {...formControlRadio6Props}>
                        {textLabel24Props !== null && <TextLabel {...textLabel24Props} />}
                        <Frame {...frame10Props}>
                          {frame10Props?.children !== undefined ? (
                            frame10Props?.children
                          ) : (
                            <>
                              {formControlRadioButtonControl11Props !== null && (
                                <FormControlRadioButtonControl
                                  {...formControlRadioButtonControl11Props}
                                >
                                  {inputRadioButton11Props !== null && (
                                    <InputRadioButton {...inputRadioButton11Props} />
                                  )}
                                  {textLabel25Props !== null && <TextLabel {...textLabel25Props} />}
                                </FormControlRadioButtonControl>
                              )}
                              {formControlRadioButtonControl12Props !== null && (
                                <FormControlRadioButtonControl
                                  {...formControlRadioButtonControl12Props}
                                >
                                  {inputRadioButton12Props !== null && (
                                    <InputRadioButton {...inputRadioButton12Props} />
                                  )}
                                  {textLabel26Props !== null && <TextLabel {...textLabel26Props} />}
                                </FormControlRadioButtonControl>
                              )}
                            </>
                          )}
                        </Frame>
                      </FormControlRadio>
                    )}
                    {formControlRadio7Props !== null && (
                      <FormControlRadio {...formControlRadio7Props}>
                        {textLabel27Props !== null && <TextLabel {...textLabel27Props} />}
                        <Frame {...frame11Props}>
                          {frame11Props?.children !== undefined ? (
                            frame11Props?.children
                          ) : (
                            <>
                              {formControlRadioButtonControl13Props !== null && (
                                <FormControlRadioButtonControl
                                  {...formControlRadioButtonControl13Props}
                                >
                                  {inputRadioButton13Props !== null && (
                                    <InputRadioButton {...inputRadioButton13Props} />
                                  )}
                                  {textLabel28Props !== null && <TextLabel {...textLabel28Props} />}
                                </FormControlRadioButtonControl>
                              )}
                              {formControlRadioButtonControl14Props !== null && (
                                <FormControlRadioButtonControl
                                  {...formControlRadioButtonControl14Props}
                                >
                                  {inputRadioButton14Props !== null && (
                                    <InputRadioButton {...inputRadioButton14Props} />
                                  )}
                                  {textLabel29Props !== null && <TextLabel {...textLabel29Props} />}
                                </FormControlRadioButtonControl>
                              )}
                            </>
                          )}
                        </Frame>
                      </FormControlRadio>
                    )}
                  </Fieldset>
                )}
              </>
            )}
          </Frame>
          {barButtonsProps !== null && (
            <BarButtons
              {...barButtonsProps}
              button4={buttonProps}
              icon4={icon3Props}
              textLabel4={textLabel30Props}
              button5={button2Props}
              icon5={icon4Props}
              textLabel5={textLabel31Props}
            />
          )}
        </>
      )}
    </HTMLDiv>
  )
}
