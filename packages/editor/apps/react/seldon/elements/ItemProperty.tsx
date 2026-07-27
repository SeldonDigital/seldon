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
import { IconProps } from "../primitives/Icon"
import { Input, InputProps } from "../primitives/Input"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface ItemPropertyProps extends LiHTMLAttributes<HTMLLIElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null

  formControlCombobox?: FormControlComboboxProps | null
  input?: InputProps | null
  comboboxField?: ComboboxFieldProps | null
  icon2?: IconProps | null
  input2?: InputProps | null
  buttonIconic2?: ButtonIconicProps | null
  icon3?: IconProps | null

  buttonIconic3?: ButtonIconicProps | null
  icon4?: IconProps | null
}

//
// Default property values
//
const sdn: ItemPropertyProps = {
  "aria-hidden": "false",
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "propertyToggle",
  },
  icon: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
    "data-seldon-ref": "propertyToggleIcon",
  },

  formControlCombobox: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-combobox--qmop",
  },
  input: {
    className: "sdn-input sdn-input--jvsw",
    "data-seldon-ref": "propertyLabel",
  },
  comboboxField: {
    "aria-hidden": "false",
    className: "sdn-combobox-field sdn-combobox-field--j44i",
  },
  icon2: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "valueIcon",
  },
  input2: {
    placeholder: "Value",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--iegt",
    "data-seldon-ref": "valueLabel",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "valueOptionsMenu",
  },
  icon3: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },

  buttonIconic3: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "propertyActions",
  },
  icon4: {
    icon: "seldon-more",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
}

/**
 * Item: ItemProperty
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Custom
 *
 * Structure:
 *   ButtonIconic         buttonIconic         -> propertyToggle
 *     Icon               icon                 -> propertyToggleIcon
 *   FormControlCombobox  formControlCombobox
 *     Input              input                -> propertyLabel
 *     ComboboxField      comboboxField
 *       Icon             icon2                -> valueIcon
 *       Input            input2               -> valueLabel
 *       ButtonIconic     buttonIconic2        -> valueOptionsMenu
 *         Icon           icon3
 *   ButtonIconic         buttonIconic3        -> propertyActions
 *     Icon               icon4
 *
 * @example
 * ```tsx
 * <ItemProperty
 *   aria-hidden="false"
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   formControlCombobox="{}"
 *   input="{}"
 *   comboboxField="{}"
 *   buttonIconic2={() => {}}
 * />
 * ```
 */
export function ItemProperty({
  className = "",
  buttonIconic,
  icon,

  formControlCombobox,
  input,
  comboboxField,
  icon2,
  input2,
  buttonIconic2,
  icon3,

  buttonIconic3,
  icon4,

  children,
  seldonRefs,
  ...props
}: ItemPropertyProps) {
  const itemPropertyClassName = combineClassNames("sdn-item-property", className)

  const buttonIconicProps = mergeSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)

  const formControlComboboxProps = mergeSlot(
    sdn.formControlCombobox,
    formControlCombobox,
    seldonRefs,
  )
  const inputProps = mergeOptionalSlot(sdn.input, input, seldonRefs)
  const comboboxFieldProps = mergeSlot(sdn.comboboxField, comboboxField, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)
  const input2Props = mergeSlot(sdn.input2, input2, seldonRefs)
  const buttonIconic2Props = mergeSlot(sdn.buttonIconic2, buttonIconic2, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)

  const buttonIconic3Props = mergeSlot(sdn.buttonIconic3, buttonIconic3, seldonRefs)
  const icon4Props = mergeSlot(sdn.icon4, icon4, seldonRefs)

  return (
    <HTMLLi className={itemPropertyClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {buttonIconicProps !== null && <ButtonIconic {...buttonIconicProps} icon={iconProps} />}
          {formControlComboboxProps !== null && (
            <FormControlCombobox {...formControlComboboxProps}>
              {inputProps !== null && <Input {...inputProps} />}
              {comboboxFieldProps !== null && (
                <ComboboxField
                  {...comboboxFieldProps}
                  icon={icon2Props}
                  input={input2Props}
                  buttonIconic={buttonIconic2Props}
                  icon2={icon3Props}
                />
              )}
            </FormControlCombobox>
          )}
          {buttonIconic3Props !== null && (
            <ButtonIconic {...buttonIconic3Props} icon={icon4Props} />
          )}
        </>
      )}
    </HTMLLi>
  )
}
