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
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface ButtonIconicProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  icon?: IconProps | null
}

/*****
 * Button: Iconic
 * Level: Element
 * Intent: Standard button for triggering actions like submit, confirm, or cancel.
 * Tags: button, action, UI, primary, click, control, submit, call to action
 * Type: Custom
 *
 * @example
 * ```tsx
 * <ButtonIconic
 *   icon="material-star"
 * />
 * ```
 *****/
export const ButtonIconic = forwardRef<HTMLButtonElement, ButtonIconicProps>(
  function ButtonIconic(
    { className = "", icon = sdn.icon, children, seldonRefs, ...props },
    ref,
  ) {
    const buttonIconicClassName = combineClassNames(
      "sdn-button-iconic",
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

    return (
      <HTMLButton className={buttonIconicClassName} ref={ref} {...props}>
        {children !== undefined ? (
          children
        ) : (
          <>{iconProps !== null && <Icon {...iconProps} />}</>
        )}
      </HTMLButton>
    )
  },
)

//
// Default property values
//
const sdn: ButtonIconicProps = {
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
}
