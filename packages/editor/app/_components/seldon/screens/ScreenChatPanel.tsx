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
import { AvatarChat, AvatarChatProps } from "../elements/AvatarChat"
import { ButtonIconic, ButtonIconicProps } from "../elements/ButtonIconic"
import { ButtonText, ButtonTextProps } from "../elements/ButtonText"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { IconProps } from "../primitives/Icon"
import { ImageProps } from "../primitives/Image"
import { LabelProps } from "../primitives/Label"
import { TaglineProps } from "../primitives/Tagline"

export interface ScreenChatPanelProps extends HTMLAttributes<HTMLDivElement> {
  className?: string

  frameProps?: FrameProps
  frameAvatarChatProps?: AvatarChatProps
  frameAvatarChatImageProps?: ImageProps
  frameAvatarChatFrameProps?: FrameProps
  frameAvatarChatFrameLabelProps?: LabelProps
  frameAvatarChatFrameTaglineProps?: TaglineProps
  frame1Props?: FrameProps
  frame1ButtonIconicProps?: ButtonIconicProps
  frame1ButtonIconicIconProps?: IconProps
  frame1ButtonIconic1Props?: ButtonIconicProps
  frame1ButtonIconic1IconProps?: IconProps
  frame1ButtonText2Props?: ButtonTextProps
  frame1ButtonText2LabelProps?: LabelProps
}

export function ScreenChatPanel({
  className = "",
  frameProps,
  frameAvatarChatProps,
  frameAvatarChatImageProps,
  frameAvatarChatFrameProps,
  frameAvatarChatFrameLabelProps,
  frameAvatarChatFrameTaglineProps,
  frame1Props,
  frame1ButtonIconicProps,
  frame1ButtonIconicIconProps,
  frame1ButtonIconic1Props,
  frame1ButtonIconic1IconProps,
  frame1ButtonText2Props,
  frame1ButtonText2LabelProps,
  ...props
}: ScreenChatPanelProps) {
  return (
    <HTMLDiv className={"variant-screen-0AbQw8 " + className} {...props}>
      <Frame
        {...{ ...seldon.frameProps, ...frameProps }}
        className={
          "seldon-instance child-frame-mVjGz_ " + (frameProps?.className ?? "")
        }
      >
        <AvatarChat
          {...{ ...seldon.frameAvatarChatProps, ...frameAvatarChatProps }}
          className={
            "seldon-instance child-avatar-wtoDG0 " +
            (frameAvatarChatProps?.className ?? "")
          }
          imageProps={{
            ...seldon.frameAvatarChatImageProps,
            ...frameAvatarChatImageProps,
          }}
          frameProps={{
            ...seldon.frameAvatarChatFrameProps,
            ...frameAvatarChatFrameProps,
          }}
        />
      </Frame>
      <Frame
        {...{ ...seldon.frame1Props, ...frame1Props }}
        className={
          "seldon-instance child-frame-cegn59 " + (frame1Props?.className ?? "")
        }
      >
        <ButtonIconic
          {...{ ...seldon.frame1ButtonIconicProps, ...frame1ButtonIconicProps }}
          className={
            "seldon-instance child-button-jGis9E " +
            (frame1ButtonIconicProps?.className ?? "")
          }
          iconProps={{
            ...seldon.frame1ButtonIconicIconProps,
            ...frame1ButtonIconicIconProps,
          }}
        />
        <ButtonIconic
          {...{
            ...seldon.frame1ButtonIconic1Props,
            ...frame1ButtonIconic1Props,
          }}
          className={
            "seldon-instance child-button-iRHRL7 " +
            (frame1ButtonIconic1Props?.className ?? "")
          }
          iconProps={{
            ...seldon.frame1ButtonIconic1IconProps,
            ...frame1ButtonIconic1IconProps,
          }}
        />
        <ButtonText
          {...{ ...seldon.frame1ButtonText2Props, ...frame1ButtonText2Props }}
          className={
            "seldon-instance child-button-SKWRNC " +
            (frame1ButtonText2Props?.className ?? "")
          }
          labelProps={{
            ...seldon.frame1ButtonText2LabelProps,
            ...frame1ButtonText2LabelProps,
          }}
        />
      </Frame>
    </HTMLDiv>
  )
}

const seldon: ScreenChatPanelProps = {
  frameProps: {},
  frameAvatarChatProps: {},
  frameAvatarChatImageProps: {
    src: "https://static.seldon.app/avatar-user.jpg",
  },
  frameAvatarChatFrameProps: {},
  frameAvatarChatFrameLabelProps: {
    children: "Andrei Herasimchuk",
    htmlElement: "span",
  },
  frameAvatarChatFrameTaglineProps: {
    children: "Seldon Digital",
    htmlElement: "p",
  },
  frame1Props: {},
  frame1ButtonIconicProps: {},
  frame1ButtonIconicIconProps: {
    icon: "material-thumbDown",
  },
  frame1ButtonIconic1Props: {},
  frame1ButtonIconic1IconProps: {
    icon: "material-thumbP",
  },
  frame1ButtonText2Props: {},
  frame1ButtonText2LabelProps: {
    children: "Report",
    htmlElement: "span",
  },
}
