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
import { SeldonRefs, mergeOptionalSlot } from "../utils/merge-slot"

export interface MenuItemOptionProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  icon?: IconProps | null

  textLabel?: TextLabelProps | null

  textLabel2?: TextLabelProps | null
}

//
// Default property values
//
const sdn: MenuItemOptionProps = {
  role: "option",
  "aria-hidden": "false",
  icon: {
    icon: "material-check",
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "optionIcon",
  },

  textLabel: {
    children: "Option",
    className: "sdn-text-label sdn-text-label--xohb",
    "data-seldon-ref": "optionLabel",
  },

  textLabel2: {
    children: "Annotation",
    className: "sdn-text-label sdn-text-label--lqmh",
    "data-seldon-ref": "optionAnnotation",
  },
}

/**
 * Menu Item: MenuItemOption
 * Level: Element
 * Intent: Single actionable row inside a menu.
 * Tags: menu, menuitem, action, row, element, UI
 * Type: Custom
 *
 * Structure:
 *   Icon       icon        -> optionIcon
 *   TextLabel  textLabel   -> optionLabel
 *   TextLabel  textLabel2  -> optionAnnotation
 *
 * @example
 * ```tsx
 * <MenuItemOption
 *   role="option"
 *   aria-hidden="false"
 * />
 * ```
 */
export function MenuItemOption({
  className = "",
  icon,

  textLabel,

  textLabel2,

  children,
  seldonRefs,
  ...props
}: MenuItemOptionProps) {
  const menuItemOptionClassName = combineClassNames("sdn-menu-item", className)

  const iconProps = mergeOptionalSlot(sdn.icon, icon, seldonRefs)

  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)

  return (
    <Frame
      className={menuItemOptionClassName}
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
