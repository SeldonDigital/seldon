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

export interface ButtonIconicPrimaryProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string

  iconProps?: IconProps
}

export function ButtonIconicPrimary({
  className = "",
  iconProps,
  ...props
}: ButtonIconicPrimaryProps) {
  return (
    <HTMLButton className={"variant-button-TKa58L " + className} {...props}>
      <Icon
        {...{ ...seldon.iconProps, ...iconProps }}
        className={
          "seldon-instance child-icon-uHtO0j " + (iconProps?.className ?? "")
        }
      />
    </HTMLButton>
  )
}

const seldon: ButtonIconicPrimaryProps = {
  iconProps: {
    icon: "material-chevronDoubleLeft",
  },
}
