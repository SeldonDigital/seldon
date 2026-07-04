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
import { InputHTMLAttributes } from "react"
import { HTMLInput } from "../native-react/HTML.Input"
import { combineClassNames } from "../utils/class-name"

export interface InputRadioButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
  "data-seldon-ref"?: string
  type?: string
}

/*****
 * Input: RadioButton
 * Level: Primitive
 * Intent: Low-level text input control for collecting user input.
 * Tags: input, form, text, primitive, field, user entry, control
 * Type: Custom
 *
 * @example
 * ```tsx
 * <InputRadioButton
 *   type="radio"
 * />
 * ```
 *****/
export function InputRadioButton({
  className = "",
  type = sdn.type,
  ...props
}: InputRadioButtonProps) {
  const inputRadioButtonClassName = combineClassNames(
    "sdn-input-checkbox",
    className,
  )

  //
  // React JSX component with merged default and custom properties
  //
  return (
    <HTMLInput className={inputRadioButtonClassName} type={type} {...props} />
  )
}

//
// Default property values
//
const sdn: InputRadioButtonProps = {
  type: "radio",
  className: "sdn-input-checkbox sdn-input",
}
