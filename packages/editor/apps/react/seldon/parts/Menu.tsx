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

import { MenuItem, MenuItemProps } from "../elements/MenuItem"
import { Frame } from "../frames/Frame"
import { Icon, IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot } from "../utils/merge-slot"

export interface MenuProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  menuItem?: MenuItemProps | null
  icon?: IconProps | null
  textLabel?: TextLabelProps | null
  textLabel2?: TextLabelProps | null
}

//
// Default property values
//
const sdn: MenuProps = {
  role: "menu",
  "aria-hidden": "false",
  menuItem: {
    className: "sdn-menu-item sdn-menu-item-option--6dxl",
  },
  icon: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--rdh1",
  },
  textLabel: {
    children: "Menu Item",
    className: "sdn-text-label sdn-text-label--y8ur",
  },
  textLabel2: {
    children: "Annotation",
    className: "sdn-text-label sdn-text-label--bign",
  },
}

/**
 * Menu: Menu
 * Level: Part
 * Intent: Floating list of actions anchored to a trigger.
 * Tags: menu, dropdown, actions, part, overlay, UI
 * Type: Default
 *
 * Structure:
 *   MenuItem     menuItem
 *     Icon       icon
 *     TextLabel  textLabel
 *     TextLabel  textLabel2
 *
 * @example
 * ```tsx
 * <Menu
 *   role="menu"
 *   aria-hidden="false"
 * />
 * ```
 */
export function Menu({
  className = "",
  menuItem,
  icon,
  textLabel,
  textLabel2,

  children,
  seldonRefs,
  ...props
}: MenuProps) {
  const menuClassName = combineClassNames("sdn-menu", className)

  const menuItemProps = mergeOptionalSlot(sdn.menuItem, menuItem, seldonRefs)
  const iconProps = mergeOptionalSlot(sdn.icon, icon, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)

  return (
    <Frame className={menuClassName} role={sdn["role"]} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {menuItemProps !== null && (
            <MenuItem {...menuItemProps}>
              {iconProps !== null && <Icon {...iconProps} />}
              {textLabelProps !== null && <TextLabel {...textLabelProps} />}
              {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
            </MenuItem>
          )}
        </>
      )}
    </Frame>
  )
}
