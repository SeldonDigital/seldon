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
import { AvatarIcon, AvatarIconProps } from "../elements/AvatarIcon"
import { TextblockTitleProps } from "../elements/TextblockTitle"
import { HTMLLi } from "../native-react/HTML.Li"
import { IconProps } from "../primitives/Icon"
import { SubtitleProps } from "../primitives/Subtitle"
import { TitleProps } from "../primitives/Title"

export interface ListItemGeneralSelectedProps
  extends HTMLAttributes<HTMLLIElement> {
  className?: string

  avatarIconProps?: AvatarIconProps
  avatarIconIconProps?: IconProps
  avatarIconTextblockTitleProps?: TextblockTitleProps
  avatarIconTextblockTitleTitleProps?: TitleProps
  avatarIconTextblockTitleSubtitleProps?: SubtitleProps
}

export function ListItemGeneralSelected({
  className = "",
  avatarIconProps,
  avatarIconIconProps,
  avatarIconTextblockTitleProps,
  avatarIconTextblockTitleTitleProps,
  avatarIconTextblockTitleSubtitleProps,
  ...props
}: ListItemGeneralSelectedProps) {
  return (
    <HTMLLi
      className={"variant-listItemGeneral-FXpEPh " + className}
      {...props}
    >
      <AvatarIcon
        {...{ ...seldon.avatarIconProps, ...avatarIconProps }}
        className={
          "seldon-instance child-avatarIcon-AwN5oo " +
          (avatarIconProps?.className ?? "")
        }
        iconProps={{ ...seldon.avatarIconIconProps, ...avatarIconIconProps }}
        textblockTitleProps={{
          ...seldon.avatarIconTextblockTitleProps,
          ...avatarIconTextblockTitleProps,
        }}
      />
    </HTMLLi>
  )
}

const seldon: ListItemGeneralSelectedProps = {
  avatarIconProps: {},
  avatarIconIconProps: {
    icon: "__default__",
  },
  avatarIconTextblockTitleProps: {},
  avatarIconTextblockTitleTitleProps: {
    children: "Title",
    htmlElement: "h4",
  },
  avatarIconTextblockTitleSubtitleProps: {
    children: "Subtitle",
    htmlElement: "h5",
  },
}
