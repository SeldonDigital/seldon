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
import {
  TextblockAvatar,
  TextblockAvatarProps,
} from "../elements/TextblockAvatar"
import { Frame } from "../frames/Frame"
import { Image, ImageProps } from "../primitives/Image"
import { SubtitleProps } from "../primitives/Subtitle"
import { TitleProps } from "../primitives/Title"

export interface AvatarProps extends HTMLAttributes<HTMLElement> {
  className?: string

  imageProps?: ImageProps
  textblockAvatarProps?: TextblockAvatarProps
  textblockAvatarTitleProps?: TitleProps
  textblockAvatarSubtitleProps?: SubtitleProps
}

export function Avatar({
  className = "",
  imageProps,
  textblockAvatarProps,
  textblockAvatarTitleProps,
  textblockAvatarSubtitleProps,
  ...props
}: AvatarProps) {
  return (
    <Frame className={"variant-avatar-default " + className} {...props}>
      <Image
        {...{ ...seldon.imageProps, ...imageProps }}
        className={
          "seldon-instance child-image-uQuiFK " + (imageProps?.className ?? "")
        }
      />
      <TextblockAvatar
        {...{ ...seldon.textblockAvatarProps, ...textblockAvatarProps }}
        className={
          "seldon-instance child-textblockAvatar-guOhVA " +
          (textblockAvatarProps?.className ?? "")
        }
        titleProps={{
          ...seldon.textblockAvatarTitleProps,
          ...textblockAvatarTitleProps,
        }}
        subtitleProps={{
          ...seldon.textblockAvatarSubtitleProps,
          ...textblockAvatarSubtitleProps,
        }}
      />
    </Frame>
  )
}

const seldon: AvatarProps = {
  imageProps: {
    src: "https://static.seldon.app/avatar-user.jpg",
  },
  textblockAvatarProps: {},
  textblockAvatarTitleProps: {
    children: "Full Name",
    htmlElement: "h4",
  },
  textblockAvatarSubtitleProps: {
    children: "Personal details",
    htmlElement: "h5",
  },
}
