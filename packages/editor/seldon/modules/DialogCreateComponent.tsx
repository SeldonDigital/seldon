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
import {
  FormControlCombobox,
  FormControlComboboxProps,
} from "../elements/FormControlCombobox"
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
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface DialogCreateComponentProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
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

/*****
 * Module: DialogCreateComponent
 * Level: Module
 * Intent:
 * Tags:
 * Type: Inline
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
 *****/
export function DialogCreateComponent({
  className = "",
  bar = sdn.bar,
  textTitle,
  frame = sdn.frame,
  itemCatalog,
  icon,
  frame2 = sdn.frame2,
  textTitle2,
  textSubtitle,
  itemCatalog2,
  icon2,
  frame3 = sdn.frame3,
  textTitle3,
  textSubtitle2,
  frame4 = sdn.frame4,
  formControl,
  textLabel,
  input = sdn.input,
  formControlCombobox,
  textLabel2,
  comboboxField = sdn.comboboxField,
  input2 = sdn.input2,
  buttonIconic = sdn.buttonIconic,
  icon3 = sdn.icon3,
  formControl2,
  textLabel3,
  input3 = sdn.input3,
  formControl3,
  textLabel4,
  input4 = sdn.input4,
  barButtons = sdn.barButtons,
  button = sdn.button,
  icon4 = sdn.icon4,
  textLabel5,
  button2 = sdn.button2,
  icon5 = sdn.icon5,
  textLabel6,
  children,
  seldonRefs,
  ...props
}: DialogCreateComponentProps) {
  const dialogCreateComponentClassName = combineClassNames(
    "sdn-dialog",
    className,
  )
  const barProps = applyRef(
    seldonRefs,
    bar === null
      ? null
      : {
          ...sdn.bar,
          ...bar,
          className: combineClassNames(sdn.bar?.className, bar?.className),
        },
  )
  const textTitleProps = applyRef(
    seldonRefs,
    textTitle === null
      ? null
      : {
          ...sdn.textTitle,
          ...textTitle,
          className: combineClassNames(
            sdn.textTitle?.className,
            textTitle?.className,
          ),
        },
  )
  const frameProps = applyRef(
    seldonRefs,
    frame === null
      ? null
      : {
          ...sdn.frame,
          ...frame,
          className: combineClassNames(sdn.frame?.className, frame?.className),
        },
  )
  const itemCatalogProps = applyRef(
    seldonRefs,
    itemCatalog === null
      ? null
      : {
          ...sdn.itemCatalog,
          ...itemCatalog,
          className: combineClassNames(
            sdn.itemCatalog?.className,
            itemCatalog?.className,
          ),
        },
  )
  const iconProps = applyRef(
    seldonRefs,
    icon === null
      ? null
      : {
          ...sdn.icon,
          ...icon,
          className: combineClassNames(sdn.icon?.className, icon?.className),
        },
  )
  const frame2Props = applyRef(
    seldonRefs,
    frame2 === null
      ? null
      : {
          ...sdn.frame2,
          ...frame2,
          className: combineClassNames(
            sdn.frame2?.className,
            frame2?.className,
          ),
        },
  )
  const textTitle2Props = applyRef(
    seldonRefs,
    textTitle2 === null
      ? null
      : {
          ...sdn.textTitle2,
          ...textTitle2,
          className: combineClassNames(
            sdn.textTitle2?.className,
            textTitle2?.className,
          ),
        },
  )
  const textSubtitleProps = applyRef(
    seldonRefs,
    textSubtitle === null
      ? null
      : {
          ...sdn.textSubtitle,
          ...textSubtitle,
          className: combineClassNames(
            sdn.textSubtitle?.className,
            textSubtitle?.className,
          ),
        },
  )
  const itemCatalog2Props = applyRef(
    seldonRefs,
    itemCatalog2 === null
      ? null
      : {
          ...sdn.itemCatalog2,
          ...itemCatalog2,
          className: combineClassNames(
            sdn.itemCatalog2?.className,
            itemCatalog2?.className,
          ),
        },
  )
  const icon2Props = applyRef(
    seldonRefs,
    icon2 === null
      ? null
      : {
          ...sdn.icon2,
          ...icon2,
          className: combineClassNames(sdn.icon2?.className, icon2?.className),
        },
  )
  const frame3Props = applyRef(
    seldonRefs,
    frame3 === null
      ? null
      : {
          ...sdn.frame3,
          ...frame3,
          className: combineClassNames(
            sdn.frame3?.className,
            frame3?.className,
          ),
        },
  )
  const textTitle3Props = applyRef(
    seldonRefs,
    textTitle3 === null
      ? null
      : {
          ...sdn.textTitle3,
          ...textTitle3,
          className: combineClassNames(
            sdn.textTitle3?.className,
            textTitle3?.className,
          ),
        },
  )
  const textSubtitle2Props = applyRef(
    seldonRefs,
    textSubtitle2 === null
      ? null
      : {
          ...sdn.textSubtitle2,
          ...textSubtitle2,
          className: combineClassNames(
            sdn.textSubtitle2?.className,
            textSubtitle2?.className,
          ),
        },
  )
  const frame4Props = applyRef(
    seldonRefs,
    frame4 === null
      ? null
      : {
          ...sdn.frame4,
          ...frame4,
          className: combineClassNames(
            sdn.frame4?.className,
            frame4?.className,
          ),
        },
  )
  const formControlProps = applyRef(
    seldonRefs,
    formControl === null
      ? null
      : {
          ...sdn.formControl,
          ...formControl,
          className: combineClassNames(
            sdn.formControl?.className,
            formControl?.className,
          ),
        },
  )
  const textLabelProps = applyRef(
    seldonRefs,
    textLabel === null
      ? null
      : {
          ...sdn.textLabel,
          ...textLabel,
          className: combineClassNames(
            sdn.textLabel?.className,
            textLabel?.className,
          ),
        },
  )
  const inputProps = applyRef(
    seldonRefs,
    input === null
      ? null
      : {
          ...sdn.input,
          ...input,
          className: combineClassNames(sdn.input?.className, input?.className),
        },
  )
  const formControlComboboxProps = applyRef(
    seldonRefs,
    formControlCombobox === null
      ? null
      : {
          ...sdn.formControlCombobox,
          ...formControlCombobox,
          className: combineClassNames(
            sdn.formControlCombobox?.className,
            formControlCombobox?.className,
          ),
        },
  )
  const textLabel2Props = applyRef(
    seldonRefs,
    textLabel2 === null
      ? null
      : {
          ...sdn.textLabel2,
          ...textLabel2,
          className: combineClassNames(
            sdn.textLabel2?.className,
            textLabel2?.className,
          ),
        },
  )
  const comboboxFieldProps = applyRef(
    seldonRefs,
    comboboxField === null
      ? null
      : {
          ...sdn.comboboxField,
          ...comboboxField,
          className: combineClassNames(
            sdn.comboboxField?.className,
            comboboxField?.className,
          ),
        },
  )
  const input2Props = applyRef(
    seldonRefs,
    input2 === null
      ? null
      : {
          ...sdn.input2,
          ...input2,
          className: combineClassNames(
            sdn.input2?.className,
            input2?.className,
          ),
        },
  )
  const buttonIconicProps = applyRef(
    seldonRefs,
    buttonIconic === null
      ? null
      : {
          ...sdn.buttonIconic,
          ...buttonIconic,
          className: combineClassNames(
            sdn.buttonIconic?.className,
            buttonIconic?.className,
          ),
        },
  )
  const icon3Props = applyRef(
    seldonRefs,
    icon3 === null
      ? null
      : {
          ...sdn.icon3,
          ...icon3,
          className: combineClassNames(sdn.icon3?.className, icon3?.className),
        },
  )
  const formControl2Props = applyRef(
    seldonRefs,
    formControl2 === null
      ? null
      : {
          ...sdn.formControl2,
          ...formControl2,
          className: combineClassNames(
            sdn.formControl2?.className,
            formControl2?.className,
          ),
        },
  )
  const textLabel3Props = applyRef(
    seldonRefs,
    textLabel3 === null
      ? null
      : {
          ...sdn.textLabel3,
          ...textLabel3,
          className: combineClassNames(
            sdn.textLabel3?.className,
            textLabel3?.className,
          ),
        },
  )
  const input3Props = applyRef(
    seldonRefs,
    input3 === null
      ? null
      : {
          ...sdn.input3,
          ...input3,
          className: combineClassNames(
            sdn.input3?.className,
            input3?.className,
          ),
        },
  )
  const formControl3Props = applyRef(
    seldonRefs,
    formControl3 === null
      ? null
      : {
          ...sdn.formControl3,
          ...formControl3,
          className: combineClassNames(
            sdn.formControl3?.className,
            formControl3?.className,
          ),
        },
  )
  const textLabel4Props = applyRef(
    seldonRefs,
    textLabel4 === null
      ? null
      : {
          ...sdn.textLabel4,
          ...textLabel4,
          className: combineClassNames(
            sdn.textLabel4?.className,
            textLabel4?.className,
          ),
        },
  )
  const input4Props = applyRef(
    seldonRefs,
    input4 === null
      ? null
      : {
          ...sdn.input4,
          ...input4,
          className: combineClassNames(
            sdn.input4?.className,
            input4?.className,
          ),
        },
  )
  const barButtonsProps = applyRef(
    seldonRefs,
    barButtons === null
      ? null
      : {
          ...sdn.barButtons,
          ...barButtons,
          className: combineClassNames(
            sdn.barButtons?.className,
            barButtons?.className,
          ),
        },
  )
  const buttonProps = applyRef(
    seldonRefs,
    button === null
      ? null
      : {
          ...sdn.button,
          ...button,
          className: combineClassNames(
            sdn.button?.className,
            button?.className,
          ),
        },
  )
  const icon4Props = applyRef(
    seldonRefs,
    icon4 === null
      ? null
      : {
          ...sdn.icon4,
          ...icon4,
          className: combineClassNames(sdn.icon4?.className, icon4?.className),
        },
  )
  const textLabel5Props = applyRef(
    seldonRefs,
    textLabel5 === null
      ? null
      : {
          ...sdn.textLabel5,
          ...textLabel5,
          className: combineClassNames(
            sdn.textLabel5?.className,
            textLabel5?.className,
          ),
        },
  )
  const button2Props = applyRef(
    seldonRefs,
    button2 === null
      ? null
      : {
          ...sdn.button2,
          ...button2,
          className: combineClassNames(
            sdn.button2?.className,
            button2?.className,
          ),
        },
  )
  const icon5Props = applyRef(
    seldonRefs,
    icon5 === null
      ? null
      : {
          ...sdn.icon5,
          ...icon5,
          className: combineClassNames(sdn.icon5?.className, icon5?.className),
        },
  )
  const textLabel6Props = applyRef(
    seldonRefs,
    textLabel6 === null
      ? null
      : {
          ...sdn.textLabel6,
          ...textLabel6,
          className: combineClassNames(
            sdn.textLabel6?.className,
            textLabel6?.className,
          ),
        },
  )

  return (
    <HTMLDiv
      className={dialogCreateComponentClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {barProps !== null && (
            <Bar {...barProps}>
              {textTitle && textTitleProps && <TextTitle {...textTitleProps} />}
            </Bar>
          )}
          <Frame {...frameProps}>
            {itemCatalog && itemCatalogProps && (
              <ItemCatalog {...itemCatalogProps}>
                {icon && iconProps && <Icon {...iconProps} />}
                <Frame {...frame2Props}>
                  {textTitle2 && textTitle2Props && (
                    <TextTitle {...textTitle2Props} />
                  )}
                  {textSubtitle && textSubtitleProps && (
                    <TextSubtitle {...textSubtitleProps} />
                  )}
                </Frame>
              </ItemCatalog>
            )}
            {itemCatalog2 && itemCatalog2Props && (
              <ItemCatalog {...itemCatalog2Props}>
                {icon2 && icon2Props && <Icon {...icon2Props} />}
                <Frame {...frame3Props}>
                  {textTitle3 && textTitle3Props && (
                    <TextTitle {...textTitle3Props} />
                  )}
                  {textSubtitle2 && textSubtitle2Props && (
                    <TextSubtitle {...textSubtitle2Props} />
                  )}
                </Frame>
              </ItemCatalog>
            )}
          </Frame>
          <Frame {...frame4Props}>
            {formControl && formControlProps && (
              <FormControl {...formControlProps}>
                {textLabel && textLabelProps && (
                  <TextLabel {...textLabelProps} />
                )}
                {input && inputProps && <Input {...inputProps} />}
              </FormControl>
            )}
            {formControlCombobox && formControlComboboxProps && (
              <FormControlCombobox {...formControlComboboxProps}>
                {textLabel2 && textLabel2Props && (
                  <TextLabel {...textLabel2Props} />
                )}
                {comboboxField && comboboxFieldProps && (
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
            {formControl2 && formControl2Props && (
              <FormControl {...formControl2Props}>
                {textLabel3 && textLabel3Props && (
                  <TextLabel {...textLabel3Props} />
                )}
                {input3 && input3Props && <Input {...input3Props} />}
              </FormControl>
            )}
            {formControl3 && formControl3Props && (
              <FormControl {...formControl3Props}>
                {textLabel4 && textLabel4Props && (
                  <TextLabel {...textLabel4Props} />
                )}
                {input4 && input4Props && <Input {...input4Props} />}
              </FormControl>
            )}
          </Frame>
          {barButtonsProps !== null && (
            <BarButtons
              {...barButtonsProps}
              button4={buttonProps}
              icon4={icon4Props}
              textLabel4={textLabel5 && textLabel5Props}
              button5={button2Props}
              icon5={icon5Props}
              textLabel5={textLabel6 && textLabel6Props}
            />
          )}
        </>
      )}
    </HTMLDiv>
  )
}

//
// Default property values
//
const sdn: DialogCreateComponentProps = {
  "aria-hidden": "false",
  className: "sdn-dialog",
  bar: {
    "aria-hidden": "false",
    className: "sdn-bar sdn-bar--zhvk",
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
    children:
      "Use for table and grid based layouts, like a calendar or pricing table",
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
    className: "sdn-text-label sdn-text-label--cr3i",
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
    className: "sdn-text-label sdn-text-label--cr3i",
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
    className: "sdn-input sdn-input--iegt",
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
    className: "sdn-text-label sdn-text-label--cr3i",
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
    className: "sdn-text-label sdn-text-label--cr3i",
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
