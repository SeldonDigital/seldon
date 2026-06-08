/*****
 *
 * This code was generated using Seldon (https://seldon.app)
 *
 * Licensed under the Terms of Use: https://seldon.digital/terms-of-service
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it,
 * in whole or in part, for the purposes of training, fine-tuning,
 * or otherwise improving (directly or indirectly) any machine learning
 * or artificial intelligence system.
 *
 *****/
import { ButtonHTMLAttributes } from "react"
import { HTMLButton } from "../native-react/HTML.Button"
import { Icon, IconProps } from "../primitives/Icon"
import { Label, LabelProps } from "../primitives/Label"
import { combineClassNames } from "../utils/class-name"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  icon?: IconProps
  label?: LabelProps
}

/*****
 * Button: Button
 * Level: Element
 * Intent: Standard button for triggering actions like submit, confirm, or cancel.
 * Tags: button, action, UI, primary, click, control, submit, call to action
 * Type: Default
 *
 * @example
 * ```tsx
 * <Button
 *   icon="material-star"
 *   label="Button Label"
 * />
 * ```
 *****/
export function Button({
  className = "",
  icon = sdn.icon,
  label = sdn.label,
  ...props
}: ButtonProps) {
  const buttonClassName = combineClassNames("sdn-button", className)
  const iconProps = {
    ...sdn.icon,
    ...icon,
    className: combineClassNames(sdn.icon?.className, icon?.className),
  }
  const labelProps = {
    ...sdn.label,
    ...label,
    className: combineClassNames(sdn.label?.className, label?.className),
  }

  return (
    <HTMLButton className={buttonClassName} {...props}>
      <Icon {...iconProps} />
      <Label {...labelProps} />
    </HTMLButton>
  )
}

//
// Default property values
//
const sdn: ButtonProps = {
  icon: {
    icon: "__default__",
    className: "sdn-icon sdn-icon--n5nb",
  },
  label: {
    children: "Button",
    htmlElement: "label",
    className: "sdn-label sdn-label--u587",
  },
}
