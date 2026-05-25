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

export interface AvatarIconSelectedProps extends HTMLAttributes<HTMLElement> {
  className?: string

  iconProps?: IconProps
  textblockTitleProps?: TextblockTitleProps
  textblockTitleTitleProps?: TitleProps
  textblockTitleSubtitleProps?: SubtitleProps
}

export function AvatarIconSelected({
  className = "",
  iconProps,
  textblockTitleProps,
  textblockTitleTitleProps,
  textblockTitleSubtitleProps,
  ...props
}: AvatarIconSelectedProps) {
  return (
    <Frame className={"variant-avatarIcon-RAKw9p " + className} {...props}>
      <Icon
        {...{ ...seldon.iconProps, ...iconProps }}
        className={
          "seldon-instance child-icon-RCda9T " + (iconProps?.className ?? "")
        }
      />
      <TextblockTitle
        {...{ ...seldon.textblockTitleProps, ...textblockTitleProps }}
        className={
          "seldon-instance child-textblockTitle-z9YuUQ " +
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

const seldon: AvatarIconSelectedProps = {
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
