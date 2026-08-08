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
 *   Bar                                    bar
 *     TextTitle                            textTitle                        -> exportTitle
 *   Frame                                  frame                            -> exportComponentsOptions
 *     FormControl                          formControl                      -> exportWorkspaceName
 *       TextLabel                          textLabel                        -> exportWorkspaceNameLabel
 *       Input                              input                            -> exportWorkspaceNameField
 *     FormControl                          formControl2                     -> exportFramework
 *       TextLabel                          textLabel2                       -> exportFrameworkLabel
 *       ComboboxField                      comboboxField                    -> exportFrameworkCombobox
 *         Input                            input2                           -> exportFrameworkField
 *         ButtonIconic                     buttonIconic
 *           Icon                           icon
 *     FormControl                          formControl3                     -> exportPlatform
 *       TextLabel                          textLabel3                       -> exportPlatformLabel
 *       ComboboxField                      comboboxField2                   -> exportPlatformCombobox
 *         Input                            input3                           -> exportPlatformField
 *         ButtonIconic                     buttonIconic2
 *           Icon                           icon2
 *     FormControl                          formControl4                     -> exportProjectFolder
 *       TextLabel                          textLabel4                       -> exportProjectFolderLabel
 *       Input                              input4                           -> exportProjectFolderField
 *     FormControlRadio                     formControlRadio                 -> exportFontLinks
 *       TextLabel                          textLabel5                       -> exportFontLinksLabel
 *       Frame                              frame2                           -> exportFontLinksRadios
 *         FormControlRadioButtonControl    formControlRadioButtonControl    -> exportFontLinksYes
 *           InputRadioButton               inputRadioButton                 -> exportFontLinksYesInput
 *           TextLabel                      textLabel6                       -> exportFontLinksYesText
 *         FormControlRadioButtonControl    formControlRadioButtonControl2   -> exportFontLinksNo
 *           InputRadioButton               inputRadioButton2                -> exportFontLinksNoInput
 *           TextLabel                      textLabel7                       -> exportFontLinksNoText
 *     Fieldset                             fieldset                         -> exportFieldset
 *       Legend                             legend                           -> exportFieldsetLabel
 *       FormControlRadio                   formControlRadio2                -> exportHidden
 *         TextLabel                        textLabel8                       -> exportHiddenLabel
 *         Frame                            frame3                           -> exportHiddenRadios
 *           FormControlRadioButtonControl  formControlRadioButtonControl3   -> exportHiddenYes
 *             InputRadioButton             inputRadioButton3                -> exportHiddenYesInput
 *             TextLabel                    textLabel9                       -> exportHiddenYesText
 *           FormControlRadioButtonControl  formControlRadioButtonControl4   -> exportHiddenNo
 *             InputRadioButton             inputRadioButton4                -> exportHiddenNoInput
 *             TextLabel                    textLabel10                      -> exportHiddenNoText
 *       FormControlRadio                   formControlRadio3                -> exportAllThemes
 *         TextLabel                        textLabel11                      -> exportAllThemesLabel
 *         Frame                            frame4                           -> exportAllThemesRadios
 *           FormControlRadioButtonControl  formControlRadioButtonControl5   -> exportAllThemesYes
 *             InputRadioButton             inputRadioButton5                -> exportAllThemesYesInput
 *             TextLabel                    textLabel12                      -> exportAllThemesYesText
 *           FormControlRadioButtonControl  formControlRadioButtonControl6   -> exportAllThemesNo
 *             InputRadioButton             inputRadioButton6                -> exportAllThemesNoInput
 *             TextLabel                    textLabel13                      -> exportAllThemesNoText
 *       FormControlRadio                   formControlRadio4                -> exportAllFonts
 *         TextLabel                        textLabel14                      -> exportAllFontsLabel
 *         Frame                            frame5                           -> exportAllFontsRadios
 *           FormControlRadioButtonControl  formControlRadioButtonControl7   -> exportAllFontsYes
 *             InputRadioButton             inputRadioButton7                -> exportAllFontsYesInput
 *             TextLabel                    textLabel15                      -> exportAllFontsYesText
 *           FormControlRadioButtonControl  formControlRadioButtonControl8   -> exportAllFontsNo
 *             InputRadioButton             inputRadioButton8                -> exportAllFontsNoInput
 *             TextLabel                    textLabel16                      -> exportAllFontsNoText
 *       FormControlRadio                   formControlRadio5                -> exportAllIcons
 *         TextLabel                        textLabel17                      -> exportAllIconsLabel
 *         Frame                            frame6                           -> exportAllIconsRadios
 *           FormControlRadioButtonControl  formControlRadioButtonControl9   -> exportAllIconsYes
 *             InputRadioButton             inputRadioButton9                -> exportAllIconsYesInput
 *             TextLabel                    textLabel18                      -> exportAllIconsYesText
 *           FormControlRadioButtonControl  formControlRadioButtonControl10  -> exportAllIconsNo
 *             InputRadioButton             inputRadioButton10               -> exportAllIconsNoInput
 *             TextLabel                    textLabel19                      -> exportAllIconsNoText
 *       FormControlRadio                   formControlRadio6                -> exportWorkspace
 *         TextLabel                        textLabel20                      -> exportWorkspaceLabel
 *         Frame                            frame7                           -> exportWorkspaceRadios
 *           FormControlRadioButtonControl  formControlRadioButtonControl11  -> exportWorkspaceYes
 *             InputRadioButton             inputRadioButton11               -> exportWorkspaceYesInput
 *             TextLabel                    textLabel21                      -> exportWorkspaceYesText
 *           FormControlRadioButtonControl  formControlRadioButtonControl12  -> exportWorkspaceNo
 *             InputRadioButton             inputRadioButton12               -> exportWorkspaceNoInput
 *             TextLabel                    textLabel22                      -> exportWorkspaceNoText
 *       FormControlRadio                   formControlRadio7                -> exportScripts
 *         TextLabel                        textLabel23                      -> exportScriptsLabel
 *         Frame                            frame8                           -> exportScriptsRadios
 *           FormControlRadioButtonControl  formControlRadioButtonControl13  -> exportScriptsYes
 *             InputRadioButton             inputRadioButton13               -> exportScriptsYesInput
 *             TextLabel                    textLabel24                      -> exportScriptsYesText
 *           FormControlRadioButtonControl  formControlRadioButtonControl14  -> exportScriptsNo
 *             InputRadioButton             inputRadioButton14               -> exportScriptsNoInput
 *             TextLabel                    textLabel25                      -> exportScriptsNoText
 *   BarButtons                             barButtons
 *     Button                               button                           -> exportCancel
 *       Icon                               icon3
 *       TextLabel                          textLabel26                      -> exportCancelLabel
 *     Button                               button2                          -> exportConfirm
 *       Icon                               icon4
 *       TextLabel                          textLabel27                      -> exportConfirmLabel
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
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import ComboboxField from "../elements/ComboboxField.vue"
import FormControl from "../elements/FormControl.vue"
import FormControlRadio from "../elements/FormControlRadio.vue"
import FormControlRadioButtonControl from "../elements/FormControlRadioButtonControl.vue"
import Frame from "../frames/Frame.vue"
import Bar from "../parts/Bar.vue"
import BarButtons from "../parts/BarButtons.vue"
import Fieldset from "../parts/Fieldset.vue"
import Input from "../primitives/Input.vue"
import InputRadioButton from "../primitives/InputRadioButton.vue"
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
  comboboxField?: Record<string, unknown> | null
  input2?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  formControl3?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  comboboxField2?: Record<string, unknown> | null
  input3?: Record<string, unknown> | null
  buttonIconic2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  formControl4?: Record<string, unknown> | null
  textLabel4?: Record<string, unknown> | null
  input4?: Record<string, unknown> | null
  formControlRadio?: Record<string, unknown> | null
  textLabel5?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  formControlRadioButtonControl?: Record<string, unknown> | null
  inputRadioButton?: Record<string, unknown> | null
  textLabel6?: Record<string, unknown> | null
  formControlRadioButtonControl2?: Record<string, unknown> | null
  inputRadioButton2?: Record<string, unknown> | null
  textLabel7?: Record<string, unknown> | null
  fieldset?: Record<string, unknown> | null
  legend?: Record<string, unknown> | null
  formControlRadio2?: Record<string, unknown> | null
  textLabel8?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
  formControlRadioButtonControl3?: Record<string, unknown> | null
  inputRadioButton3?: Record<string, unknown> | null
  textLabel9?: Record<string, unknown> | null
  formControlRadioButtonControl4?: Record<string, unknown> | null
  inputRadioButton4?: Record<string, unknown> | null
  textLabel10?: Record<string, unknown> | null
  formControlRadio3?: Record<string, unknown> | null
  textLabel11?: Record<string, unknown> | null
  frame4?: Record<string, unknown> | null
  formControlRadioButtonControl5?: Record<string, unknown> | null
  inputRadioButton5?: Record<string, unknown> | null
  textLabel12?: Record<string, unknown> | null
  formControlRadioButtonControl6?: Record<string, unknown> | null
  inputRadioButton6?: Record<string, unknown> | null
  textLabel13?: Record<string, unknown> | null
  formControlRadio4?: Record<string, unknown> | null
  textLabel14?: Record<string, unknown> | null
  frame5?: Record<string, unknown> | null
  formControlRadioButtonControl7?: Record<string, unknown> | null
  inputRadioButton7?: Record<string, unknown> | null
  textLabel15?: Record<string, unknown> | null
  formControlRadioButtonControl8?: Record<string, unknown> | null
  inputRadioButton8?: Record<string, unknown> | null
  textLabel16?: Record<string, unknown> | null
  formControlRadio5?: Record<string, unknown> | null
  textLabel17?: Record<string, unknown> | null
  frame6?: Record<string, unknown> | null
  formControlRadioButtonControl9?: Record<string, unknown> | null
  inputRadioButton9?: Record<string, unknown> | null
  textLabel18?: Record<string, unknown> | null
  formControlRadioButtonControl10?: Record<string, unknown> | null
  inputRadioButton10?: Record<string, unknown> | null
  textLabel19?: Record<string, unknown> | null
  formControlRadio6?: Record<string, unknown> | null
  textLabel20?: Record<string, unknown> | null
  frame7?: Record<string, unknown> | null
  formControlRadioButtonControl11?: Record<string, unknown> | null
  inputRadioButton11?: Record<string, unknown> | null
  textLabel21?: Record<string, unknown> | null
  formControlRadioButtonControl12?: Record<string, unknown> | null
  inputRadioButton12?: Record<string, unknown> | null
  textLabel22?: Record<string, unknown> | null
  formControlRadio7?: Record<string, unknown> | null
  textLabel23?: Record<string, unknown> | null
  frame8?: Record<string, unknown> | null
  formControlRadioButtonControl13?: Record<string, unknown> | null
  inputRadioButton13?: Record<string, unknown> | null
  textLabel24?: Record<string, unknown> | null
  formControlRadioButtonControl14?: Record<string, unknown> | null
  inputRadioButton14?: Record<string, unknown> | null
  textLabel25?: Record<string, unknown> | null
  barButtons?: Record<string, unknown> | null
  button?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  textLabel26?: Record<string, unknown> | null
  button2?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  textLabel27?: Record<string, unknown> | null
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
    className: "sdn-text-title sdn-text-title--j8d9",
    "data-seldon-ref": "exportTitle",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--q7m7",
    "data-seldon-ref": "exportComponentsOptions",
  },
  formControl: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--vmxp",
    "data-seldon-ref": "exportWorkspaceName",
  },
  textLabel: {
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
  textLabel2: {
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
  textLabel3: {
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
  textLabel4: {
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
  textLabel5: {
    children: "Generate Google Font API Links",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--l6fl",
    "data-seldon-ref": "exportFontLinksLabel",
  },
  frame2: {
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
  textLabel6: {
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
  textLabel7: {
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
  textLabel8: {
    children: "Hidden Components",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s1qr",
    "data-seldon-ref": "exportHiddenLabel",
  },
  frame3: {
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
  textLabel9: {
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
  textLabel10: {
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
  textLabel11: {
    children: "All Themes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s1qr",
    "data-seldon-ref": "exportAllThemesLabel",
  },
  frame4: {
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
  textLabel12: {
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
  textLabel13: {
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
  textLabel14: {
    children: "All Enabled Fonts",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s1qr",
    "data-seldon-ref": "exportAllFontsLabel",
  },
  frame5: {
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
  textLabel15: {
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
  textLabel16: {
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
  textLabel17: {
    children: "All Enabled Icons",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s1qr",
    "data-seldon-ref": "exportAllIconsLabel",
  },
  frame6: {
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
  textLabel18: {
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
  textLabel19: {
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
  textLabel20: {
    children: "Workspace File",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s1qr",
    "data-seldon-ref": "exportWorkspaceLabel",
  },
  frame7: {
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
  textLabel21: {
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
  textLabel22: {
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
  textLabel23: {
    children: "CLI Utility Scripts",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s1qr",
    "data-seldon-ref": "exportScriptsLabel",
  },
  frame8: {
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
  textLabel24: {
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
  textLabel25: {
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
  textLabel26: {
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
  textLabel27: {
    children: "Export",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--wxqf",
    "data-seldon-ref": "exportConfirmLabel",
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
const comboboxFieldProps = computed(() =>
  mergeOptionalSlot(sdn.comboboxField, props.comboboxField, props.seldonRefs),
)
const input2Props = computed(() => mergeSlot(sdn.input2, props.input2, props.seldonRefs))
const buttonIconicProps = computed(() =>
  mergeSlot(sdn.buttonIconic, props.buttonIconic, props.seldonRefs),
)
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const formControl3Props = computed(() =>
  mergeOptionalSlot(sdn.formControl3, props.formControl3, props.seldonRefs),
)
const textLabel3Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs),
)
const comboboxField2Props = computed(() =>
  mergeOptionalSlot(sdn.comboboxField2, props.comboboxField2, props.seldonRefs),
)
const input3Props = computed(() => mergeSlot(sdn.input3, props.input3, props.seldonRefs))
const buttonIconic2Props = computed(() =>
  mergeSlot(sdn.buttonIconic2, props.buttonIconic2, props.seldonRefs),
)
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2, props.seldonRefs))
const formControl4Props = computed(() =>
  mergeOptionalSlot(sdn.formControl4, props.formControl4, props.seldonRefs),
)
const textLabel4Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel4, props.textLabel4, props.seldonRefs),
)
const input4Props = computed(() => mergeSlot(sdn.input4, props.input4, props.seldonRefs))
const formControlRadioProps = computed(() =>
  mergeOptionalSlot(sdn.formControlRadio, props.formControlRadio, props.seldonRefs),
)
const textLabel5Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel5, props.textLabel5, props.seldonRefs),
)
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const formControlRadioButtonControlProps = computed(() =>
  mergeOptionalSlot(
    sdn.formControlRadioButtonControl,
    props.formControlRadioButtonControl,
    props.seldonRefs,
  ),
)
const inputRadioButtonProps = computed(() =>
  mergeOptionalSlot(sdn.inputRadioButton, props.inputRadioButton, props.seldonRefs),
)
const textLabel6Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel6, props.textLabel6, props.seldonRefs),
)
const formControlRadioButtonControl2Props = computed(() =>
  mergeOptionalSlot(
    sdn.formControlRadioButtonControl2,
    props.formControlRadioButtonControl2,
    props.seldonRefs,
  ),
)
const inputRadioButton2Props = computed(() =>
  mergeOptionalSlot(sdn.inputRadioButton2, props.inputRadioButton2, props.seldonRefs),
)
const textLabel7Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel7, props.textLabel7, props.seldonRefs),
)
const fieldsetProps = computed(() =>
  mergeOptionalSlot(sdn.fieldset, props.fieldset, props.seldonRefs),
)
const legendProps = computed(() => mergeSlot(sdn.legend, props.legend, props.seldonRefs))
const formControlRadio2Props = computed(() =>
  mergeSlot(sdn.formControlRadio2, props.formControlRadio2, props.seldonRefs),
)
const textLabel8Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel8, props.textLabel8, props.seldonRefs),
)
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3, props.seldonRefs))
const formControlRadioButtonControl3Props = computed(() =>
  mergeOptionalSlot(
    sdn.formControlRadioButtonControl3,
    props.formControlRadioButtonControl3,
    props.seldonRefs,
  ),
)
const inputRadioButton3Props = computed(() =>
  mergeOptionalSlot(sdn.inputRadioButton3, props.inputRadioButton3, props.seldonRefs),
)
const textLabel9Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel9, props.textLabel9, props.seldonRefs),
)
const formControlRadioButtonControl4Props = computed(() =>
  mergeOptionalSlot(
    sdn.formControlRadioButtonControl4,
    props.formControlRadioButtonControl4,
    props.seldonRefs,
  ),
)
const inputRadioButton4Props = computed(() =>
  mergeOptionalSlot(sdn.inputRadioButton4, props.inputRadioButton4, props.seldonRefs),
)
const textLabel10Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel10, props.textLabel10, props.seldonRefs),
)
const formControlRadio3Props = computed(() =>
  mergeSlot(sdn.formControlRadio3, props.formControlRadio3, props.seldonRefs),
)
const textLabel11Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel11, props.textLabel11, props.seldonRefs),
)
const frame4Props = computed(() => mergeSlot(sdn.frame4, props.frame4, props.seldonRefs))
const formControlRadioButtonControl5Props = computed(() =>
  mergeOptionalSlot(
    sdn.formControlRadioButtonControl5,
    props.formControlRadioButtonControl5,
    props.seldonRefs,
  ),
)
const inputRadioButton5Props = computed(() =>
  mergeOptionalSlot(sdn.inputRadioButton5, props.inputRadioButton5, props.seldonRefs),
)
const textLabel12Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel12, props.textLabel12, props.seldonRefs),
)
const formControlRadioButtonControl6Props = computed(() =>
  mergeOptionalSlot(
    sdn.formControlRadioButtonControl6,
    props.formControlRadioButtonControl6,
    props.seldonRefs,
  ),
)
const inputRadioButton6Props = computed(() =>
  mergeOptionalSlot(sdn.inputRadioButton6, props.inputRadioButton6, props.seldonRefs),
)
const textLabel13Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel13, props.textLabel13, props.seldonRefs),
)
const formControlRadio4Props = computed(() =>
  mergeOptionalSlot(sdn.formControlRadio4, props.formControlRadio4, props.seldonRefs),
)
const textLabel14Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel14, props.textLabel14, props.seldonRefs),
)
const frame5Props = computed(() => mergeSlot(sdn.frame5, props.frame5, props.seldonRefs))
const formControlRadioButtonControl7Props = computed(() =>
  mergeOptionalSlot(
    sdn.formControlRadioButtonControl7,
    props.formControlRadioButtonControl7,
    props.seldonRefs,
  ),
)
const inputRadioButton7Props = computed(() =>
  mergeOptionalSlot(sdn.inputRadioButton7, props.inputRadioButton7, props.seldonRefs),
)
const textLabel15Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel15, props.textLabel15, props.seldonRefs),
)
const formControlRadioButtonControl8Props = computed(() =>
  mergeOptionalSlot(
    sdn.formControlRadioButtonControl8,
    props.formControlRadioButtonControl8,
    props.seldonRefs,
  ),
)
const inputRadioButton8Props = computed(() =>
  mergeOptionalSlot(sdn.inputRadioButton8, props.inputRadioButton8, props.seldonRefs),
)
const textLabel16Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel16, props.textLabel16, props.seldonRefs),
)
const formControlRadio5Props = computed(() =>
  mergeOptionalSlot(sdn.formControlRadio5, props.formControlRadio5, props.seldonRefs),
)
const textLabel17Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel17, props.textLabel17, props.seldonRefs),
)
const frame6Props = computed(() => mergeSlot(sdn.frame6, props.frame6, props.seldonRefs))
const formControlRadioButtonControl9Props = computed(() =>
  mergeOptionalSlot(
    sdn.formControlRadioButtonControl9,
    props.formControlRadioButtonControl9,
    props.seldonRefs,
  ),
)
const inputRadioButton9Props = computed(() =>
  mergeOptionalSlot(sdn.inputRadioButton9, props.inputRadioButton9, props.seldonRefs),
)
const textLabel18Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel18, props.textLabel18, props.seldonRefs),
)
const formControlRadioButtonControl10Props = computed(() =>
  mergeOptionalSlot(
    sdn.formControlRadioButtonControl10,
    props.formControlRadioButtonControl10,
    props.seldonRefs,
  ),
)
const inputRadioButton10Props = computed(() =>
  mergeOptionalSlot(sdn.inputRadioButton10, props.inputRadioButton10, props.seldonRefs),
)
const textLabel19Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel19, props.textLabel19, props.seldonRefs),
)
const formControlRadio6Props = computed(() =>
  mergeOptionalSlot(sdn.formControlRadio6, props.formControlRadio6, props.seldonRefs),
)
const textLabel20Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel20, props.textLabel20, props.seldonRefs),
)
const frame7Props = computed(() => mergeSlot(sdn.frame7, props.frame7, props.seldonRefs))
const formControlRadioButtonControl11Props = computed(() =>
  mergeOptionalSlot(
    sdn.formControlRadioButtonControl11,
    props.formControlRadioButtonControl11,
    props.seldonRefs,
  ),
)
const inputRadioButton11Props = computed(() =>
  mergeOptionalSlot(sdn.inputRadioButton11, props.inputRadioButton11, props.seldonRefs),
)
const textLabel21Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel21, props.textLabel21, props.seldonRefs),
)
const formControlRadioButtonControl12Props = computed(() =>
  mergeOptionalSlot(
    sdn.formControlRadioButtonControl12,
    props.formControlRadioButtonControl12,
    props.seldonRefs,
  ),
)
const inputRadioButton12Props = computed(() =>
  mergeOptionalSlot(sdn.inputRadioButton12, props.inputRadioButton12, props.seldonRefs),
)
const textLabel22Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel22, props.textLabel22, props.seldonRefs),
)
const formControlRadio7Props = computed(() =>
  mergeOptionalSlot(sdn.formControlRadio7, props.formControlRadio7, props.seldonRefs),
)
const textLabel23Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel23, props.textLabel23, props.seldonRefs),
)
const frame8Props = computed(() => mergeSlot(sdn.frame8, props.frame8, props.seldonRefs))
const formControlRadioButtonControl13Props = computed(() =>
  mergeOptionalSlot(
    sdn.formControlRadioButtonControl13,
    props.formControlRadioButtonControl13,
    props.seldonRefs,
  ),
)
const inputRadioButton13Props = computed(() =>
  mergeOptionalSlot(sdn.inputRadioButton13, props.inputRadioButton13, props.seldonRefs),
)
const textLabel24Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel24, props.textLabel24, props.seldonRefs),
)
const formControlRadioButtonControl14Props = computed(() =>
  mergeOptionalSlot(
    sdn.formControlRadioButtonControl14,
    props.formControlRadioButtonControl14,
    props.seldonRefs,
  ),
)
const inputRadioButton14Props = computed(() =>
  mergeOptionalSlot(sdn.inputRadioButton14, props.inputRadioButton14, props.seldonRefs),
)
const textLabel25Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel25, props.textLabel25, props.seldonRefs),
)
const barButtonsProps = computed(() =>
  mergeSlot(sdn.barButtons, props.barButtons, props.seldonRefs),
)
const buttonProps = computed(() => mergeSlot(sdn.button, props.button, props.seldonRefs))
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3, props.seldonRefs))
const textLabel26Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel26, props.textLabel26, props.seldonRefs),
)
const button2Props = computed(() => mergeSlot(sdn.button2, props.button2, props.seldonRefs))
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4, props.seldonRefs))
const textLabel27Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel27, props.textLabel27, props.seldonRefs),
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
          <ComboboxField
            v-if="comboboxFieldProps !== null"
            v-bind="comboboxFieldProps"
            :input="input2Props"
            :buttonIconic="buttonIconicProps"
            :icon2="iconProps"
            :icon="null"
          />
        </FormControl>
        <FormControl v-if="formControl3Props !== null" v-bind="formControl3Props">
          <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
          <ComboboxField
            v-if="comboboxField2Props !== null"
            v-bind="comboboxField2Props"
            :input="input3Props"
            :buttonIconic="buttonIconic2Props"
            :icon2="icon2Props"
            :icon="null"
          />
        </FormControl>
        <FormControl v-if="formControl4Props !== null" v-bind="formControl4Props">
          <TextLabel v-if="textLabel4Props !== null" v-bind="textLabel4Props" />
          <Input v-if="input4Props !== null" v-bind="input4Props" />
        </FormControl>
        <FormControlRadio v-if="formControlRadioProps !== null" v-bind="formControlRadioProps">
          <TextLabel v-if="textLabel5Props !== null" v-bind="textLabel5Props" />
          <Frame v-bind="frame2Props" v-if="frame2Props !== null">
            <FormControlRadioButtonControl
              v-if="formControlRadioButtonControlProps !== null"
              v-bind="formControlRadioButtonControlProps"
            >
              <InputRadioButton
                v-if="inputRadioButtonProps !== null"
                v-bind="inputRadioButtonProps"
              />
              <TextLabel v-if="textLabel6Props !== null" v-bind="textLabel6Props" />
            </FormControlRadioButtonControl>
            <FormControlRadioButtonControl
              v-if="formControlRadioButtonControl2Props !== null"
              v-bind="formControlRadioButtonControl2Props"
            >
              <InputRadioButton
                v-if="inputRadioButton2Props !== null"
                v-bind="inputRadioButton2Props"
              />
              <TextLabel v-if="textLabel7Props !== null" v-bind="textLabel7Props" />
            </FormControlRadioButtonControl>
          </Frame>
        </FormControlRadio>
        <Fieldset v-if="fieldsetProps !== null" v-bind="fieldsetProps">
          <Legend v-if="legendProps !== null" v-bind="legendProps" />
          <FormControlRadio v-if="formControlRadio2Props !== null" v-bind="formControlRadio2Props">
            <TextLabel v-if="textLabel8Props !== null" v-bind="textLabel8Props" />
            <Frame v-bind="frame3Props" v-if="frame3Props !== null">
              <FormControlRadioButtonControl
                v-if="formControlRadioButtonControl3Props !== null"
                v-bind="formControlRadioButtonControl3Props"
              >
                <InputRadioButton
                  v-if="inputRadioButton3Props !== null"
                  v-bind="inputRadioButton3Props"
                />
                <TextLabel v-if="textLabel9Props !== null" v-bind="textLabel9Props" />
              </FormControlRadioButtonControl>
              <FormControlRadioButtonControl
                v-if="formControlRadioButtonControl4Props !== null"
                v-bind="formControlRadioButtonControl4Props"
              >
                <InputRadioButton
                  v-if="inputRadioButton4Props !== null"
                  v-bind="inputRadioButton4Props"
                />
                <TextLabel v-if="textLabel10Props !== null" v-bind="textLabel10Props" />
              </FormControlRadioButtonControl>
            </Frame>
          </FormControlRadio>
          <FormControlRadio v-if="formControlRadio3Props !== null" v-bind="formControlRadio3Props">
            <TextLabel v-if="textLabel11Props !== null" v-bind="textLabel11Props" />
            <Frame v-bind="frame4Props" v-if="frame4Props !== null">
              <FormControlRadioButtonControl
                v-if="formControlRadioButtonControl5Props !== null"
                v-bind="formControlRadioButtonControl5Props"
              >
                <InputRadioButton
                  v-if="inputRadioButton5Props !== null"
                  v-bind="inputRadioButton5Props"
                />
                <TextLabel v-if="textLabel12Props !== null" v-bind="textLabel12Props" />
              </FormControlRadioButtonControl>
              <FormControlRadioButtonControl
                v-if="formControlRadioButtonControl6Props !== null"
                v-bind="formControlRadioButtonControl6Props"
              >
                <InputRadioButton
                  v-if="inputRadioButton6Props !== null"
                  v-bind="inputRadioButton6Props"
                />
                <TextLabel v-if="textLabel13Props !== null" v-bind="textLabel13Props" />
              </FormControlRadioButtonControl>
            </Frame>
          </FormControlRadio>
          <FormControlRadio v-if="formControlRadio4Props !== null" v-bind="formControlRadio4Props">
            <TextLabel v-if="textLabel14Props !== null" v-bind="textLabel14Props" />
            <Frame v-bind="frame5Props" v-if="frame5Props !== null">
              <FormControlRadioButtonControl
                v-if="formControlRadioButtonControl7Props !== null"
                v-bind="formControlRadioButtonControl7Props"
              >
                <InputRadioButton
                  v-if="inputRadioButton7Props !== null"
                  v-bind="inputRadioButton7Props"
                />
                <TextLabel v-if="textLabel15Props !== null" v-bind="textLabel15Props" />
              </FormControlRadioButtonControl>
              <FormControlRadioButtonControl
                v-if="formControlRadioButtonControl8Props !== null"
                v-bind="formControlRadioButtonControl8Props"
              >
                <InputRadioButton
                  v-if="inputRadioButton8Props !== null"
                  v-bind="inputRadioButton8Props"
                />
                <TextLabel v-if="textLabel16Props !== null" v-bind="textLabel16Props" />
              </FormControlRadioButtonControl>
            </Frame>
          </FormControlRadio>
          <FormControlRadio v-if="formControlRadio5Props !== null" v-bind="formControlRadio5Props">
            <TextLabel v-if="textLabel17Props !== null" v-bind="textLabel17Props" />
            <Frame v-bind="frame6Props" v-if="frame6Props !== null">
              <FormControlRadioButtonControl
                v-if="formControlRadioButtonControl9Props !== null"
                v-bind="formControlRadioButtonControl9Props"
              >
                <InputRadioButton
                  v-if="inputRadioButton9Props !== null"
                  v-bind="inputRadioButton9Props"
                />
                <TextLabel v-if="textLabel18Props !== null" v-bind="textLabel18Props" />
              </FormControlRadioButtonControl>
              <FormControlRadioButtonControl
                v-if="formControlRadioButtonControl10Props !== null"
                v-bind="formControlRadioButtonControl10Props"
              >
                <InputRadioButton
                  v-if="inputRadioButton10Props !== null"
                  v-bind="inputRadioButton10Props"
                />
                <TextLabel v-if="textLabel19Props !== null" v-bind="textLabel19Props" />
              </FormControlRadioButtonControl>
            </Frame>
          </FormControlRadio>
          <FormControlRadio v-if="formControlRadio6Props !== null" v-bind="formControlRadio6Props">
            <TextLabel v-if="textLabel20Props !== null" v-bind="textLabel20Props" />
            <Frame v-bind="frame7Props" v-if="frame7Props !== null">
              <FormControlRadioButtonControl
                v-if="formControlRadioButtonControl11Props !== null"
                v-bind="formControlRadioButtonControl11Props"
              >
                <InputRadioButton
                  v-if="inputRadioButton11Props !== null"
                  v-bind="inputRadioButton11Props"
                />
                <TextLabel v-if="textLabel21Props !== null" v-bind="textLabel21Props" />
              </FormControlRadioButtonControl>
              <FormControlRadioButtonControl
                v-if="formControlRadioButtonControl12Props !== null"
                v-bind="formControlRadioButtonControl12Props"
              >
                <InputRadioButton
                  v-if="inputRadioButton12Props !== null"
                  v-bind="inputRadioButton12Props"
                />
                <TextLabel v-if="textLabel22Props !== null" v-bind="textLabel22Props" />
              </FormControlRadioButtonControl>
            </Frame>
          </FormControlRadio>
          <FormControlRadio v-if="formControlRadio7Props !== null" v-bind="formControlRadio7Props">
            <TextLabel v-if="textLabel23Props !== null" v-bind="textLabel23Props" />
            <Frame v-bind="frame8Props" v-if="frame8Props !== null">
              <FormControlRadioButtonControl
                v-if="formControlRadioButtonControl13Props !== null"
                v-bind="formControlRadioButtonControl13Props"
              >
                <InputRadioButton
                  v-if="inputRadioButton13Props !== null"
                  v-bind="inputRadioButton13Props"
                />
                <TextLabel v-if="textLabel24Props !== null" v-bind="textLabel24Props" />
              </FormControlRadioButtonControl>
              <FormControlRadioButtonControl
                v-if="formControlRadioButtonControl14Props !== null"
                v-bind="formControlRadioButtonControl14Props"
              >
                <InputRadioButton
                  v-if="inputRadioButton14Props !== null"
                  v-bind="inputRadioButton14Props"
                />
                <TextLabel v-if="textLabel25Props !== null" v-bind="textLabel25Props" />
              </FormControlRadioButtonControl>
            </Frame>
          </FormControlRadio>
        </Fieldset>
      </Frame>
      <BarButtons
        v-if="barButtonsProps !== null"
        v-bind="barButtonsProps"
        :button4="buttonProps"
        :icon4="icon3Props"
        :textLabel4="textLabel26Props"
        :button5="button2Props"
        :icon5="icon4Props"
        :textLabel5="textLabel27Props"
      />
    </slot>
  </div>
</template>
