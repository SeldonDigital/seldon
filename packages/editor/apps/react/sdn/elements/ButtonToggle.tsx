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
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeSlot } from "../utils/merge-slot"

export interface ButtonToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  icon?: IconProps | null
}

//
// Default property values
//
const sdn: ButtonToggleProps = {
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
}

/**
 * Button: Toggle
 * Level: Element
 * Intent: Standard button for triggering actions like submit, confirm, or cancel.
 * Tags: button, action, UI, primary, click, control, submit, call to action
 * Type: Custom
 *
 * Structure:
 *   Icon  icon
 *
 * @example
 * ```tsx
 * <ButtonToggle
 *   icon="material-star"
 * />
 * ```
 */
export function ButtonToggle({
  className = "",
  icon,

  children,
  seldonRefs,
  ...props
}: ButtonToggleProps) {
  const buttonToggleClassName = combineClassNames("sdn-button-toggle", className)

  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)

  return (
    <HTMLButton className={buttonToggleClassName} {...props}>
      {children !== undefined ? children : <>{iconProps !== null && <Icon {...iconProps} />}</>}
    </HTMLButton>
  )
}
