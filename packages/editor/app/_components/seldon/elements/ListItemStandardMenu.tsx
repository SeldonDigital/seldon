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
import { Select, SelectProps } from "../elements/Select"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLLi } from "../native-react/HTML.Li"
import { Icon, IconProps } from "../primitives/Icon"
import { Label, LabelProps } from "../primitives/Label"
import { OptionProps } from "../primitives/Option"

export interface ListItemStandardMenuProps
  extends LiHTMLAttributes<HTMLLIElement> {
  className?: string

  buttonIconicProps?: ButtonIconicProps
  buttonIconicIconProps?: IconProps
  frameProps?: FrameProps
  frameLabelProps?: LabelProps
  frame1Props?: FrameProps
  frame1IconProps?: IconProps
  frame1SelectProps?: SelectProps
  frame1SelectOptionProps?: OptionProps
  frame1SelectOption1Props?: OptionProps
  frame1SelectOption2Props?: OptionProps
  buttonIconic1Props?: ButtonIconicProps
  buttonIconic1IconProps?: IconProps
  buttonIconic2Props?: ButtonIconicProps
  buttonIconic2IconProps?: IconProps
}

export function ListItemStandardMenu({
  className = "",
  buttonIconicProps,
  buttonIconicIconProps,
  frameProps,
  frameLabelProps,
  frame1Props,
  frame1IconProps,
  frame1SelectProps,
  frame1SelectOptionProps,
  frame1SelectOption1Props,
  frame1SelectOption2Props,
  buttonIconic1Props,
  buttonIconic1IconProps,
  buttonIconic2Props,
  buttonIconic2IconProps,
  ...props
}: ListItemStandardMenuProps) {
  return (
    <HTMLLi
      className={"variant-listItemStandard-05QiYe " + className}
      {...props}
    >
      <ButtonIconic
        {...{ ...seldon.buttonIconicProps, ...buttonIconicProps }}
        className={
          "seldon-instance child-button-dX4-D1 " +
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
          "seldon-instance child-frame-lAwps7 " + (frameProps?.className ?? "")
        }
      >
        <Label
          {...{ ...seldon.frameLabelProps, ...frameLabelProps }}
          className={
            "seldon-instance child-label-op4p6x " +
            (frameLabelProps?.className ?? "")
          }
        />
      </Frame>
      <Frame
        {...{ ...seldon.frame1Props, ...frame1Props }}
        className={
          "seldon-instance child-frame-alGtOu " + (frame1Props?.className ?? "")
        }
      >
        <Icon
          {...{ ...seldon.frame1IconProps, ...frame1IconProps }}
          className={
            "seldon-instance child-icon-2Vcdjq " +
            (frame1IconProps?.className ?? "")
          }
        />
        <Select
          {...{ ...seldon.frame1SelectProps, ...frame1SelectProps }}
          className={
            "seldon-instance child-select-5AdPs_ " +
            (frame1SelectProps?.className ?? "")
          }
          optionProps={{
            ...seldon.frame1SelectOptionProps,
            ...frame1SelectOptionProps,
          }}
          option1Props={{
            ...seldon.frame1SelectOption1Props,
            ...frame1SelectOption1Props,
          }}
          option2Props={{
            ...seldon.frame1SelectOption2Props,
            ...frame1SelectOption2Props,
          }}
        />
      </Frame>
      <ButtonIconic
        {...{ ...seldon.buttonIconic1Props, ...buttonIconic1Props }}
        className={
          "seldon-instance child-button-bwqtQT " +
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
          "seldon-instance child-button--ecXvo " +
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

const seldon: ListItemStandardMenuProps = {
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
    icon: "seldon-swatch",
  },
  frame1SelectProps: {},
  frame1SelectOptionProps: {
    children: "Option 01",
  },
  frame1SelectOption1Props: {
    children: "Option 02",
  },
  frame1SelectOption2Props: {
    children: "Option 03",
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
