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
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface ButtonMenuProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  textLabel?: TextLabelProps | null

  icon?: IconProps | null
}

//
// Default property values
//
const sdn: ButtonMenuProps = {
  textLabel: {
    children: "Button Menu",
    className: "sdn-text-label sdn-text-label--sa6t",
  },

  icon: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--y2ct",
  },
}

/**
 * Button: Menu
 * Level: Element
 * Intent: Standard button for triggering actions like submit, confirm, or cancel.
 * Tags: button, action, UI, primary, click, control, submit, call to action
 * Type: Custom
 *
 * Structure:
 *   TextLabel  textLabel
 *   Icon       icon
 *
 * @example
 * ```tsx
 * <ButtonMenu
 *   textLabel="{}"
 *   icon="material-star"
 * />
 * ```
 */
export function ButtonMenu({
  className = "",
  textLabel,

  icon,

  children,
  seldonRefs,
  ...props
}: ButtonMenuProps) {
  const buttonMenuClassName = combineClassNames("sdn-button-menu", className)

  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)

  return (
    <HTMLButton className={buttonMenuClassName} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {textLabelProps !== null && <TextLabel {...textLabelProps} />}
          {iconProps !== null && <Icon {...iconProps} />}
        </>
      )}
    </HTMLButton>
  )
}
