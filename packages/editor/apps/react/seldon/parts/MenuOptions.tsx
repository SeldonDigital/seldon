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
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface MenuOptionsProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  menuItemOption?: MenuItemOptionProps | null
  icon?: IconProps | null
  textLabel?: TextLabelProps | null
  textLabel2?: TextLabelProps | null

  menuItemOption2?: MenuItemOptionProps | null
  icon2?: IconProps | null
  textLabel3?: TextLabelProps | null
  textLabel4?: TextLabelProps | null

  menuItemOption3?: MenuItemOptionProps | null
  icon3?: IconProps | null
  textLabel5?: TextLabelProps | null
  textLabel6?: TextLabelProps | null
}

//
// Default property values
//
const sdn: MenuOptionsProps = {
  role: "listbox",
  "aria-hidden": "false",
  menuItemOption: {
    role: "option",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-option--6dxl",
  },
  icon: {
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
  icon2: {
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
  icon3: {
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
 *   MenuItemOption  menuItemOption2
 *     Icon          icon2
 *     TextLabel     textLabel3
 *     TextLabel     textLabel4
 *   MenuItemOption  menuItemOption3
 *     Icon          icon3
 *     TextLabel     textLabel5
 *     TextLabel     textLabel6
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

  menuItemOption2,
  icon2,
  textLabel3,
  textLabel4,

  menuItemOption3,
  icon3,
  textLabel5,
  textLabel6,

  children,
  seldonRefs,
  ...props
}: MenuOptionsProps) {
  const menuOptionsClassName = combineClassNames("sdn-menu-options", className)

  const menuItemOptionProps = mergeSlot(sdn.menuItemOption, menuItemOption, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)

  const menuItemOption2Props = mergeSlot(sdn.menuItemOption2, menuItemOption2, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)
  const textLabel4Props = mergeOptionalSlot(sdn.textLabel4, textLabel4, seldonRefs)

  const menuItemOption3Props = mergeSlot(sdn.menuItemOption3, menuItemOption3, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)
  const textLabel5Props = mergeOptionalSlot(sdn.textLabel5, textLabel5, seldonRefs)
  const textLabel6Props = mergeOptionalSlot(sdn.textLabel6, textLabel6, seldonRefs)

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
          {menuItemOption2Props !== null && (
            <MenuItemOption {...menuItemOption2Props}>
              {icon2Props !== null && <Icon {...icon2Props} />}
              {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
              {textLabel4Props !== null && <TextLabel {...textLabel4Props} />}
            </MenuItemOption>
          )}
          {menuItemOption3Props !== null && (
            <MenuItemOption {...menuItemOption3Props}>
              {icon3Props !== null && <Icon {...icon3Props} />}
              {textLabel5Props !== null && <TextLabel {...textLabel5Props} />}
              {textLabel6Props !== null && <TextLabel {...textLabel6Props} />}
            </MenuItemOption>
          )}
        </>
      )}
    </Frame>
  )
}
