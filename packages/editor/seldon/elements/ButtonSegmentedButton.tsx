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
import { Button, ButtonProps } from "../elements/Button"
import { HTMLButton } from "../native-react/HTML.Button"
import { Icon, IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface ButtonSegmentedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  button?: ButtonProps | null
  icon?: IconProps | null
  textLabel?: TextLabelProps | null
  button2?: ButtonProps | null
  icon2?: IconProps | null
  textLabel2?: TextLabelProps | null
  button3?: ButtonProps | null
  icon3?: IconProps | null
  textLabel3?: TextLabelProps | null
}

/*****
 * Button: SegmentedButton
 * Level: Element
 * Intent: Standard button for triggering actions like submit, confirm, or cancel.
 * Tags: button, action, UI, primary, click, control, submit, call to action
 * Type: Custom
 *
 * @example
 * ```tsx
 * <ButtonSegmentedButton
 *   button={() => {}}
 *   icon="material-star"
 *   textLabel="{}"
 *   button2={() => {}}
 *   button3={() => {}}
 * />
 * ```
 *****/
export const ButtonSegmentedButton = forwardRef<
  HTMLButtonElement,
  ButtonSegmentedButtonProps
>(function ButtonSegmentedButton(
  {
    className = "",
    button = sdn.button,
    icon = sdn.icon,
    textLabel,
    button2 = sdn.button2,
    icon2 = sdn.icon2,
    textLabel2,
    button3 = sdn.button3,
    icon3 = sdn.icon3,
    textLabel3,
    children,
    seldonRefs,
    ...props
  },
  ref,
) {
  const buttonSegmentedButtonClassName = combineClassNames(
    "sdn-button-segmented-button",
    className,
  )
  const buttonProps = applyRef(
    seldonRefs,
    button === null
      ? null
      : {
          ...sdn.button,
          ...button,
          className: combineClassNames(
            sdn.button?.className,
            button?.className,
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
  const button2Props = applyRef(
    seldonRefs,
    button2 === null
      ? null
      : {
          ...sdn.button2,
          ...button2,
          className: combineClassNames(
            sdn.button2?.className,
            button2?.className,
          ),
        },
  )
  const icon2Props = applyRef(
    seldonRefs,
    icon2 === null
      ? null
      : {
          ...sdn.icon2,
          ...icon2,
          className: combineClassNames(sdn.icon2?.className, icon2?.className),
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
  const button3Props = applyRef(
    seldonRefs,
    button3 === null
      ? null
      : {
          ...sdn.button3,
          ...button3,
          className: combineClassNames(
            sdn.button3?.className,
            button3?.className,
          ),
        },
  )
  const icon3Props = applyRef(
    seldonRefs,
    icon3 === null
      ? null
      : {
          ...sdn.icon3,
          ...icon3,
          className: combineClassNames(sdn.icon3?.className, icon3?.className),
        },
  )
  const textLabel3Props = applyRef(
    seldonRefs,
    textLabel3 === null
      ? null
      : {
          ...sdn.textLabel3,
          ...textLabel3,
          className: combineClassNames(
            sdn.textLabel3?.className,
            textLabel3?.className,
          ),
        },
  )

  return (
    <HTMLButton className={buttonSegmentedButtonClassName} ref={ref} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {buttonProps !== null && (
            <Button {...buttonProps}>
              {icon && iconProps && <Icon {...iconProps} />}
              {textLabel && textLabelProps && <TextLabel {...textLabelProps} />}
            </Button>
          )}
          {button2Props !== null && (
            <Button {...button2Props}>
              {icon2 && icon2Props && <Icon {...icon2Props} />}
              {textLabel2 && textLabel2Props && (
                <TextLabel {...textLabel2Props} />
              )}
            </Button>
          )}
          {button3Props !== null && (
            <Button {...button3Props}>
              {icon3 && icon3Props && <Icon {...icon3Props} />}
              {textLabel3 && textLabel3Props && (
                <TextLabel {...textLabel3Props} />
              )}
            </Button>
          )}
        </>
      )}
    </HTMLButton>
  )
})

//
// Default property values
//
const sdn: ButtonSegmentedButtonProps = {
  button: {
    className: "sdn-button sdn-button--fixt",
  },
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--ylte",
  },
  button2: {
    className: "sdn-button sdn-button-simple--fjtm",
  },
  icon2: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--ylte",
  },
  button3: {
    className: "sdn-button sdn-button--y4uf",
  },
  icon3: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
  },
  textLabel3: {
    className: "sdn-text-label sdn-text-label--ylte",
  },
}
