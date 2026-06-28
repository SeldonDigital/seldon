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
 
import { ButtonHTMLAttributes, forwardRef } from "react"
import { HTMLButton } from "../native-react/HTML.Button"
import { Icon, IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  icon?: IconProps | null
  textLabel?: TextLabelProps | null
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
 *   textLabel="{}"
 * />
 * ```
 *****/
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className = "",
      icon = sdn.icon,
      textLabel,
      children,
      seldonRefs,
      ...props
    },
    ref,
  ) {
    const buttonClassName = combineClassNames("sdn-button", className)
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
      <HTMLButton className={buttonClassName} ref={ref} {...props}>
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
  },
)

//
// Default property values
//
const sdn: ButtonProps = {
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--ylte",
  },
}
