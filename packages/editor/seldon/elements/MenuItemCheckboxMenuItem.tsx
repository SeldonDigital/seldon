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
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface MenuItemCheckboxMenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  icon?: IconProps | null
  textLabel?: TextLabelProps | null
}

/*****
 * Menu Item: MenuItemCheckboxMenuItem
 * Level: Element
 * Intent: Single actionable row inside a menu.
 * Tags: menu, menuitem, action, row, element, UI
 * Type: Custom
 *
 * @example
 * ```tsx
 * <MenuItemCheckboxMenuItem
 *   role="menuitemcheckbox"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function MenuItemCheckboxMenuItem({
  className = "",
  icon = sdn.icon,
  textLabel,
  children,
  seldonRefs,
  ...props
}: MenuItemCheckboxMenuItemProps) {
  const menuItemCheckboxMenuItemClassName = combineClassNames(
    "sdn-menu-item",
    className,
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

  return (
    <HTMLButton
      className={menuItemCheckboxMenuItemClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {iconProps !== null && <Icon {...iconProps} />}
          {textLabel && textLabelProps && <TextLabel {...textLabelProps} />}
        </>
      )}
    </HTMLButton>
  )
}

//
// Default property values
//
const sdn: MenuItemCheckboxMenuItemProps = {
  role: "menuitemcheckbox",
  "aria-hidden": "false",
  className: "sdn-menu-item sdn-menu-item",
  icon: {
    icon: "material-check",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--dtru",
  },
}
