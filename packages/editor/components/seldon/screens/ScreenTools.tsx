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
import { BarToolsSeldon, BarToolsSeldonProps } from "../elements/BarToolsSeldon"
import { ButtonToolProps } from "../elements/ButtonTool"
import { HTMLDiv } from "../native-react/HTML.Div"
import { IconProps } from "../primitives/Icon"

export interface ScreenToolsProps extends HTMLAttributes<HTMLDivElement> {
  className?: string

  barToolsSeldonProps?: BarToolsSeldonProps
  barToolsSeldonButtonToolProps?: ButtonToolProps
  barToolsSeldonButtonToolIconProps?: IconProps
  barToolsSeldonButtonTool1Props?: ButtonToolProps
  barToolsSeldonButtonTool1IconProps?: IconProps
  barToolsSeldonButtonTool2Props?: ButtonToolProps
  barToolsSeldonButtonTool2IconProps?: IconProps
}

export function ScreenTools({
  className = "",
  barToolsSeldonProps,
  barToolsSeldonButtonToolProps,
  barToolsSeldonButtonToolIconProps,
  barToolsSeldonButtonTool1Props,
  barToolsSeldonButtonTool1IconProps,
  barToolsSeldonButtonTool2Props,
  barToolsSeldonButtonTool2IconProps,
  ...props
}: ScreenToolsProps) {
  return (
    <HTMLDiv className={"variant-screen-sinFe7 " + className} {...props}>
      <BarToolsSeldon
        {...{ ...seldon.barToolsSeldonProps, ...barToolsSeldonProps }}
        className={
          "seldon-instance child-barTools-l-0q6Y " +
          (barToolsSeldonProps?.className ?? "")
        }
        buttonToolProps={{
          ...seldon.barToolsSeldonButtonToolProps,
          ...barToolsSeldonButtonToolProps,
        }}
        buttonTool1Props={{
          ...seldon.barToolsSeldonButtonTool1Props,
          ...barToolsSeldonButtonTool1Props,
        }}
        buttonTool2Props={{
          ...seldon.barToolsSeldonButtonTool2Props,
          ...barToolsSeldonButtonTool2Props,
        }}
      />
    </HTMLDiv>
  )
}

const seldon: ScreenToolsProps = {
  barToolsSeldonProps: {},
  barToolsSeldonButtonToolProps: {},
  barToolsSeldonButtonToolIconProps: {
    icon: "seldon-toolArrow",
  },
  barToolsSeldonButtonTool1Props: {},
  barToolsSeldonButtonTool1IconProps: {
    icon: "seldon-toolArrow",
  },
  barToolsSeldonButtonTool2Props: {},
  barToolsSeldonButtonTool2IconProps: {
    icon: "seldon-toolComponent",
  },
}
