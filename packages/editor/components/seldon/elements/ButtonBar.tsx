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
import { Frame } from "../frames/Frame"
import { IconProps } from "../primitives/Icon"
import { LabelProps } from "../primitives/Label"

export interface ButtonBarProps extends HTMLAttributes<HTMLElement> {
  className?: string

  buttonProps?: ButtonProps
  buttonIconProps?: IconProps
  buttonLabelProps?: LabelProps
  button1Props?: ButtonProps
  button1IconProps?: IconProps
  button1LabelProps?: LabelProps
}

export function ButtonBar({
  className = "",
  buttonProps,
  buttonIconProps,
  buttonLabelProps,
  button1Props,
  button1IconProps,
  button1LabelProps,
  ...props
}: ButtonBarProps) {
  return (
    <Frame className={"variant-buttonBar-default " + className} {...props}>
      <Button
        {...{ ...seldon.buttonProps, ...buttonProps }}
        className={
          "seldon-instance child-button-qyM3y5 " +
          (buttonProps?.className ?? "")
        }
        iconProps={{ ...seldon.buttonIconProps, ...buttonIconProps }}
        labelProps={{ ...seldon.buttonLabelProps, ...buttonLabelProps }}
      />
      <Button
        {...{ ...seldon.button1Props, ...button1Props }}
        className={
          "seldon-instance child-button-3TGh8C " +
          (button1Props?.className ?? "")
        }
        iconProps={{ ...seldon.button1IconProps, ...button1IconProps }}
        labelProps={{ ...seldon.button1LabelProps, ...button1LabelProps }}
      />
    </Frame>
  )
}

const seldon: ButtonBarProps = {
  buttonProps: {},
  buttonIconProps: {
    icon: "__default__",
  },
  buttonLabelProps: {
    children: "Label",
    htmlElement: "span",
  },
  button1Props: {},
  button1IconProps: {
    icon: "__default__",
  },
  button1LabelProps: {
    children: "Label",
    htmlElement: "span",
  },
}
