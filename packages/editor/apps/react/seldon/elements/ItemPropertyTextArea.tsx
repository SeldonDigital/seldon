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

import { LiHTMLAttributes } from "react"

import { ButtonIconic, ButtonIconicProps } from "../elements/ButtonIconic"
import { ComboboxField, ComboboxFieldProps } from "../elements/ComboboxField"
import { FormControlCombobox, FormControlComboboxProps } from "../elements/FormControlCombobox"
import { HTMLLi } from "../native-react/HTML.Li"
import { Icon, IconProps } from "../primitives/Icon"
import { Input, InputProps } from "../primitives/Input"
import { Textarea, TextareaProps } from "../primitives/Textarea"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface ItemPropertyTextAreaProps extends LiHTMLAttributes<HTMLLIElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null

  formControlCombobox?: FormControlComboboxProps | null
  input?: InputProps | null
  comboboxField?: ComboboxFieldProps | null
  icon2?: IconProps | null
  textarea?: TextareaProps | null

  buttonIconic2?: ButtonIconicProps | null
  icon3?: IconProps | null
}

//
// Default property values
//
const sdn: ItemPropertyTextAreaProps = {
  "aria-hidden": "false",
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--rrxj",
    "data-seldon-ref": "propertyTextAreaDisclosure",
  },
  icon: {
    icon: "material-keyboardArrowRight",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
    "data-seldon-ref": "propertyTextAreaDisclosureIcon",
  },

  formControlCombobox: {
    className: "sdn-form-control sdn-form-control-combobox--sr37",
    "data-seldon-ref": "propertyTextAreaRow",
  },
  input: {
    placeholder: "Property Name",
    className: "sdn-input sdn-input--elwb",
    "data-seldon-ref": "propertyTextAreaLabel",
  },
  comboboxField: {
    "aria-hidden": "false",
    className: "sdn-combobox-field sdn-combobox-field--ksrm",
    "data-seldon-ref": "propertyTextAreaValueField",
  },
  icon2: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--6l44",
    "data-seldon-ref": "propertyTextAreaIcon",
  },
  textarea: {
    placeholder: "Value",
    className: "sdn-textarea sdn-textarea--nuyg",
    "data-seldon-ref": "propertyTextAreaValueLabel",
  },

  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--fdgp",
    "data-seldon-ref": "propertyTextAreaActions",
  },
  icon3: {
    icon: "seldon-more",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
}

/**
 * Item: ItemPropertyTextArea
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Custom
 *
 * Structure:
 *   ButtonIconic         buttonIconic         -> propertyTextAreaDisclosure
 *     Icon               icon                 -> propertyTextAreaDisclosureIcon
 *   FormControlCombobox  formControlCombobox  -> propertyTextAreaRow
 *     Input              input                -> propertyTextAreaLabel
 *     ComboboxField      comboboxField        -> propertyTextAreaValueField
 *       Icon             icon2                -> propertyTextAreaIcon
 *       Textarea         textarea             -> propertyTextAreaValueLabel
 *   ButtonIconic         buttonIconic2        -> propertyTextAreaActions
 *     Icon               icon3
 *
 * @example
 * ```tsx
 * <ItemPropertyTextArea
 *   aria-hidden="false"
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   formControlCombobox="{}"
 *   input="{}"
 *   comboboxField="{}"
 *   textarea="{}"
 *   buttonIconic2={() => {}}
 * />
 * ```
 */
export function ItemPropertyTextArea({
  className = "",
  buttonIconic,
  icon,

  formControlCombobox,
  input,
  comboboxField,
  icon2,
  textarea,

  buttonIconic2,
  icon3,

  children,
  seldonRefs,
  ...props
}: ItemPropertyTextAreaProps) {
  const itemPropertyTextAreaClassName = combineClassNames("sdn-item-property-text-area", className)

  const buttonIconicProps = mergeOptionalSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)

  const formControlComboboxProps = mergeOptionalSlot(
    sdn.formControlCombobox,
    formControlCombobox,
    seldonRefs,
  )
  const inputProps = mergeOptionalSlot(sdn.input, input, seldonRefs)
  const comboboxFieldProps = mergeSlot(sdn.comboboxField, comboboxField, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)
  const textareaProps = mergeOptionalSlot(sdn.textarea, textarea, seldonRefs)

  const buttonIconic2Props = mergeOptionalSlot(sdn.buttonIconic2, buttonIconic2, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)

  return (
    <HTMLLi className={itemPropertyTextAreaClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {buttonIconicProps !== null && <ButtonIconic {...buttonIconicProps} icon={iconProps} />}
          {formControlComboboxProps !== null && (
            <FormControlCombobox {...formControlComboboxProps}>
              {inputProps !== null && <Input {...inputProps} />}
              {comboboxFieldProps !== null && (
                <ComboboxField {...comboboxFieldProps}>
                  {icon2Props !== null && <Icon {...icon2Props} />}
                  {textareaProps !== null && <Textarea {...textareaProps} />}
                </ComboboxField>
              )}
            </FormControlCombobox>
          )}
          {buttonIconic2Props !== null && (
            <ButtonIconic {...buttonIconic2Props} icon={icon3Props} />
          )}
        </>
      )}
    </HTMLLi>
  )
}
