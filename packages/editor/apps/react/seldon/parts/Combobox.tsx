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

import { ButtonIconicProps } from "../elements/ButtonIconic"
import { ComboboxField, ComboboxFieldProps } from "../elements/ComboboxField"
import { MenuItemOptionProps } from "../elements/MenuItemOption"
import { Frame } from "../frames/Frame"
import { MenuOptions, MenuOptionsProps } from "../parts/MenuOptions"
import { IconProps } from "../primitives/Icon"
import { InputProps } from "../primitives/Input"
import { TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface ComboboxProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  comboboxField?: ComboboxFieldProps | null
  icon?: IconProps | null
  input?: InputProps | null
  buttonIconic?: ButtonIconicProps | null
  icon2?: IconProps | null

  menuOptions?: MenuOptionsProps | null
  menuItemOption?: MenuItemOptionProps | null
  icon3?: IconProps | null
  textLabel?: TextLabelProps | null
  textLabel2?: TextLabelProps | null
  menuItemOption2?: MenuItemOptionProps | null
  icon4?: IconProps | null
  textLabel3?: TextLabelProps | null
  textLabel4?: TextLabelProps | null
  menuItemOption3?: MenuItemOptionProps | null
  icon5?: IconProps | null
  textLabel5?: TextLabelProps | null
  textLabel6?: TextLabelProps | null
}

//
// Default property values
//
const sdn: ComboboxProps = {
  "aria-hidden": "false",
  comboboxField: {
    "aria-hidden": "false",
    className: "sdn-combobox-field sdn-combobox-field--z3a0",
  },
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  input: {
    placeholder: "Placeholder text",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--yoqi",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon2: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },

  menuOptions: {
    role: "listbox",
    "aria-hidden": "false",
    className: "sdn-menu-options sdn-menu-options--4wpg",
  },
  menuItemOption: {
    role: "option",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-option--6dxl",
  },
  icon3: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  textLabel: {
    children: "Option",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  textLabel2: {
    children: "Annotation",
    className: "sdn-text-label sdn-text-label--lqmh",
  },
  menuItemOption2: {
    role: "option",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-option--6dxl",
  },
  icon4: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  textLabel3: {
    children: "Option",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  textLabel4: {
    children: "Annotation",
    className: "sdn-text-label sdn-text-label--lqmh",
  },
  menuItemOption3: {
    role: "option",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-option--6dxl",
  },
  icon5: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  textLabel5: {
    children: "Option",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  textLabel6: {
    children: "Annotation",
    className: "sdn-text-label sdn-text-label--lqmh",
  },
}

/**
 * Combobox: Combobox
 * Level: Part
 * Intent: Editable field paired with a menu of options to choose from.
 * Tags: combobox, select, dropdown, input, part, UI
 * Type: Default
 *
 * Structure:
 *   ComboboxField     comboboxField
 *     Icon            icon
 *     Input           input
 *     ButtonIconic    buttonIconic
 *       Icon          icon2
 *   MenuOptions       menuOptions
 *     MenuItemOption  menuItemOption
 *       Icon          icon3
 *       TextLabel     textLabel
 *       TextLabel     textLabel2
 *     MenuItemOption  menuItemOption2
 *       Icon          icon4
 *       TextLabel     textLabel3
 *       TextLabel     textLabel4
 *     MenuItemOption  menuItemOption3
 *       Icon          icon5
 *       TextLabel     textLabel5
 *       TextLabel     textLabel6
 *
 * @example
 * ```tsx
 * <Combobox
 *   aria-hidden="false"
 *   comboboxField="{}"
 *   icon="material-star"
 *   input="{}"
 *   buttonIconic={() => {}}
 *   menuOptions="{}"
 *   menuItemOption="{}"
 *   textLabel="{}"
 *   textLabel2="{}"
 *   menuItemOption2="{}"
 *   menuItemOption3="{}"
 * />
 * ```
 */
export function Combobox({
  className = "",
  comboboxField,
  icon,
  input,
  buttonIconic,
  icon2,

  menuOptions,
  menuItemOption,
  icon3,
  textLabel,
  textLabel2,
  menuItemOption2,
  icon4,
  textLabel3,
  textLabel4,
  menuItemOption3,
  icon5,
  textLabel5,
  textLabel6,

  children,
  seldonRefs,
  ...props
}: ComboboxProps) {
  const comboboxClassName = combineClassNames("sdn-combobox", className)

  const comboboxFieldProps = mergeSlot(sdn.comboboxField, comboboxField, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const inputProps = mergeSlot(sdn.input, input, seldonRefs)
  const buttonIconicProps = mergeSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)

  const menuOptionsProps = mergeSlot(sdn.menuOptions, menuOptions, seldonRefs)
  const menuItemOptionProps = mergeSlot(sdn.menuItemOption, menuItemOption, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const menuItemOption2Props = mergeSlot(sdn.menuItemOption2, menuItemOption2, seldonRefs)
  const icon4Props = mergeSlot(sdn.icon4, icon4, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)
  const textLabel4Props = mergeOptionalSlot(sdn.textLabel4, textLabel4, seldonRefs)
  const menuItemOption3Props = mergeSlot(sdn.menuItemOption3, menuItemOption3, seldonRefs)
  const icon5Props = mergeSlot(sdn.icon5, icon5, seldonRefs)
  const textLabel5Props = mergeOptionalSlot(sdn.textLabel5, textLabel5, seldonRefs)
  const textLabel6Props = mergeOptionalSlot(sdn.textLabel6, textLabel6, seldonRefs)

  return (
    <Frame className={comboboxClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {comboboxFieldProps !== null && (
            <ComboboxField
              {...comboboxFieldProps}
              icon={iconProps}
              input={inputProps}
              buttonIconic={buttonIconicProps}
              icon2={icon2Props}
            />
          )}
          {menuOptionsProps !== null && (
            <MenuOptions
              {...menuOptionsProps}
              menuItemOption={menuItemOptionProps}
              icon={icon3Props}
              textLabel={textLabelProps}
              textLabel2={textLabel2Props}
              menuItemOption2={menuItemOption2Props}
              icon2={icon4Props}
              textLabel3={textLabel3Props}
              textLabel4={textLabel4Props}
              menuItemOption3={menuItemOption3Props}
              icon3={icon5Props}
              textLabel5={textLabel5Props}
              textLabel6={textLabel6Props}
            />
          )}
        </>
      )}
    </Frame>
  )
}
