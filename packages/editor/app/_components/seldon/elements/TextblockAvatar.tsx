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
import { Frame } from "../frames/Frame"
import { Subtitle, SubtitleProps } from "../primitives/Subtitle"
import { Title, TitleProps } from "../primitives/Title"

export interface TextblockAvatarProps extends HTMLAttributes<HTMLElement> {
  className?: string

  titleProps?: TitleProps
  subtitleProps?: SubtitleProps
}

export function TextblockAvatar({
  className = "",
  titleProps,
  subtitleProps,
  ...props
}: TextblockAvatarProps) {
  return (
    <Frame
      className={"variant-textblockAvatar-default " + className}
      {...props}
    >
      <Title
        {...{ ...seldon.titleProps, ...titleProps }}
        className={
          "seldon-instance child-title-E0jw3q " + (titleProps?.className ?? "")
        }
      />
      <Subtitle
        {...{ ...seldon.subtitleProps, ...subtitleProps }}
        className={
          "seldon-instance child-subtitle-0koTWd " +
          (subtitleProps?.className ?? "")
        }
      />
    </Frame>
  )
}

const seldon: TextblockAvatarProps = {
  titleProps: {
    children: "Full Name",
    htmlElement: "h4",
  },
  subtitleProps: {
    children: "Personal details",
    htmlElement: "h5",
  },
}
