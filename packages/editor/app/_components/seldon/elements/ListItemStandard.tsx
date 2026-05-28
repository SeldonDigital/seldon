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
import { LiHTMLAttributes } from "react"
import { ButtonIconic, ButtonIconicProps } from "../elements/ButtonIconic"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLLi } from "../native-react/HTML.Li"
import { Icon, IconProps } from "../primitives/Icon"
import { Label, LabelProps } from "../primitives/Label"

export interface ListItemStandardProps extends LiHTMLAttributes<HTMLLIElement> {
  className?: string

  buttonIconicProps?: ButtonIconicProps
  buttonIconicIconProps?: IconProps
  frameProps?: FrameProps
  frameIconProps?: IconProps
  frameLabelProps?: LabelProps
  buttonIconic1Props?: ButtonIconicProps
  buttonIconic1IconProps?: IconProps
  buttonIconic2Props?: ButtonIconicProps
  buttonIconic2IconProps?: IconProps
}

export function ListItemStandard({
  className = "",
  buttonIconicProps,
  buttonIconicIconProps,
  frameProps,
  frameIconProps,
  frameLabelProps,
  buttonIconic1Props,
  buttonIconic1IconProps,
  buttonIconic2Props,
  buttonIconic2IconProps,
  ...props
}: ListItemStandardProps) {
  return (
    <HTMLLi
      className={"variant-listItemStandard-default " + className}
      {...props}
    >
      <ButtonIconic
        {...{ ...seldon.buttonIconicProps, ...buttonIconicProps }}
        className={
          "seldon-instance child-button-r6TiUi " +
          (buttonIconicProps?.className ?? "")
        }
        iconProps={{
          ...seldon.buttonIconicIconProps,
          ...buttonIconicIconProps,
        }}
      />
      <Frame
        {...{ ...seldon.frameProps, ...frameProps }}
        className={
          "seldon-instance child-frame-fZmigF " + (frameProps?.className ?? "")
        }
      >
        <Icon
          {...{ ...seldon.frameIconProps, ...frameIconProps }}
          className={
            "seldon-instance child-icon-R1OoX4 " +
            (frameIconProps?.className ?? "")
          }
        />
        <Label
          {...{ ...seldon.frameLabelProps, ...frameLabelProps }}
          className={
            "seldon-instance child-label-3h9hF6 " +
            (frameLabelProps?.className ?? "")
          }
        />
      </Frame>
      <ButtonIconic
        {...{ ...seldon.buttonIconic1Props, ...buttonIconic1Props }}
        className={
          "seldon-instance child-button-0fj4Vj " +
          (buttonIconic1Props?.className ?? "")
        }
        iconProps={{
          ...seldon.buttonIconic1IconProps,
          ...buttonIconic1IconProps,
        }}
      />
      <ButtonIconic
        {...{ ...seldon.buttonIconic2Props, ...buttonIconic2Props }}
        className={
          "seldon-instance child-button-dc2WfF " +
          (buttonIconic2Props?.className ?? "")
        }
        iconProps={{
          ...seldon.buttonIconic2IconProps,
          ...buttonIconic2IconProps,
        }}
      />
    </HTMLLi>
  )
}

const seldon: ListItemStandardProps = {
  buttonIconicProps: {},
  buttonIconicIconProps: {
    icon: "material-chevronRight",
  },
  frameProps: {},
  frameIconProps: {
    icon: "seldon-component",
  },
  frameLabelProps: {
    children: "Component Name",
    htmlElement: "span",
  },
  buttonIconic1Props: {},
  buttonIconic1IconProps: {
    icon: "seldon-reset",
  },
  buttonIconic2Props: {},
  buttonIconic2IconProps: {
    icon: "material-delete",
  },
}
