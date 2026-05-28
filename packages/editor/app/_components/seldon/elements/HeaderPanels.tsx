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
import { Title, TitleProps } from "../primitives/Title"

export interface HeaderPanelsProps extends HTMLAttributes<HTMLElement> {
  className?: string

  titleProps?: TitleProps
  buttonProps?: ButtonProps
  buttonIconProps?: IconProps
  buttonLabelProps?: LabelProps
}

export function HeaderPanels({
  className = "",
  titleProps,
  buttonProps,
  buttonIconProps,
  buttonLabelProps,
  ...props
}: HeaderPanelsProps) {
  return (
    <Frame className={"variant-headerPanels-default " + className} {...props}>
      <Title
        {...{ ...seldon.titleProps, ...titleProps }}
        className={
          "seldon-instance child-title-TE6bVd " + (titleProps?.className ?? "")
        }
      />
      <Button
        {...{ ...seldon.buttonProps, ...buttonProps }}
        className={
          "seldon-instance child-button-gx1ETZ " +
          (buttonProps?.className ?? "")
        }
        iconProps={{ ...seldon.buttonIconProps, ...buttonIconProps }}
        labelProps={{ ...seldon.buttonLabelProps, ...buttonLabelProps }}
      />
    </Frame>
  )
}

const seldon: HeaderPanelsProps = {
  titleProps: {
    children: "Title",
    htmlElement: "h4",
  },
  buttonProps: {},
  buttonIconProps: {
    icon: "__default__",
  },
  buttonLabelProps: {
    children: "Label",
    htmlElement: "span",
  },
}
