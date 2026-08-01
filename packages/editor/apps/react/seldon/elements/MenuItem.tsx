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

import { Frame } from "../frames/Frame"
import { Icon, IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface MenuItemProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  icon?: IconProps | null

  textLabel?: TextLabelProps | null

  textLabel2?: TextLabelProps | null
}

//
// Default property values
//
const sdn: MenuItemProps = {
  role: "menuitem",
  "aria-hidden": "false",
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },

  textLabel: {
    children: "Menu Item",
    className: "sdn-text-label sdn-text-label--xohb",
  },

  textLabel2: {
    children: "⌘K",
    className: "sdn-text-label sdn-text-label--fdei",
  },
}

/**
 * Menu Item: MenuItem
 * Level: Element
 * Intent: Single actionable row inside a menu.
 * Tags: menu, menuitem, action, row, element, UI
 * Type: Default
 *
 * Structure:
 *   Icon       icon
 *   TextLabel  textLabel
 *   TextLabel  textLabel2
 *
 * @example
 * ```tsx
 * <MenuItem
 *   role="menuitem"
 *   aria-hidden="false"
 * />
 * ```
 */
export function MenuItem({
  className = "",
  icon,

  textLabel,

  textLabel2,

  children,
  seldonRefs,
  ...props
}: MenuItemProps) {
  const menuItemClassName = combineClassNames("sdn-menu-item", className)

  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)

  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)

  return (
    <Frame
      className={menuItemClassName}
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
          {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
        </>
      )}
    </Frame>
  )
}
