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

export interface ButtonMenuProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  textLabel?: TextLabelProps | null
  icon?: IconProps | null
}

/*****
 * Button: Menu
 * Level: Element
 * Intent: Standard button for triggering actions like submit, confirm, or cancel.
 * Tags: button, action, UI, primary, click, control, submit, call to action
 * Type: Custom
 *
 * @example
 * ```tsx
 * <ButtonMenu
 *   textLabel="{}"
 *   icon="material-star"
 * />
 * ```
 *****/
export const ButtonMenu = forwardRef<HTMLButtonElement, ButtonMenuProps>(
  function ButtonMenu(
    {
      className = "",
      textLabel,
      icon = sdn.icon,
      children,
      seldonRefs,
      ...props
    },
    ref,
  ) {
    const buttonMenuClassName = combineClassNames("sdn-button-menu", className)
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
      <HTMLButton
        className={buttonMenuClassName}
        data-seldon-ref={"menuStates"}
        ref={ref}
        {...props}
      >
        {children !== undefined ? (
          children
        ) : (
          <>
            {textLabel && textLabelProps && <TextLabel {...textLabelProps} />}
            {iconProps !== null && <Icon {...iconProps} />}
          </>
        )}
      </HTMLButton>
    )
  },
)

//
// Default property values
//
const sdn: ButtonMenuProps = {
  textLabel: {
    className: "sdn-text-label sdn-text-label--zw0q",
  },
  icon: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--iqmk",
  },
}
