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

import { MenuItemOption, MenuItemOptionProps } from "../elements/MenuItemOption"
import { Frame } from "../frames/Frame"
import { Icon, IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot } from "../utils/merge-slot"

export interface MenuOptionsProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  menuItemOption?: MenuItemOptionProps | null
  icon?: IconProps | null
  textLabel?: TextLabelProps | null
  textLabel2?: TextLabelProps | null
}

//
// Default property values
//
const sdn: MenuOptionsProps = {
  role: "listbox",
  "aria-hidden": "false",
  menuItemOption: {
    className: "sdn-menu-item-option sdn-menu-item-option--6dxl",
  },
  icon: {
    icon: "material-check",
    className: "sdn-icon sdn-icon--rdh1",
  },
  textLabel: {
    children: "Option",
    className: "sdn-text-label sdn-text-label--y8ur",
  },
  textLabel2: {
    children: "Annotation",
    className: "sdn-text-label sdn-text-label--ni4j",
  },
}

/**
 * Menu: MenuOptions
 * Level: Part
 * Intent: Floating list of actions anchored to a trigger.
 * Tags: menu, dropdown, actions, part, overlay, UI
 * Type: Custom
 *
 * Structure:
 *   MenuItemOption  menuItemOption
 *     Icon          icon
 *     TextLabel     textLabel
 *     TextLabel     textLabel2
 *
 * @example
 * ```tsx
 * <MenuOptions
 *   role="listbox"
 *   aria-hidden="false"
 * />
 * ```
 */
export function MenuOptions({
  className = "",
  menuItemOption,
  icon,
  textLabel,
  textLabel2,

  children,
  seldonRefs,
  ...props
}: MenuOptionsProps) {
  const menuOptionsClassName = combineClassNames("sdn-menu-options", className)

  const menuItemOptionProps = mergeOptionalSlot(sdn.menuItemOption, menuItemOption, seldonRefs)
  const iconProps = mergeOptionalSlot(sdn.icon, icon, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)

  return (
    <Frame
      className={menuOptionsClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {menuItemOptionProps !== null && (
            <MenuItemOption {...menuItemOptionProps}>
              {iconProps !== null && <Icon {...iconProps} />}
              {textLabelProps !== null && <TextLabel {...textLabelProps} />}
              {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
            </MenuItemOption>
          )}
        </>
      )}
    </Frame>
  )
}
