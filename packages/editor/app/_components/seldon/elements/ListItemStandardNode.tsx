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

export interface ListItemStandardNodeProps
  extends LiHTMLAttributes<HTMLLIElement> {
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

export function ListItemStandardNode({
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
}: ListItemStandardNodeProps) {
  return (
    <HTMLLi
      className={"variant-listItemStandard-owWjBq " + className}
      {...props}
    >
      <ButtonIconic
        {...{ ...seldon.buttonIconicProps, ...buttonIconicProps }}
        className={
          "seldon-instance child-button-7ZVT76 " +
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
          "seldon-instance child-frame-0OoWmv " + (frameProps?.className ?? "")
        }
      >
        <Icon
          {...{ ...seldon.frameIconProps, ...frameIconProps }}
          className={
            "seldon-instance child-icon-YYI2Nk " +
            (frameIconProps?.className ?? "")
          }
        />
        <Label
          {...{ ...seldon.frameLabelProps, ...frameLabelProps }}
          className={
            "seldon-instance child-label-nuq9vU " +
            (frameLabelProps?.className ?? "")
          }
        />
      </Frame>
      <ButtonIconic
        {...{ ...seldon.buttonIconic1Props, ...buttonIconic1Props }}
        className={
          "seldon-instance child-button-cqoFMF " +
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
          "seldon-instance child-button-Jncg6W " +
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

const seldon: ListItemStandardNodeProps = {
  buttonIconicProps: {},
  buttonIconicIconProps: {
    icon: "material-chevronRight",
  },
  frameProps: {},
  frameIconProps: {
    icon: "seldon-componentVariant",
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
