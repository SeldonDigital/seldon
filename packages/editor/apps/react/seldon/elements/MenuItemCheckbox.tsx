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

import { ButtonHTMLAttributes } from "react"

import { HTMLButton } from "../native-react/HTML.Button"
import { Icon, IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface MenuItemCheckboxProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  icon?: IconProps | null

  textLabel?: TextLabelProps | null
}

//
// Default property values
//
const sdn: MenuItemCheckboxProps = {
  role: "menuitemcheckbox",
  "aria-hidden": "false",
  icon: {
    icon: "material-check",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },

  textLabel: {
    children: "Checkbox",
    className: "sdn-text-label sdn-text-label--jndm",
  },
}

/**
 * Menu Item: MenuItemCheckbox
 * Level: Element
 * Intent: Single actionable row inside a menu.
 * Tags: menu, menuitem, action, row, element, UI
 * Type: Custom
 *
 * Structure:
 *   Icon       icon
 *   TextLabel  textLabel
 *
 * @example
 * ```tsx
 * <MenuItemCheckbox
 *   role="menuitemcheckbox"
 *   aria-hidden="false"
 * />
 * ```
 */
export function MenuItemCheckbox({
  className = "",
  icon,

  textLabel,

  children,
  seldonRefs,
  ...props
}: MenuItemCheckboxProps) {
  const menuItemCheckboxClassName = combineClassNames("sdn-menu-item", className)

  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)

  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  return (
    <HTMLButton
      className={menuItemCheckboxClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {iconProps !== null && <Icon {...iconProps} />}
          {textLabelProps !== null && <TextLabel {...textLabelProps} />}
        </>
      )}
    </HTMLButton>
  )
}
