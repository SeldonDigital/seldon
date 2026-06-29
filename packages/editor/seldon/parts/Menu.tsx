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
import {
  MenuItemCheckboxMenuItem,
  MenuItemCheckboxMenuItemProps,
} from "../elements/MenuItemCheckboxMenuItem"
import {
  MenuItemRadioMenuItem,
  MenuItemRadioMenuItemProps,
} from "../elements/MenuItemRadioMenuItem"
import { Frame } from "../frames/Frame"
import { Hr, HrProps } from "../primitives/Hr"
import { Icon, IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface MenuProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  menuItem?: MenuItemProps | null
  icon?: IconProps | null
  textLabel?: TextLabelProps | null
  textLabel2?: TextLabelProps | null
  menuItem2?: MenuItemProps | null
  icon2?: IconProps | null
  textLabel3?: TextLabelProps | null
  textLabel4?: TextLabelProps | null
  hr?: HrProps | null
  menuItemCheckboxMenuItem?: MenuItemCheckboxMenuItemProps | null
  icon3?: IconProps | null
  textLabel5?: TextLabelProps | null
  menuItemRadioMenuItem?: MenuItemRadioMenuItemProps | null
  icon4?: IconProps | null
  textLabel6?: TextLabelProps | null
}

/*****
 * Menu: Menu
 * Level: Part
 * Intent: Floating list of actions anchored to a trigger.
 * Tags: menu, dropdown, actions, part, overlay, UI
 * Type: Default
 *
 * @example
 * ```tsx
 * <Menu
 *   role="menu"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function Menu({
  className = "",
  menuItem = sdn.menuItem,
  icon = sdn.icon,
  textLabel,
  textLabel2,
  menuItem2 = sdn.menuItem2,
  icon2 = sdn.icon2,
  textLabel3,
  textLabel4,
  hr = sdn.hr,
  menuItemCheckboxMenuItem = sdn.menuItemCheckboxMenuItem,
  icon3 = sdn.icon3,
  textLabel5,
  menuItemRadioMenuItem = sdn.menuItemRadioMenuItem,
  icon4 = sdn.icon4,
  textLabel6,
  children,
  seldonRefs,
  ...props
}: MenuProps) {
  const menuClassName = combineClassNames("sdn-menu", className)
  const menuItemProps = applyRef(
    seldonRefs,
    menuItem === null
      ? null
      : {
          ...sdn.menuItem,
          ...menuItem,
          className: combineClassNames(
            sdn.menuItem?.className,
            menuItem?.className,
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
  const menuItem2Props = applyRef(
    seldonRefs,
    menuItem2 === null
      ? null
      : {
          ...sdn.menuItem2,
          ...menuItem2,
          className: combineClassNames(
            sdn.menuItem2?.className,
            menuItem2?.className,
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
  const hrProps = applyRef(
    seldonRefs,
    hr === null
      ? null
      : {
          ...sdn.hr,
          ...hr,
          className: combineClassNames(sdn.hr?.className, hr?.className),
        },
  )
  const menuItemCheckboxMenuItemProps = applyRef(
    seldonRefs,
    menuItemCheckboxMenuItem === null
      ? null
      : {
          ...sdn.menuItemCheckboxMenuItem,
          ...menuItemCheckboxMenuItem,
          className: combineClassNames(
            sdn.menuItemCheckboxMenuItem?.className,
            menuItemCheckboxMenuItem?.className,
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
  const menuItemRadioMenuItemProps = applyRef(
    seldonRefs,
    menuItemRadioMenuItem === null
      ? null
      : {
          ...sdn.menuItemRadioMenuItem,
          ...menuItemRadioMenuItem,
          className: combineClassNames(
            sdn.menuItemRadioMenuItem?.className,
            menuItemRadioMenuItem?.className,
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
    <Frame
      className={menuClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {menuItemProps !== null && (
            <MenuItem {...menuItemProps}>
              {icon && iconProps && <Icon {...iconProps} />}
              {textLabel && textLabelProps && <TextLabel {...textLabelProps} />}
              {textLabel2 && textLabel2Props && (
                <TextLabel {...textLabel2Props} />
              )}
            </MenuItem>
          )}
          {menuItem2Props !== null && (
            <MenuItem {...menuItem2Props}>
              {icon2 && icon2Props && <Icon {...icon2Props} />}
              {textLabel3 && textLabel3Props && (
                <TextLabel {...textLabel3Props} />
              )}
              {textLabel4 && textLabel4Props && (
                <TextLabel {...textLabel4Props} />
              )}
            </MenuItem>
          )}
          {hrProps !== null && <Hr {...hrProps} />}
          {menuItemCheckboxMenuItemProps !== null && (
            <MenuItemCheckboxMenuItem {...menuItemCheckboxMenuItemProps}>
              {icon3 && icon3Props && <Icon {...icon3Props} />}
              {textLabel5 && textLabel5Props && (
                <TextLabel {...textLabel5Props} />
              )}
            </MenuItemCheckboxMenuItem>
          )}
          {menuItemRadioMenuItemProps !== null && (
            <MenuItemRadioMenuItem {...menuItemRadioMenuItemProps}>
              {icon4 && icon4Props && <Icon {...icon4Props} />}
              {textLabel6 && textLabel6Props && (
                <TextLabel {...textLabel6Props} />
              )}
            </MenuItemRadioMenuItem>
          )}
        </>
      )}
    </Frame>
  )
}

//
// Default property values
//
const sdn: MenuProps = {
  role: "menu",
  "aria-hidden": "false",
  className: "sdn-menu",
  menuItem: {
    role: "menuitem",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item--rrtt",
  },
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--xohb",
  },
  textLabel2: {
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
    className: "sdn-icon sdn-icon--xi68",
  },
  textLabel3: {
    className: "sdn-text-label sdn-text-label--xohb",
  },
  textLabel4: {
    className: "sdn-text-label sdn-text-label--fdei",
  },
  hr: {
    "aria-hidden": "false",
    className: "sdn-hr sdn-hr--lrmt",
  },
  menuItemCheckboxMenuItem: {
    role: "menuitemcheckbox",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item--rrtt",
  },
  icon3: {
    icon: "material-check",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  textLabel5: {
    className: "sdn-text-label sdn-text-label--xohb",
  },
  menuItemRadioMenuItem: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item--rrtt",
  },
  icon4: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  textLabel6: {
    className: "sdn-text-label sdn-text-label--xohb",
  },
}
