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
import { Input, InputProps } from "../primitives/Input"
import { Label, LabelProps } from "../primitives/Label"
import { Text, TextProps } from "../primitives/Text"

export interface TextEditProps extends HTMLAttributes<HTMLElement> {
  className?: string

  labelProps?: LabelProps
  inputProps?: InputProps
  textProps?: TextProps
}

export function TextEdit({
  className = "",
  labelProps,
  inputProps,
  textProps,
  ...props
}: TextEditProps) {
  return (
    <Frame className={"variant-textEdit-default " + className} {...props}>
      <Label
        {...{ ...seldon.labelProps, ...labelProps }}
        className={
          "seldon-instance child-label-jVGq6s " + (labelProps?.className ?? "")
        }
      />
      <Input
        {...{ ...seldon.inputProps, ...inputProps }}
        className={
          "seldon-instance child-input-I_gCgM " + (inputProps?.className ?? "")
        }
      />
      <Text
        {...{ ...seldon.textProps, ...textProps }}
        className={
          "seldon-instance child-text-0vGMFU " + (textProps?.className ?? "")
        }
      />
    </Frame>
  )
}

const seldon: TextEditProps = {
  labelProps: {
    children: "Label",
    htmlElement: "span",
  },
  inputProps: {
    inputType: "text",
  },
  textProps: {
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus. Donec euismod in fringilla.",
    htmlElement: "p",
  },
}
