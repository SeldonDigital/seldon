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
import { Frame, FrameProps } from "../frames/Frame"
import { Icon, IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface MenuGroupedOptionsProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  frame?: FrameProps | null
  textLabel?: TextLabelProps | null
  menuItemOption?: MenuItemOptionProps | null
  icon?: IconProps | null
  textLabel2?: TextLabelProps | null
  textLabel3?: TextLabelProps | null
}

//
// Default property values
//
const sdn: MenuGroupedOptionsProps = {
  role: "listbox",
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    role: "group",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--6o7x",
  },
  textLabel: {
    children: "Group A",
    className: "sdn-text-label sdn-text-label--oqkb",
  },
  menuItemOption: {
    className: "sdn-menu-item-option sdn-menu-item-option--6dxl",
  },
  icon: {
    icon: "material-check",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel2: {
    children: "Option",
    className: "sdn-text-label sdn-text-label--y8ur",
  },
  textLabel3: {
    children: "Annotation",
    className: "sdn-text-label sdn-text-label--ni4j",
  },
}

/**
 * Menu: MenuGroupedOptions
 * Level: Part
 * Intent: Floating list of actions anchored to a trigger.
 * Tags: menu, dropdown, actions, part, overlay, UI
 * Type: Inline
 *
 * Structure:
 *   Frame             frame
 *     TextLabel       textLabel
 *     MenuItemOption  menuItemOption
 *       Icon          icon
 *       TextLabel     textLabel2
 *       TextLabel     textLabel3
 *
 * @example
 * ```tsx
 * <MenuGroupedOptions
 *   role="listbox"
 *   aria-hidden="false"
 * />
 * ```
 */
export function MenuGroupedOptions({
  className = "",
  frame,
  textLabel,
  menuItemOption,
  icon,
  textLabel2,
  textLabel3,

  children,
  seldonRefs,
  ...props
}: MenuGroupedOptionsProps) {
  const menuGroupedOptionsClassName = combineClassNames("sdn-menu", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const menuItemOptionProps = mergeOptionalSlot(sdn.menuItemOption, menuItemOption, seldonRefs)
  const iconProps = mergeOptionalSlot(sdn.icon, icon, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)

  return (
    <Frame
      className={menuGroupedOptionsClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            {textLabelProps !== null && <TextLabel {...textLabelProps} />}
            {menuItemOptionProps !== null && (
              <MenuItemOption {...menuItemOptionProps}>
                {iconProps !== null && <Icon {...iconProps} />}
                {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
                {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
              </MenuItemOption>
            )}
          </Frame>
        </>
      )}
    </Frame>
  )
}
