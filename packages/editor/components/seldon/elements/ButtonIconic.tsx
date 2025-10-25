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

export interface ButtonIconicProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string

  iconProps?: IconProps
}

export function ButtonIconic({
  className = "",
  iconProps,
  ...props
}: ButtonIconicProps) {
  return (
    <HTMLButton className={"variant-button-C11YhJ " + className} {...props}>
      <Icon
        {...{ ...seldon.iconProps, ...iconProps }}
        className={
          "seldon-instance child-icon-mN_VHh " + (iconProps?.className ?? "")
        }
      />
    </HTMLButton>
  )
}

const seldon: ButtonIconicProps = {
  iconProps: {
    icon: "material-chevronDoubleLeft",
  },
}
