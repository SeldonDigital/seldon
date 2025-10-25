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
import { IconProps } from "../primitives/Icon"
import { Label, LabelProps } from "../primitives/Label"

export interface ListItemStandardSectionProps
  extends LiHTMLAttributes<HTMLLIElement> {
  className?: string

  buttonIconicProps?: ButtonIconicProps
  buttonIconicIconProps?: IconProps
  frameProps?: FrameProps
  frameLabelProps?: LabelProps
  buttonIconic1Props?: ButtonIconicProps
  buttonIconic1IconProps?: IconProps
}

export function ListItemStandardSection({
  className = "",
  buttonIconicProps,
  buttonIconicIconProps,
  frameProps,
  frameLabelProps,
  buttonIconic1Props,
  buttonIconic1IconProps,
  ...props
}: ListItemStandardSectionProps) {
  return (
    <HTMLLi
      className={"variant-listItemStandard-E9Xs6J " + className}
      {...props}
    >
      <ButtonIconic
        {...{ ...seldon.buttonIconicProps, ...buttonIconicProps }}
        className={
          "seldon-instance child-button-7VYDO2 " +
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
          "seldon-instance child-frame-6ZJ09y " + (frameProps?.className ?? "")
        }
      >
        <Label
          {...{ ...seldon.frameLabelProps, ...frameLabelProps }}
          className={
            "seldon-instance child-label-IxJ7nu " +
            (frameLabelProps?.className ?? "")
          }
        />
      </Frame>
      <ButtonIconic
        {...{ ...seldon.buttonIconic1Props, ...buttonIconic1Props }}
        className={
          "seldon-instance child-button-essFyW " +
          (buttonIconic1Props?.className ?? "")
        }
        iconProps={{
          ...seldon.buttonIconic1IconProps,
          ...buttonIconic1IconProps,
        }}
      />
    </HTMLLi>
  )
}

const seldon: ListItemStandardSectionProps = {
  buttonIconicProps: {},
  buttonIconicIconProps: {
    icon: "seldon-icon",
  },
  frameProps: {},
  frameLabelProps: {
    children: "Section Name",
    htmlElement: "span",
  },
  buttonIconic1Props: {},
  buttonIconic1IconProps: {
    icon: "material-unfoldLess",
  },
}
