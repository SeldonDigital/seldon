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
import { MenuItemCheckbox, MenuItemCheckboxProps } from "../elements/MenuItemCheckbox"
import { MenuItemRadio, MenuItemRadioProps } from "../elements/MenuItemRadio"
import { Frame } from "../frames/Frame"
import { Hr, HrProps } from "../primitives/Hr"
import { Icon, IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface MenuProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  menuItem?: MenuItemProps | null
  icon?: IconProps | null
  textLabel?: TextLabelProps | null
  textLabel2?: TextLabelProps | null

  menuItem2?: MenuItemProps | null
  icon2?: IconProps | null
  textLabel3?: TextLabelProps | null
  textLabel4?: TextLabelProps | null

  hr?: HrProps | null

  menuItemCheckbox?: MenuItemCheckboxProps | null
  icon3?: IconProps | null
  textLabel5?: TextLabelProps | null

  menuItemRadio?: MenuItemRadioProps | null
  icon4?: IconProps | null
  textLabel6?: TextLabelProps | null
}

//
// Default property values
//
const sdn: MenuProps = {
  role: "menu",
  "aria-hidden": "false",
  menuItem: {
    role: "menuitem",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item--rrtt",
  },
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel: {
    children: "Menu Item",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  textLabel2: {
    children: "⌘K",
    className: "sdn-text-label sdn-text-label--fdei",
  },

  menuItem2: {
    role: "menuitem",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item--rrtt",
  },
  icon2: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel3: {
    children: "Menu Item",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  textLabel4: {
    children: "⌘K",
    className: "sdn-text-label sdn-text-label--fdei",
  },

  hr: {
    "aria-hidden": "false",
    className: "sdn-hr sdn-hr--lrmt",
  },

  menuItemCheckbox: {
    role: "menuitemcheckbox",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item--rrtt",
  },
  icon3: {
    icon: "material-check",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel5: {
    children: "Checkbox",
    className: "sdn-text-label sdn-text-label--xohb",
  },

  menuItemRadio: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item--rrtt",
  },
  icon4: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel6: {
    children: "Radio",
    className: "sdn-text-label sdn-text-label--xohb",
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
 *   MenuItem          menuItem
 *     Icon            icon
 *     TextLabel       textLabel
 *     TextLabel       textLabel2
 *   MenuItem          menuItem2
 *     Icon            icon2
 *     TextLabel       textLabel3
 *     TextLabel       textLabel4
 *   Hr                hr
 *   MenuItemCheckbox  menuItemCheckbox
 *     Icon            icon3
 *     TextLabel       textLabel5
 *   MenuItemRadio     menuItemRadio
 *     Icon            icon4
 *     TextLabel       textLabel6
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

  menuItem2,
  icon2,
  textLabel3,
  textLabel4,

  hr,

  menuItemCheckbox,
  icon3,
  textLabel5,

  menuItemRadio,
  icon4,
  textLabel6,

  children,
  seldonRefs,
  ...props
}: MenuProps) {
  const menuClassName = combineClassNames("sdn-menu", className)

  const menuItemProps = mergeSlot(sdn.menuItem, menuItem, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)

  const menuItem2Props = mergeSlot(sdn.menuItem2, menuItem2, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)
  const textLabel4Props = mergeOptionalSlot(sdn.textLabel4, textLabel4, seldonRefs)

  const hrProps = mergeSlot(sdn.hr, hr, seldonRefs)

  const menuItemCheckboxProps = mergeSlot(sdn.menuItemCheckbox, menuItemCheckbox, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)
  const textLabel5Props = mergeOptionalSlot(sdn.textLabel5, textLabel5, seldonRefs)

  const menuItemRadioProps = mergeSlot(sdn.menuItemRadio, menuItemRadio, seldonRefs)
  const icon4Props = mergeSlot(sdn.icon4, icon4, seldonRefs)
  const textLabel6Props = mergeOptionalSlot(sdn.textLabel6, textLabel6, seldonRefs)

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
          {menuItem2Props !== null && (
            <MenuItem {...menuItem2Props}>
              {icon2Props !== null && <Icon {...icon2Props} />}
              {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
              {textLabel4Props !== null && <TextLabel {...textLabel4Props} />}
            </MenuItem>
          )}
          {hrProps !== null && <Hr {...hrProps} />}
          {menuItemCheckboxProps !== null && (
            <MenuItemCheckbox {...menuItemCheckboxProps}>
              {icon3Props !== null && <Icon {...icon3Props} />}
              {textLabel5Props !== null && <TextLabel {...textLabel5Props} />}
            </MenuItemCheckbox>
          )}
          {menuItemRadioProps !== null && (
            <MenuItemRadio {...menuItemRadioProps}>
              {icon4Props !== null && <Icon {...icon4Props} />}
              {textLabel6Props !== null && <TextLabel {...textLabel6Props} />}
            </MenuItemRadio>
          )}
        </>
      )}
    </Frame>
  )
}
