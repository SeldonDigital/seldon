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
import { FormControlCombobox, FormControlComboboxProps } from "../elements/FormControlCombobox"
import { ItemCatalog, ItemCatalogProps } from "../elements/ItemCatalog"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { Bar, BarProps } from "../parts/Bar"
import { BarButtons, BarButtonsProps } from "../parts/BarButtons"
import { Icon, IconProps } from "../primitives/Icon"
import { Input, InputProps } from "../primitives/Input"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { TextSubtitle, TextSubtitleProps } from "../primitives/TextSubtitle"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface DialogCreateComponentProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  bar?: BarProps | null
  textTitle?: TextTitleProps | null

  frame?: FrameProps | null
  itemCatalog?: ItemCatalogProps | null
  icon?: IconProps | null
  frame2?: FrameProps | null
  textTitle2?: TextTitleProps | null
  textSubtitle?: TextSubtitleProps | null
  itemCatalog2?: ItemCatalogProps | null
  icon2?: IconProps | null
  frame3?: FrameProps | null
  textTitle3?: TextTitleProps | null
  textSubtitle2?: TextSubtitleProps | null

  frame4?: FrameProps | null
  formControl?: FormControlProps | null
  textLabel?: TextLabelProps | null
  input?: InputProps | null
  formControlCombobox?: FormControlComboboxProps | null
  textLabel2?: TextLabelProps | null
  comboboxField?: ComboboxFieldProps | null
  input2?: InputProps | null
  buttonIconic?: ButtonIconicProps | null
  icon3?: IconProps | null
  formControl2?: FormControlProps | null
  textLabel3?: TextLabelProps | null
  input3?: InputProps | null
  formControl3?: FormControlProps | null
  textLabel4?: TextLabelProps | null
  input4?: InputProps | null

  barButtons?: BarButtonsProps | null
  button?: ButtonProps | null
  icon4?: IconProps | null
  textLabel5?: TextLabelProps | null
  button2?: ButtonProps | null
  icon5?: IconProps | null
  textLabel6?: TextLabelProps | null
}

