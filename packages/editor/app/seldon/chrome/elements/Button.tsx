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

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string

  iconProps?: IconProps
  labelProps?: LabelProps
}

export function Button({
  className = "",
  iconProps,
  labelProps,
  ...props
}: ButtonProps) {
  return (
    <HTMLButton className={"variant-button-default " + className} {...props}>
      <Icon
        {...{ ...seldon.iconProps, ...iconProps }}
        className={
          "seldon-instance child-icon-PmWdra " + (iconProps?.className ?? "")
        }
      />
      <Label
        {...{ ...seldon.labelProps, ...labelProps }}
        className={
          "seldon-instance child-label-XjbI5K " + (labelProps?.className ?? "")
        }
      />
    </HTMLButton>
  )
}

const seldon: ButtonProps = {
  iconProps: {
    icon: "__default__",
  },
  labelProps: {
    children: "Label",
    htmlElement: "span",
  },
}
