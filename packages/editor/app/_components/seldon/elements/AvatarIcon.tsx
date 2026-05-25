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
import { TextblockTitle, TextblockTitleProps } from "../elements/TextblockTitle"
import { Frame } from "../frames/Frame"
import { Icon, IconProps } from "../primitives/Icon"
import { SubtitleProps } from "../primitives/Subtitle"
import { TitleProps } from "../primitives/Title"

export interface AvatarIconProps extends HTMLAttributes<HTMLElement> {
  className?: string

  iconProps?: IconProps
  textblockTitleProps?: TextblockTitleProps
  textblockTitleTitleProps?: TitleProps
  textblockTitleSubtitleProps?: SubtitleProps
}

export function AvatarIcon({
  className = "",
  iconProps,
  textblockTitleProps,
  textblockTitleTitleProps,
  textblockTitleSubtitleProps,
  ...props
}: AvatarIconProps) {
  return (
    <Frame className={"variant-avatarIcon-default " + className} {...props}>
      <Icon
        {...{ ...seldon.iconProps, ...iconProps }}
        className={
          "seldon-instance child-icon-2cx8P5 " + (iconProps?.className ?? "")
        }
      />
      <TextblockTitle
        {...{ ...seldon.textblockTitleProps, ...textblockTitleProps }}
        className={
          "seldon-instance child-textblockTitle-CxS5EV " +
          (textblockTitleProps?.className ?? "")
        }
        titleProps={{
          ...seldon.textblockTitleTitleProps,
          ...textblockTitleTitleProps,
        }}
        subtitleProps={{
          ...seldon.textblockTitleSubtitleProps,
          ...textblockTitleSubtitleProps,
        }}
      />
    </Frame>
  )
}

const seldon: AvatarIconProps = {
  iconProps: {
    icon: "__default__",
  },
  textblockTitleProps: {},
  textblockTitleTitleProps: {
    children: "Component",
    htmlElement: "h4",
  },
  textblockTitleSubtitleProps: {
    children: "Variant",
    htmlElement: "h5",
  },
}
