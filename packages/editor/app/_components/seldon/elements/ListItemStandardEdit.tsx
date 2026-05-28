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
import { Input, InputProps } from "../primitives/Input"
import { Label, LabelProps } from "../primitives/Label"

export interface ListItemStandardEditProps
  extends LiHTMLAttributes<HTMLLIElement> {
  className?: string

  buttonIconicProps?: ButtonIconicProps
  buttonIconicIconProps?: IconProps
  frameProps?: FrameProps
  frameLabelProps?: LabelProps
  frame1Props?: FrameProps
  frame1IconProps?: IconProps
  frame1InputProps?: InputProps
  frame1ButtonIconicProps?: ButtonIconicProps
  frame1ButtonIconicIconProps?: IconProps
  buttonIconic1Props?: ButtonIconicProps
  buttonIconic1IconProps?: IconProps
  buttonIconic2Props?: ButtonIconicProps
  buttonIconic2IconProps?: IconProps
}

export function ListItemStandardEdit({
  className = "",
  buttonIconicProps,
  buttonIconicIconProps,
  frameProps,
  frameLabelProps,
  frame1Props,
  frame1IconProps,
  frame1InputProps,
  frame1ButtonIconicProps,
  frame1ButtonIconicIconProps,
  buttonIconic1Props,
  buttonIconic1IconProps,
  buttonIconic2Props,
  buttonIconic2IconProps,
  ...props
}: ListItemStandardEditProps) {
  return (
    <HTMLLi
      className={"variant-listItemStandard-XEeTOk " + className}
      {...props}
    >
      <ButtonIconic
        {...{ ...seldon.buttonIconicProps, ...buttonIconicProps }}
        className={
          "seldon-instance child-button-oiavxj " +
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
          "seldon-instance child-frame-FfCfAI " + (frameProps?.className ?? "")
        }
      >
        <Label
          {...{ ...seldon.frameLabelProps, ...frameLabelProps }}
          className={
            "seldon-instance child-label-TEakhH " +
            (frameLabelProps?.className ?? "")
          }
        />
      </Frame>
      <Frame
        {...{ ...seldon.frame1Props, ...frame1Props }}
        className={
          "seldon-instance child-frame-aKE63c " + (frame1Props?.className ?? "")
        }
      >
        <Icon
          {...{ ...seldon.frame1IconProps, ...frame1IconProps }}
          className={
            "seldon-instance child-icon-qXKRqF " +
            (frame1IconProps?.className ?? "")
          }
        />
        <Input
          {...{ ...seldon.frame1InputProps, ...frame1InputProps }}
          className={
            "seldon-instance child-input-XYi9dW " +
            (frame1InputProps?.className ?? "")
          }
        />
        <ButtonIconic
          {...{ ...seldon.frame1ButtonIconicProps, ...frame1ButtonIconicProps }}
          className={
            "seldon-instance child-button-4NZS9H " +
            (frame1ButtonIconicProps?.className ?? "")
          }
          iconProps={{
            ...seldon.frame1ButtonIconicIconProps,
            ...frame1ButtonIconicIconProps,
          }}
        />
      </Frame>
      <ButtonIconic
        {...{ ...seldon.buttonIconic1Props, ...buttonIconic1Props }}
        className={
          "seldon-instance child-button-zWLflE " +
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
          "seldon-instance child-button-WLsUaR " +
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

const seldon: ListItemStandardEditProps = {
  buttonIconicProps: {},
  buttonIconicIconProps: {
    icon: "material-chevronRight",
  },
  frameProps: {},
  frameLabelProps: {
    children: "Property Name",
    htmlElement: "span",
  },
  frame1Props: {},
  frame1IconProps: {
    icon: "seldon-imageFit",
  },
  frame1InputProps: {
    inputType: "text",
  },
  frame1ButtonIconicProps: {},
  frame1ButtonIconicIconProps: {
    icon: "material-upload",
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
