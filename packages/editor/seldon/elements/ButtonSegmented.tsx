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
import { Button, ButtonProps } from "../elements/Button"
import { HTMLButton } from "../native-react/HTML.Button"
import { Icon, IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"

export interface ButtonSegmentedProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
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
 * Button: Segmented
 * Level: Element
 * Intent: Standard button for triggering actions like submit, confirm, or cancel.
 * Tags: button, action, UI, primary, click, control, submit, call to action
 * Type: Custom
 *
 * @example
 * ```tsx
 * <ButtonSegmented
 *   button={() => {}}
 *   icon="material-star"
 *   textLabel="{}"
 *   button2={() => {}}
 *   button3={() => {}}
 * />
 * ```
 *****/
export function ButtonSegmented({
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
  ...props
}: ButtonSegmentedProps) {
  const buttonSegmentedClassName = combineClassNames(
    "sdn-button-segmented",
    className,
  )
  const buttonProps =
    button === null
      ? null
      : {
          ...sdn.button,
          ...button,
          className: combineClassNames(
            sdn.button?.className,
            button?.className,
          ),
        }
  const iconProps =
    icon === null
      ? null
      : {
          ...sdn.icon,
          ...icon,
          className: combineClassNames(sdn.icon?.className, icon?.className),
        }
  const textLabelProps =
    textLabel === null
      ? null
      : {
          ...sdn.textLabel,
          ...textLabel,
          className: combineClassNames(
            sdn.textLabel?.className,
            textLabel?.className,
          ),
        }
  const button2Props =
    button2 === null
      ? null
      : {
          ...sdn.button2,
          ...button2,
          className: combineClassNames(
            sdn.button2?.className,
            button2?.className,
          ),
        }
  const icon2Props =
    icon2 === null
      ? null
      : {
          ...sdn.icon2,
          ...icon2,
          className: combineClassNames(sdn.icon2?.className, icon2?.className),
        }
  const textLabel2Props =
    textLabel2 === null
      ? null
      : {
          ...sdn.textLabel2,
          ...textLabel2,
          className: combineClassNames(
            sdn.textLabel2?.className,
            textLabel2?.className,
          ),
        }
  const button3Props =
    button3 === null
      ? null
      : {
          ...sdn.button3,
          ...button3,
          className: combineClassNames(
            sdn.button3?.className,
            button3?.className,
          ),
        }
  const icon3Props =
    icon3 === null
      ? null
      : {
          ...sdn.icon3,
          ...icon3,
          className: combineClassNames(sdn.icon3?.className, icon3?.className),
        }
  const textLabel3Props =
    textLabel3 === null
      ? null
      : {
          ...sdn.textLabel3,
          ...textLabel3,
          className: combineClassNames(
            sdn.textLabel3?.className,
            textLabel3?.className,
          ),
        }

  return (
    <HTMLButton className={buttonSegmentedClassName} {...props}>
      {buttonProps !== null && (
        <Button {...buttonProps}>
          {icon && iconProps && <Icon {...iconProps} />}
          {textLabel && textLabelProps && <TextLabel {...textLabelProps} />}
        </Button>
      )}
      {button2Props !== null && (
        <Button {...button2Props}>
          {icon2 && icon2Props && <Icon {...icon2Props} />}
          {textLabel2 && textLabel2Props && <TextLabel {...textLabel2Props} />}
        </Button>
      )}
      {button3Props !== null && (
        <Button {...button3Props}>
          {icon3 && icon3Props && <Icon {...icon3Props} />}
          {textLabel3 && textLabel3Props && <TextLabel {...textLabel3Props} />}
        </Button>
      )}
    </HTMLButton>
  )
}

//
// Default property values
//
const sdn: ButtonSegmentedProps = {
  button: {
    className: "sdn-button sdn-button--suj9",
  },
  icon: {
    icon: "__default__",
    className: "sdn-icon sdn-icon--v1uc",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--njzv",
  },
  button2: {
    className: "sdn-button sdn-button--llun",
  },
  icon2: {
    icon: "__default__",
    className: "sdn-icon sdn-icon--v1uc",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--njzv",
  },
  button3: {
    className: "sdn-button sdn-button--u50r",
  },
  icon3: {
    icon: "__default__",
    className: "sdn-icon sdn-icon--v1uc",
  },
  textLabel3: {
    className: "sdn-text-label sdn-text-label--njzv",
  },
}
