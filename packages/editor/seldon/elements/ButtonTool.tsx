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

export interface ButtonToolProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  button?: ButtonProps
  icon?: IconProps
  textLabel?: TextLabelProps
  button2?: ButtonProps
  icon2?: IconProps
  textLabel2?: TextLabelProps
  button3?: ButtonProps
  icon3?: IconProps
  textLabel3?: TextLabelProps
}

/*****
 * Button: Tool
 * Level: Element
 * Intent: Standard button for triggering actions like submit, confirm, or cancel.
 * Tags: button, action, UI, primary, click, control, submit, call to action
 * Type: Custom
 *
 * @example
 * ```tsx
 * <ButtonTool
 *   button={() => {}}
 *   icon="material-star"
 *   textLabel="{}"
 *   button2={() => {}}
 *   button3={() => {}}
 * />
 * ```
 *****/
export function ButtonTool({
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
}: ButtonToolProps) {
  const buttonToolClassName = combineClassNames("sdn-button-tool", className)
  const buttonProps = {
    ...sdn.button,
    ...button,
    className: combineClassNames(sdn.button?.className, button?.className),
  }
  const iconProps = {
    ...sdn.icon,
    ...icon,
    className: combineClassNames(sdn.icon?.className, icon?.className),
  }
  const textLabelProps = {
    ...sdn.textLabel,
    ...textLabel,
    className: combineClassNames(
      sdn.textLabel?.className,
      textLabel?.className,
    ),
  }
  const button2Props = {
    ...sdn.button2,
    ...button2,
    className: combineClassNames(sdn.button2?.className, button2?.className),
  }
  const icon2Props = {
    ...sdn.icon2,
    ...icon2,
    className: combineClassNames(sdn.icon2?.className, icon2?.className),
  }
  const textLabel2Props = {
    ...sdn.textLabel2,
    ...textLabel2,
    className: combineClassNames(
      sdn.textLabel2?.className,
      textLabel2?.className,
    ),
  }
  const button3Props = {
    ...sdn.button3,
    ...button3,
    className: combineClassNames(sdn.button3?.className, button3?.className),
  }
  const icon3Props = {
    ...sdn.icon3,
    ...icon3,
    className: combineClassNames(sdn.icon3?.className, icon3?.className),
  }
  const textLabel3Props = {
    ...sdn.textLabel3,
    ...textLabel3,
    className: combineClassNames(
      sdn.textLabel3?.className,
      textLabel3?.className,
    ),
  }

  return (
    <HTMLButton className={buttonToolClassName} {...props}>
      <Button {...buttonProps}>
        {icon && <Icon {...iconProps} />}
        {textLabel && <TextLabel {...textLabelProps} />}
      </Button>
      <Button {...button2Props}>
        {icon2 && <Icon {...icon2Props} />}
        {textLabel2 && <TextLabel {...textLabel2Props} />}
      </Button>
      <Button {...button3Props}>
        {icon3 && <Icon {...icon3Props} />}
        {textLabel3 && <TextLabel {...textLabel3Props} />}
      </Button>
    </HTMLButton>
  )
}

//
// Default property values
//
const sdn: ButtonToolProps = {
  button: {
    className: "sdn-button sdn-button--yvc2",
  },
  icon: {
    icon: "__default__",
    className: "sdn-icon sdn-icon--v1uc",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--njzv",
  },
  button2: {
    className: "sdn-button sdn-button--yvc2",
  },
  icon2: {
    icon: "__default__",
    className: "sdn-icon sdn-icon--v1uc",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--njzv",
  },
  button3: {
    className: "sdn-button sdn-button--yvc2",
  },
  icon3: {
    icon: "__default__",
    className: "sdn-icon sdn-icon--v1uc",
  },
  textLabel3: {
    className: "sdn-text-label sdn-text-label--njzv",
  },
}
