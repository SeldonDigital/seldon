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
import { ButtonHTMLAttributes } from "react"
import { HTMLButton } from "../native-react/HTML.Button"
import { Label, LabelProps } from "../primitives/Label"

export interface ButtonTextProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string

  labelProps?: LabelProps
}

export function ButtonText({
  className = "",
  labelProps,
  ...props
}: ButtonTextProps) {
  return (
    <HTMLButton className={"variant-button-J6HUJb " + className} {...props}>
      <Label
        {...{ ...seldon.labelProps, ...labelProps }}
        className={
          "seldon-instance child-label-dZEBqu " + (labelProps?.className ?? "")
        }
      />
    </HTMLButton>
  )
}

const seldon: ButtonTextProps = {
  labelProps: {
    children: "Label",
    htmlElement: "span",
  },
}
