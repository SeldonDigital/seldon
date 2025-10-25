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
import { ButtonProps } from "../elements/Button"
import {
  ButtonBarPrimary,
  ButtonBarPrimaryProps,
} from "../elements/ButtonBarPrimary"
import { ButtonIconicProps } from "../elements/ButtonIconic"
import { ButtonPrimaryProps } from "../elements/ButtonPrimary"
import {
  HeaderPanelsClose,
  HeaderPanelsCloseProps,
} from "../elements/HeaderPanelsClose"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { IconProps } from "../primitives/Icon"
import { LabelProps } from "../primitives/Label"
import { TitleProps } from "../primitives/Title"

export interface PanelDialogProps extends HTMLAttributes<HTMLDivElement> {
  className?: string

  headerPanelsCloseProps?: HeaderPanelsCloseProps
  headerPanelsCloseTitleProps?: TitleProps
  headerPanelsCloseButtonIconicProps?: ButtonIconicProps
  headerPanelsCloseButtonIconicIconProps?: IconProps
  frameProps?: FrameProps
  buttonBarPrimaryProps?: ButtonBarPrimaryProps
  buttonBarPrimaryButtonProps?: ButtonProps
  buttonBarPrimaryButtonIconProps?: IconProps
  buttonBarPrimaryButtonLabelProps?: LabelProps
  buttonBarPrimaryButtonPrimary1Props?: ButtonPrimaryProps
  buttonBarPrimaryButtonPrimary1IconProps?: IconProps
  buttonBarPrimaryButtonPrimary1LabelProps?: LabelProps
}

export function PanelDialog({
  className = "",
  headerPanelsCloseProps,
  headerPanelsCloseTitleProps,
  headerPanelsCloseButtonIconicProps,
  headerPanelsCloseButtonIconicIconProps,
  frameProps,
  buttonBarPrimaryProps,
  buttonBarPrimaryButtonProps,
  buttonBarPrimaryButtonIconProps,
  buttonBarPrimaryButtonLabelProps,
  buttonBarPrimaryButtonPrimary1Props,
  buttonBarPrimaryButtonPrimary1IconProps,
  buttonBarPrimaryButtonPrimary1LabelProps,
  ...props
}: PanelDialogProps) {
  return (
    <HTMLDiv className={"variant-panelDialog-default " + className} {...props}>
      <HeaderPanelsClose
        {...{ ...seldon.headerPanelsCloseProps, ...headerPanelsCloseProps }}
        className={
          "seldon-instance child-headerPanels-UQ4iun " +
          (headerPanelsCloseProps?.className ?? "")
        }
        titleProps={{
          ...seldon.headerPanelsCloseTitleProps,
          ...headerPanelsCloseTitleProps,
        }}
        buttonIconicProps={{
          ...seldon.headerPanelsCloseButtonIconicProps,
          ...headerPanelsCloseButtonIconicProps,
        }}
      />
      <Frame
        {...{ ...seldon.frameProps, ...frameProps }}
        className={
          "seldon-instance child-frame-qdIdbg " + (frameProps?.className ?? "")
        }
      ></Frame>
      <ButtonBarPrimary
        {...{ ...seldon.buttonBarPrimaryProps, ...buttonBarPrimaryProps }}
        className={
          "seldon-instance child-buttonBar-ZpSJA- " +
          (buttonBarPrimaryProps?.className ?? "")
        }
        buttonProps={{
          ...seldon.buttonBarPrimaryButtonProps,
          ...buttonBarPrimaryButtonProps,
        }}
        buttonPrimary1Props={{
          ...seldon.buttonBarPrimaryButtonPrimary1Props,
          ...buttonBarPrimaryButtonPrimary1Props,
        }}
      />
    </HTMLDiv>
  )
}

const seldon: PanelDialogProps = {
  headerPanelsCloseProps: {},
  headerPanelsCloseTitleProps: {
    children: "Title",
    htmlElement: "h4",
  },
  headerPanelsCloseButtonIconicProps: {},
  headerPanelsCloseButtonIconicIconProps: {
    icon: "material-close",
  },
  frameProps: {},
  buttonBarPrimaryProps: {},
  buttonBarPrimaryButtonProps: {},
  buttonBarPrimaryButtonIconProps: {
    icon: "__default__",
  },
  buttonBarPrimaryButtonLabelProps: {
    children: "Label",
    htmlElement: "span",
  },
  buttonBarPrimaryButtonPrimary1Props: {},
  buttonBarPrimaryButtonPrimary1IconProps: {
    icon: "__default__",
  },
  buttonBarPrimaryButtonPrimary1LabelProps: {
    children: "Label",
    htmlElement: "span",
  },
}
