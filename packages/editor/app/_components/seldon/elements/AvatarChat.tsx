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
import { Frame, FrameProps } from "../frames/Frame"
import { Image, ImageProps } from "../primitives/Image"
import { Label, LabelProps } from "../primitives/Label"
import { Tagline, TaglineProps } from "../primitives/Tagline"

export interface AvatarChatProps extends HTMLAttributes<HTMLElement> {
  className?: string

  imageProps?: ImageProps
  frameProps?: FrameProps
  frameLabelProps?: LabelProps
  frameTaglineProps?: TaglineProps
}

export function AvatarChat({
  className = "",
  imageProps,
  frameProps,
  frameLabelProps,
  frameTaglineProps,
  ...props
}: AvatarChatProps) {
  return (
    <Frame className={"variant-avatar-ZBRoSt " + className} {...props}>
      <Image
        {...{ ...seldon.imageProps, ...imageProps }}
        className={
          "seldon-instance child-image-8ANYvw " + (imageProps?.className ?? "")
        }
      />
      <Frame
        {...{ ...seldon.frameProps, ...frameProps }}
        className={
          "seldon-instance child-frame-l-rG6X " + (frameProps?.className ?? "")
        }
      >
        <Label
          {...{ ...seldon.frameLabelProps, ...frameLabelProps }}
          className={
            "seldon-instance child-label-OE53zR " +
            (frameLabelProps?.className ?? "")
          }
        />
        <Tagline
          {...{ ...seldon.frameTaglineProps, ...frameTaglineProps }}
          className={
            "seldon-instance child-tagline-c5tB93 " +
            (frameTaglineProps?.className ?? "")
          }
        />
      </Frame>
    </Frame>
  )
}

const seldon: AvatarChatProps = {
  imageProps: {
    src: "https://static.seldon.app/avatar-user.jpg",
  },
  frameProps: {},
  frameLabelProps: {
    children: "Andrei Herasimchuk",
    htmlElement: "span",
  },
  frameTaglineProps: {
    children: "Seldon Digital",
    htmlElement: "p",
  },
}