//
// Default property values
//
const sdn: DialogCreateComponentProps = {
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
 * ```tsx
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
export function DialogCreateComponent({
  className = "",
  bar,
  textTitle,

  frame,
  itemCatalog,
  icon,
  frame2,
  textTitle2,
  textSubtitle,
  itemCatalog2,
  icon2,
  frame3,
  textTitle3,
  textSubtitle2,

  frame4,
  formControl,
  textLabel,
  input,
  formControlCombobox,
  textLabel2,
  comboboxField,
  input2,
  buttonIconic,
  icon3,
  formControl2,
  textLabel3,
  input3,
  formControl3,
  textLabel4,
  input4,

  barButtons,
  button,
  icon4,
  textLabel5,
  button2,
  icon5,
  textLabel6,

  children,
  seldonRefs,
  ...props
}: DialogCreateComponentProps) {
  const dialogCreateComponentClassName = combineClassNames("sdn-dialog-create-component", className)

  const barProps = mergeSlot(sdn.bar, bar, seldonRefs)
  const textTitleProps = mergeOptionalSlot(sdn.textTitle, textTitle, seldonRefs)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const itemCatalogProps = mergeOptionalSlot(sdn.itemCatalog, itemCatalog, seldonRefs)
  const iconProps = mergeOptionalSlot(sdn.icon, icon, seldonRefs)
  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const textTitle2Props = mergeOptionalSlot(sdn.textTitle2, textTitle2, seldonRefs)
  const textSubtitleProps = mergeOptionalSlot(sdn.textSubtitle, textSubtitle, seldonRefs)
  const itemCatalog2Props = mergeOptionalSlot(sdn.itemCatalog2, itemCatalog2, seldonRefs)
  const icon2Props = mergeOptionalSlot(sdn.icon2, icon2, seldonRefs)
  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const textTitle3Props = mergeOptionalSlot(sdn.textTitle3, textTitle3, seldonRefs)
  const textSubtitle2Props = mergeOptionalSlot(sdn.textSubtitle2, textSubtitle2, seldonRefs)

  const frame4Props = mergeSlot(sdn.frame4, frame4, seldonRefs)
  const formControlProps = mergeOptionalSlot(sdn.formControl, formControl, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const inputProps = mergeSlot(sdn.input, input, seldonRefs)
  const formControlComboboxProps = mergeOptionalSlot(
    sdn.formControlCombobox,
    formControlCombobox,
    seldonRefs,
  )
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const comboboxFieldProps = mergeSlot(sdn.comboboxField, comboboxField, seldonRefs)
  const input2Props = mergeSlot(sdn.input2, input2, seldonRefs)
  const buttonIconicProps = mergeSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)
  const formControl2Props = mergeOptionalSlot(sdn.formControl2, formControl2, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)
  const input3Props = mergeSlot(sdn.input3, input3, seldonRefs)
  const formControl3Props = mergeOptionalSlot(sdn.formControl3, formControl3, seldonRefs)
  const textLabel4Props = mergeOptionalSlot(sdn.textLabel4, textLabel4, seldonRefs)
  const input4Props = mergeSlot(sdn.input4, input4, seldonRefs)

  const barButtonsProps = mergeSlot(sdn.barButtons, barButtons, seldonRefs)
  const buttonProps = mergeSlot(sdn.button, button, seldonRefs)
  const icon4Props = mergeSlot(sdn.icon4, icon4, seldonRefs)
  const textLabel5Props = mergeOptionalSlot(sdn.textLabel5, textLabel5, seldonRefs)
  const button2Props = mergeSlot(sdn.button2, button2, seldonRefs)
  const icon5Props = mergeSlot(sdn.icon5, icon5, seldonRefs)
  const textLabel6Props = mergeOptionalSlot(sdn.textLabel6, textLabel6, seldonRefs)

  return (
    <HTMLDiv className={dialogCreateComponentClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {barProps !== null && (
            <Bar {...barProps}>{textTitleProps !== null && <TextTitle {...textTitleProps} />}</Bar>
          )}
          <Frame {...frameProps}>
            {itemCatalogProps !== null && (
              <ItemCatalog {...itemCatalogProps}>
                {iconProps !== null && <Icon {...iconProps} />}
                <Frame {...frame2Props}>
                  {textTitle2Props !== null && <TextTitle {...textTitle2Props} />}
                  {textSubtitleProps !== null && <TextSubtitle {...textSubtitleProps} />}
                </Frame>
              </ItemCatalog>
            )}
            {itemCatalog2Props !== null && (
              <ItemCatalog {...itemCatalog2Props}>
                {icon2Props !== null && <Icon {...icon2Props} />}
                <Frame {...frame3Props}>
                  {textTitle3Props !== null && <TextTitle {...textTitle3Props} />}
                  {textSubtitle2Props !== null && <TextSubtitle {...textSubtitle2Props} />}
                </Frame>
              </ItemCatalog>
            )}
          </Frame>
          <Frame {...frame4Props}>
            {formControlProps !== null && (
              <FormControl {...formControlProps}>
                {textLabelProps !== null && <TextLabel {...textLabelProps} />}
                {inputProps !== null && <Input {...inputProps} />}
              </FormControl>
            )}
            {formControlComboboxProps !== null && (
              <FormControlCombobox {...formControlComboboxProps}>
                {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
                {comboboxFieldProps !== null && (
                  <ComboboxField
                    {...comboboxFieldProps}
                    input={input2Props}
                    buttonIconic={buttonIconicProps}
                    icon2={icon3Props}
                    icon={null}
                  />
                )}
              </FormControlCombobox>
            )}
            {formControl2Props !== null && (
              <FormControl {...formControl2Props}>
                {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
                {input3Props !== null && <Input {...input3Props} />}
              </FormControl>
            )}
            {formControl3Props !== null && (
              <FormControl {...formControl3Props}>
                {textLabel4Props !== null && <TextLabel {...textLabel4Props} />}
                {input4Props !== null && <Input {...input4Props} />}
              </FormControl>
            )}
          </Frame>
          {barButtonsProps !== null && (
            <BarButtons
              {...barButtonsProps}
              button4={buttonProps}
              icon4={icon4Props}
              textLabel4={textLabel5Props}
              button5={button2Props}
              icon5={icon5Props}
              textLabel5={textLabel6Props}
            />
          )}
        </>
      )}
    </HTMLDiv>
  )
}
