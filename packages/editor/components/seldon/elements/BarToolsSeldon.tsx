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
import { ButtonTool, ButtonToolProps } from "../elements/ButtonTool"
import { Frame } from "../frames/Frame"
import { IconProps } from "../primitives/Icon"

export interface BarToolsSeldonProps extends HTMLAttributes<HTMLElement> {
  className?: string

  buttonToolProps?: ButtonToolProps
  buttonToolIconProps?: IconProps
  buttonTool1Props?: ButtonToolProps
  buttonTool1IconProps?: IconProps
  buttonTool2Props?: ButtonToolProps
  buttonTool2IconProps?: IconProps
}

export function BarToolsSeldon({
  className = "",
  buttonToolProps,
  buttonToolIconProps,
  buttonTool1Props,
  buttonTool1IconProps,
  buttonTool2Props,
  buttonTool2IconProps,
  ...props
}: BarToolsSeldonProps) {
  return (
    <Frame className={"variant-barTools-xcVb8_ " + className} {...props}>
      <ButtonTool
        {...{ ...seldon.buttonToolProps, ...buttonToolProps }}
        className={
          "seldon-instance child-button-gSoiTW " +
          (buttonToolProps?.className ?? "")
        }
        iconProps={{ ...seldon.buttonToolIconProps, ...buttonToolIconProps }}
      />
      <ButtonTool
        {...{ ...seldon.buttonTool1Props, ...buttonTool1Props }}
        className={
          "seldon-instance child-button-kMzFGH " +
          (buttonTool1Props?.className ?? "")
        }
        iconProps={{ ...seldon.buttonTool1IconProps, ...buttonTool1IconProps }}
      />
      <ButtonTool
        {...{ ...seldon.buttonTool2Props, ...buttonTool2Props }}
        className={
          "seldon-instance child-button-3nzeUM " +
          (buttonTool2Props?.className ?? "")
        }
        iconProps={{ ...seldon.buttonTool2IconProps, ...buttonTool2IconProps }}
      />
    </Frame>
  )
}

const seldon: BarToolsSeldonProps = {
  buttonToolProps: {},
  buttonToolIconProps: {
    icon: "seldon-toolArrow",
  },
  buttonTool1Props: {},
  buttonTool1IconProps: {
    icon: "seldon-toolSketch",
  },
  buttonTool2Props: {},
  buttonTool2IconProps: {
    icon: "seldon-toolComponent",
  },
}
