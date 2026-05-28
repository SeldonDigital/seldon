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
import { HTMLAttributes } from "react"
import { Frame } from "../frames/Frame"
import { Checkbox, CheckboxProps } from "../primitives/Checkbox"
import { Input, InputProps } from "../primitives/Input"

export interface InputControlProps extends HTMLAttributes<HTMLElement> {
  className?: string

  checkboxProps?: CheckboxProps
  inputProps?: InputProps
}

export function InputControl({
  className = "",
  checkboxProps,
  inputProps,
  ...props
}: InputControlProps) {
  return (
    <Frame className={"variant-inputControl-default " + className} {...props}>
      <Checkbox
        {...{ ...seldon.checkboxProps, ...checkboxProps }}
        className={
          "seldon-instance child-checkbox-WyFU1G " +
          (checkboxProps?.className ?? "")
        }
      />
      <Input
        {...{ ...seldon.inputProps, ...inputProps }}
        className={
          "seldon-instance child-input-dB52ps " + (inputProps?.className ?? "")
        }
      />
    </Frame>
  )
}

const seldon: InputControlProps = {
  checkboxProps: {
    inputType: "checkbox",
  },
  inputProps: {
    inputType: "text",
  },
}
