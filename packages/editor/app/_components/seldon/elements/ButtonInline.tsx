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
import { Icon, IconProps } from "../primitives/Icon"
import { Label, LabelProps } from "../primitives/Label"

export interface ButtonInlineProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string

  iconProps?: IconProps
  labelProps?: LabelProps
}

export function ButtonInline({
  className = "",
  iconProps,
  labelProps,
  ...props
}: ButtonInlineProps) {
  return (
    <HTMLButton className={"variant-button-45dfNy " + className} {...props}>
      <Icon
        {...{ ...seldon.iconProps, ...iconProps }}
        className={
          "seldon-instance child-icon-Gwrk8h " + (iconProps?.className ?? "")
        }
      />
      <Label
        {...{ ...seldon.labelProps, ...labelProps }}
        className={
          "seldon-instance child-label-iyxBem " + (labelProps?.className ?? "")
        }
      />
    </HTMLButton>
  )
}

const seldon: ButtonInlineProps = {
  iconProps: {
    icon: "__default__",
  },
  labelProps: {
    children: "Label",
    htmlElement: "span",
  },
}
