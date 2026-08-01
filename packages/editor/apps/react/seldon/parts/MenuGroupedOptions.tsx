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
import { Hr, HrProps } from "../primitives/Hr"
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
  menuItemOption2?: MenuItemOptionProps | null
  icon2?: IconProps | null
  textLabel4?: TextLabelProps | null
  textLabel5?: TextLabelProps | null

  hr?: HrProps | null

  frame2?: FrameProps | null
  textLabel6?: TextLabelProps | null
  menuItemOption3?: MenuItemOptionProps | null
  icon3?: IconProps | null
  textLabel7?: TextLabelProps | null
  textLabel8?: TextLabelProps | null
  menuItemOption4?: MenuItemOptionProps | null
  icon4?: IconProps | null
  textLabel9?: TextLabelProps | null
  textLabel10?: TextLabelProps | null
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
    className: "sdn-menu-item sdn-menu-item-option--6dxl",
  },
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  textLabel2: {
    children: "Option",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  textLabel3: {
    children: "Annotation",
    className: "sdn-text-label sdn-text-label--lqmh",
  },
  menuItemOption2: {
    className: "sdn-menu-item sdn-menu-item-option--6dxl",
  },
  icon2: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  textLabel4: {
    children: "Option",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  textLabel5: {
    children: "Annotation",
    className: "sdn-text-label sdn-text-label--lqmh",
  },

  hr: {
    "aria-hidden": "false",
    className: "sdn-hr sdn-hr--xtig",
  },

  frame2: {
    wrapperElement: "div",
    role: "group",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--6o7x",
  },
  textLabel6: {
    children: "Group B",
    className: "sdn-text-label sdn-text-label--oqkb",
  },
  menuItemOption3: {
    className: "sdn-menu-item sdn-menu-item-option--6dxl",
  },
  icon3: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  textLabel7: {
    children: "Option",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  textLabel8: {
    children: "Annotation",
    className: "sdn-text-label sdn-text-label--lqmh",
  },
  menuItemOption4: {
    className: "sdn-menu-item sdn-menu-item-option--6dxl",
  },
  icon4: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  textLabel9: {
    children: "Option",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  textLabel10: {
    children: "Annotation",
    className: "sdn-text-label sdn-text-label--lqmh",
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
 *     MenuItemOption  menuItemOption2
 *       Icon          icon2
 *       TextLabel     textLabel4
 *       TextLabel     textLabel5
 *   Hr                hr
 *   Frame             frame2
 *     TextLabel       textLabel6
 *     MenuItemOption  menuItemOption3
 *       Icon          icon3
 *       TextLabel     textLabel7
 *       TextLabel     textLabel8
 *     MenuItemOption  menuItemOption4
 *       Icon          icon4
 *       TextLabel     textLabel9
 *       TextLabel     textLabel10
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
  menuItemOption2,
  icon2,
  textLabel4,
  textLabel5,

  hr,

  frame2,
  textLabel6,
  menuItemOption3,
  icon3,
  textLabel7,
  textLabel8,
  menuItemOption4,
  icon4,
  textLabel9,
  textLabel10,

  children,
  seldonRefs,
  ...props
}: MenuGroupedOptionsProps) {
  const menuGroupedOptionsClassName = combineClassNames("sdn-menu-options", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const menuItemOptionProps = mergeOptionalSlot(sdn.menuItemOption, menuItemOption, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)
  const menuItemOption2Props = mergeOptionalSlot(sdn.menuItemOption2, menuItemOption2, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)
  const textLabel4Props = mergeOptionalSlot(sdn.textLabel4, textLabel4, seldonRefs)
  const textLabel5Props = mergeOptionalSlot(sdn.textLabel5, textLabel5, seldonRefs)

  const hrProps = mergeSlot(sdn.hr, hr, seldonRefs)

  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const textLabel6Props = mergeOptionalSlot(sdn.textLabel6, textLabel6, seldonRefs)
  const menuItemOption3Props = mergeOptionalSlot(sdn.menuItemOption3, menuItemOption3, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)
  const textLabel7Props = mergeOptionalSlot(sdn.textLabel7, textLabel7, seldonRefs)
  const textLabel8Props = mergeOptionalSlot(sdn.textLabel8, textLabel8, seldonRefs)
  const menuItemOption4Props = mergeOptionalSlot(sdn.menuItemOption4, menuItemOption4, seldonRefs)
  const icon4Props = mergeSlot(sdn.icon4, icon4, seldonRefs)
  const textLabel9Props = mergeOptionalSlot(sdn.textLabel9, textLabel9, seldonRefs)
  const textLabel10Props = mergeOptionalSlot(sdn.textLabel10, textLabel10, seldonRefs)

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
            {menuItemOption2Props !== null && (
              <MenuItemOption {...menuItemOption2Props}>
                {icon2Props !== null && <Icon {...icon2Props} />}
                {textLabel4Props !== null && <TextLabel {...textLabel4Props} />}
                {textLabel5Props !== null && <TextLabel {...textLabel5Props} />}
              </MenuItemOption>
            )}
          </Frame>
          {hrProps !== null && <Hr {...hrProps} />}
          <Frame {...frame2Props}>
            {textLabel6Props !== null && <TextLabel {...textLabel6Props} />}
            {menuItemOption3Props !== null && (
              <MenuItemOption {...menuItemOption3Props}>
                {icon3Props !== null && <Icon {...icon3Props} />}
                {textLabel7Props !== null && <TextLabel {...textLabel7Props} />}
                {textLabel8Props !== null && <TextLabel {...textLabel8Props} />}
              </MenuItemOption>
            )}
            {menuItemOption4Props !== null && (
              <MenuItemOption {...menuItemOption4Props}>
                {icon4Props !== null && <Icon {...icon4Props} />}
                {textLabel9Props !== null && <TextLabel {...textLabel9Props} />}
                {textLabel10Props !== null && <TextLabel {...textLabel10Props} />}
              </MenuItemOption>
            )}
          </Frame>
        </>
      )}
    </Frame>
  )
}
