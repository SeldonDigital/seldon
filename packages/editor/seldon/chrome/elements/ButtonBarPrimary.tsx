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
import { Button, ButtonProps } from "../elements/Button"
import { ButtonPrimary, ButtonPrimaryProps } from "../elements/ButtonPrimary"
import { Frame } from "../frames/Frame"
import { IconProps } from "../primitives/Icon"
import { LabelProps } from "../primitives/Label"

export interface ButtonBarPrimaryProps extends HTMLAttributes<HTMLElement> {
  className?: string

  buttonProps?: ButtonProps
  buttonIconProps?: IconProps
  buttonLabelProps?: LabelProps
  buttonPrimary1Props?: ButtonPrimaryProps
  buttonPrimary1IconProps?: IconProps
  buttonPrimary1LabelProps?: LabelProps
}

export function ButtonBarPrimary({
  className = "",
  buttonProps,
  buttonIconProps,
  buttonLabelProps,
  buttonPrimary1Props,
  buttonPrimary1IconProps,
  buttonPrimary1LabelProps,
  ...props
}: ButtonBarPrimaryProps) {
  return (
    <Frame className={"variant-buttonBar-fhhPG3 " + className} {...props}>
      <Button
        {...{ ...seldon.buttonProps, ...buttonProps }}
        className={
          "seldon-instance child-button-kgLIcN " +
          (buttonProps?.className ?? "")
        }
        iconProps={{ ...seldon.buttonIconProps, ...buttonIconProps }}
        labelProps={{ ...seldon.buttonLabelProps, ...buttonLabelProps }}
      />
      <ButtonPrimary
        {...{ ...seldon.buttonPrimary1Props, ...buttonPrimary1Props }}
        className={
          "seldon-instance child-button-kaZNep " +
          (buttonPrimary1Props?.className ?? "")
        }
        iconProps={{
          ...seldon.buttonPrimary1IconProps,
          ...buttonPrimary1IconProps,
        }}
        labelProps={{
          ...seldon.buttonPrimary1LabelProps,
          ...buttonPrimary1LabelProps,
        }}
      />
    </Frame>
  )
}

const seldon: ButtonBarPrimaryProps = {
  buttonProps: {},
  buttonIconProps: {
    icon: "__default__",
  },
  buttonLabelProps: {
    children: "Label",
    htmlElement: "span",
  },
  buttonPrimary1Props: {},
  buttonPrimary1IconProps: {
    icon: "__default__",
  },
  buttonPrimary1LabelProps: {
    children: "Label",
    htmlElement: "span",
  },
}
