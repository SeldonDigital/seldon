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
import { FormControlCombobox, FormControlComboboxProps } from "../elements/FormControlCombobox"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLLi } from "../native-react/HTML.Li"
import { Icon, IconProps } from "../primitives/Icon"
import { Input, InputProps } from "../primitives/Input"
import { ToggleSwitch, ToggleSwitchProps } from "../primitives/ToggleSwitch"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface ItemPropertyToggleProps extends LiHTMLAttributes<HTMLLIElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null

  formControlCombobox?: FormControlComboboxProps | null
  input?: InputProps | null
  frame?: FrameProps | null
  icon2?: IconProps | null
  toggleSwitch?: ToggleSwitchProps | null

  buttonIconic2?: ButtonIconicProps | null
  icon3?: IconProps | null
}

//
// Default property values
//
const sdn: ItemPropertyToggleProps = {
  "aria-hidden": "false",
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "propertyToggleDisclosure",
  },
  icon: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
    "data-seldon-ref": "propertyToggleDisclosureIcon",
  },

  formControlCombobox: {
    className: "sdn-form-control sdn-form-control-combobox--qmop",
  },
  input: {
    className: "sdn-input sdn-input--jvsw",
    "data-seldon-ref": "propertyToggleLabel",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--inf3",
  },
  icon2: {
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "propertyToggleIcon",
  },
  toggleSwitch: {
    className: "sdn-toggle-switch sdn-toggle-switch--pelh",
    "data-seldon-ref": "propertyToggleSwitch",
  },

  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "propertyToggleActions",
  },
  icon3: {
    icon: "seldon-more",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
}

/**
 * Item: ItemPropertyToggle
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Custom
 *
 * Structure:
 *   ButtonIconic         buttonIconic         -> propertyToggleDisclosure
 *     Icon               icon                 -> propertyToggleDisclosureIcon
 *   FormControlCombobox  formControlCombobox
 *     Input              input                -> propertyToggleLabel
 *     Frame              frame
 *       Icon             icon2                -> propertyToggleIcon
 *       ToggleSwitch     toggleSwitch         -> propertyToggleSwitch
 *   ButtonIconic         buttonIconic2        -> propertyToggleActions
 *     Icon               icon3
 *
 * @example
 * ```tsx
 * <ItemPropertyToggle
 *   aria-hidden="false"
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   formControlCombobox="{}"
 *   input="{}"
 *   frame="{}"
 *   toggleSwitch="{}"
 *   buttonIconic2={() => {}}
 * />
 * ```
 */
export function ItemPropertyToggle({
  className = "",
  buttonIconic,
  icon,

  formControlCombobox,
  input,
  frame,
  icon2,
  toggleSwitch,

  buttonIconic2,
  icon3,

  children,
  seldonRefs,
  ...props
}: ItemPropertyToggleProps) {
  const itemPropertyToggleClassName = combineClassNames("sdn-item-property", className)

  const buttonIconicProps = mergeOptionalSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)

  const formControlComboboxProps = mergeOptionalSlot(
    sdn.formControlCombobox,
    formControlCombobox,
    seldonRefs,
  )
  const inputProps = mergeOptionalSlot(sdn.input, input, seldonRefs)
  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const icon2Props = mergeOptionalSlot(sdn.icon2, icon2, seldonRefs)
  const toggleSwitchProps = mergeOptionalSlot(sdn.toggleSwitch, toggleSwitch, seldonRefs)

  const buttonIconic2Props = mergeOptionalSlot(sdn.buttonIconic2, buttonIconic2, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)

  return (
    <HTMLLi className={itemPropertyToggleClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {buttonIconicProps !== null && <ButtonIconic {...buttonIconicProps} icon={iconProps} />}
          {formControlComboboxProps !== null && (
            <FormControlCombobox {...formControlComboboxProps}>
              {inputProps !== null && <Input {...inputProps} />}
              <Frame {...frameProps}>
                {icon2Props !== null && <Icon {...icon2Props} />}
                {toggleSwitchProps !== null && <ToggleSwitch {...toggleSwitchProps} />}
              </Frame>
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
