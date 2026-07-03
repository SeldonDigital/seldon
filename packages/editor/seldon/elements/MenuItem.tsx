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

export interface MenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  icon?: IconProps | null
  textLabel?: TextLabelProps | null
  textLabel2?: TextLabelProps | null
}

/*****
 * Menu Item: MenuItem
 * Level: Element
 * Intent: Single actionable row inside a menu.
 * Tags: menu, menuitem, action, row, element, UI
 * Type: Default
 *
 * @example
 * ```tsx
 * <MenuItem
 *   role="menuitem"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function MenuItem({
  className = "",
  icon = sdn.icon,
  textLabel,
  textLabel2,
  children,
  seldonRefs,
  ...props
}: MenuItemProps) {
  const menuItemClassName = combineClassNames("sdn-menu-item", className)
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

  return (
    <HTMLButton
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
          {textLabel && textLabelProps && <TextLabel {...textLabelProps} />}
          {textLabel2 && textLabel2Props && <TextLabel {...textLabel2Props} />}
        </>
      )}
    </HTMLButton>
  )
}

//
// Default property values
//
const sdn: MenuItemProps = {
  role: "menuitem",
  "aria-hidden": "false",
  className: "sdn-menu-item",
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--xohb",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--fdei",
  },
}
