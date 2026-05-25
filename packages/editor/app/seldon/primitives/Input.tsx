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
import { InputHTMLAttributes } from "react"
import { HTMLInput } from "../native-react/HTML.Input"
import { combineClassNames } from "../utils/class-name"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
  type?:
    | "text"
    | "number"
    | "email"
    | "password"
    | "search"
    | "tel"
    | "url"
    | "date"
    | "datetime-local"
}

/*****
 * Input: Input
 * Level: Primitive
 * Intent: Low-level text input control for collecting user input.
 * Tags: input, form, text, primitive, field, user entry, control
 * Type: Default
 *
 * @example
 * ```tsx
 * <Input
 *   type="text"
 * />
 * ```
 *****/
export function Input({
  className = "",
  type = sdn.type,
  ...props
}: InputProps) {
  const inputClassName = combineClassNames("sdn-input", className)

  //
  // React JSX component with merged default and custom properties
  //
  return <HTMLInput className={inputClassName} type={type} {...props} />
}

//
// Default property values
//
const sdn: InputProps = {
  type: "text",
  className: "sdn-input",
}
