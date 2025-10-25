/*
 * This code was generated using Seldon (https://seldon.app)
 *
 * Licensed under the Terms of Use: https://seldon.digital/terms-of-service
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it,
 * in whole or in part, for the purposes of training, fine-tuning,
 * or otherwise improving (directly or indirectly) any machine learning
 * or artificial intelligence system.
 */
import { InputHTMLAttributes } from "react"
import { HTMLInput } from "../native-react/HTML.Input"

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
  inputType?: "checkbox"
}

export function Checkbox({
  className = "",
  onChange,
  ...props
}: CheckboxProps) {
  // If no onChange handler is provided, make it read-only to avoid React warning
  const inputProps = onChange
    ? { ...props, onChange }
    : { ...props, readOnly: true }

  return (
    <HTMLInput
      className={"variant-checkbox-default " + className}
      {...inputProps}
    />
  )
}
