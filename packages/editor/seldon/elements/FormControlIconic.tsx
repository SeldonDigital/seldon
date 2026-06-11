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
 
import { HTMLAttributes } from "react"
import { Button, ButtonProps } from "../elements/Button"
import { Frame } from "../frames/Frame"
import { Icon, IconProps } from "../primitives/Icon"
import { Input, InputProps } from "../primitives/Input"
import { combineClassNames } from "../utils/class-name"

export interface FormControlIconicProps extends HTMLAttributes<HTMLElement> {
  className?: string
  icon?: IconProps | null
  input?: InputProps | null
  button?: ButtonProps | null
  icon2?: IconProps | null
}

/*****
 * Form Control: FormControlIconic
 * Level: Element
 * Intent: Captures plain text input from the user for forms or interactions.
 * Tags: UI, UI control, binary, boolean, checkbox, choice, control, decorated, dropdown, editable, exclusive, field, form, icon, input, menu, options, query, radio, search, select, single choice, text, toggle, user entry
 * Type: Custom
 *
 * @example
 * ```tsx
 * <FormControlIconic
 *   icon="material-star"
 *   input="{}"
 *   button={() => {}}
 * />
 * ```
 *****/
export function FormControlIconic({
  className = "",
  icon = sdn.icon,
  input = sdn.input,
  button,
  icon2 = sdn.icon2,
  ...props
}: FormControlIconicProps) {
  const formControlIconicClassName = combineClassNames(
    "sdn-form-control-iconic",
    className,
  )
  const iconProps =
    icon === null
      ? null
      : {
          ...sdn.icon,
          ...icon,
          className: combineClassNames(sdn.icon?.className, icon?.className),
        }
  const inputProps =
    input === null
      ? null
      : {
          ...sdn.input,
          ...input,
          className: combineClassNames(sdn.input?.className, input?.className),
        }
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
  const icon2Props =
    icon2 === null
      ? null
      : {
          ...sdn.icon2,
          ...icon2,
          className: combineClassNames(sdn.icon2?.className, icon2?.className),
        }

  return (
    <Frame className={formControlIconicClassName} {...props}>
      {iconProps !== null && <Icon {...iconProps} />}
      {inputProps !== null && <Input {...inputProps} />}
      {button && buttonProps && <Button {...buttonProps} icon={icon2Props} />}
    </Frame>
  )
}

//
// Default property values
//
const sdn: FormControlIconicProps = {
  icon: {
    icon: "__default__",
    className: "sdn-icon sdn-icon--9ywq",
  },
  input: {
    type: "text",
    className: "sdn-input sdn-input--f7yx",
  },
  button: {
    className: "sdn-button sdn-button--gdap",
  },
  icon2: {
    icon: "material-chevronDown",
    className: "sdn-icon sdn-icon--kuax",
  },
}
