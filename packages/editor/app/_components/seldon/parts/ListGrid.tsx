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
import {
  AvatarIconSelected,
  AvatarIconSelectedProps,
} from "../elements/AvatarIconSelected"
import { TextblockTitleProps } from "../elements/TextblockTitle"
import { HTMLUl } from "../native-react/HTML.Ul"
import { IconProps } from "../primitives/Icon"
import { SubtitleProps } from "../primitives/Subtitle"
import { TitleProps } from "../primitives/Title"

export interface ListGridProps extends HTMLAttributes<HTMLUListElement> {
  className?: string

  avatarIconProps?: AvatarIconProps
  avatarIconIconProps?: IconProps
  avatarIconTextblockTitleProps?: TextblockTitleProps
  avatarIconTextblockTitleTitleProps?: TitleProps
  avatarIconTextblockTitleSubtitleProps?: SubtitleProps
  avatarIconSelected1Props?: AvatarIconSelectedProps
  avatarIconSelected1IconProps?: IconProps
  avatarIconSelected1TextblockTitleProps?: TextblockTitleProps
  avatarIconSelected1TextblockTitleTitleProps?: TitleProps
  avatarIconSelected1TextblockTitleSubtitleProps?: SubtitleProps
  avatarIcon2Props?: AvatarIconProps
  avatarIcon2IconProps?: IconProps
  avatarIcon2TextblockTitleProps?: TextblockTitleProps
  avatarIcon2TextblockTitleTitleProps?: TitleProps
  avatarIcon2TextblockTitleSubtitleProps?: SubtitleProps
  avatarIcon3Props?: AvatarIconProps
  avatarIcon3IconProps?: IconProps
  avatarIcon3TextblockTitleProps?: TextblockTitleProps
  avatarIcon3TextblockTitleTitleProps?: TitleProps
  avatarIcon3TextblockTitleSubtitleProps?: SubtitleProps
  avatarIcon4Props?: AvatarIconProps
  avatarIcon4IconProps?: IconProps
  avatarIcon4TextblockTitleProps?: TextblockTitleProps
  avatarIcon4TextblockTitleTitleProps?: TitleProps
  avatarIcon4TextblockTitleSubtitleProps?: SubtitleProps
  avatarIcon5Props?: AvatarIconProps
  avatarIcon5IconProps?: IconProps
  avatarIcon5TextblockTitleProps?: TextblockTitleProps
  avatarIcon5TextblockTitleTitleProps?: TitleProps
  avatarIcon5TextblockTitleSubtitleProps?: SubtitleProps
  avatarIcon6Props?: AvatarIconProps
  avatarIcon6IconProps?: IconProps
  avatarIcon6TextblockTitleProps?: TextblockTitleProps
  avatarIcon6TextblockTitleTitleProps?: TitleProps
  avatarIcon6TextblockTitleSubtitleProps?: SubtitleProps
}

export function ListGrid({
  className = "",
  avatarIconProps,
  avatarIconIconProps,
  avatarIconTextblockTitleProps,
  avatarIconTextblockTitleTitleProps,
  avatarIconTextblockTitleSubtitleProps,
  avatarIconSelected1Props,
  avatarIconSelected1IconProps,
  avatarIconSelected1TextblockTitleProps,
  avatarIconSelected1TextblockTitleTitleProps,
  avatarIconSelected1TextblockTitleSubtitleProps,
  avatarIcon2Props,
  avatarIcon2IconProps,
  avatarIcon2TextblockTitleProps,
  avatarIcon2TextblockTitleTitleProps,
  avatarIcon2TextblockTitleSubtitleProps,
  avatarIcon3Props,
  avatarIcon3IconProps,
  avatarIcon3TextblockTitleProps,
  avatarIcon3TextblockTitleTitleProps,
  avatarIcon3TextblockTitleSubtitleProps,
  avatarIcon4Props,
  avatarIcon4IconProps,
  avatarIcon4TextblockTitleProps,
  avatarIcon4TextblockTitleTitleProps,
  avatarIcon4TextblockTitleSubtitleProps,
  avatarIcon5Props,
  avatarIcon5IconProps,
  avatarIcon5TextblockTitleProps,
  avatarIcon5TextblockTitleTitleProps,
  avatarIcon5TextblockTitleSubtitleProps,
  avatarIcon6Props,
  avatarIcon6IconProps,
  avatarIcon6TextblockTitleProps,
  avatarIcon6TextblockTitleTitleProps,
  avatarIcon6TextblockTitleSubtitleProps,
  ...props
}: ListGridProps) {
  return (
    <HTMLUl className={"variant-listGrid-default " + className} {...props}>
      <AvatarIcon
        {...{ ...seldon.avatarIconProps, ...avatarIconProps }}
        className={
          "seldon-instance child-avatarIcon-PmpAT1 " +
          (avatarIconProps?.className ?? "")
        }
        iconProps={{ ...seldon.avatarIconIconProps, ...avatarIconIconProps }}
        textblockTitleProps={{
          ...seldon.avatarIconTextblockTitleProps,
          ...avatarIconTextblockTitleProps,
        }}
      />
      <AvatarIconSelected
        {...{ ...seldon.avatarIconSelected1Props, ...avatarIconSelected1Props }}
        className={
          "seldon-instance child-avatarIcon-uj0yAU " +
          (avatarIconSelected1Props?.className ?? "")
        }
        iconProps={{
          ...seldon.avatarIconSelected1IconProps,
          ...avatarIconSelected1IconProps,
        }}
        textblockTitleProps={{
          ...seldon.avatarIconSelected1TextblockTitleProps,
          ...avatarIconSelected1TextblockTitleProps,
        }}
      />
      <AvatarIcon
        {...{ ...seldon.avatarIcon2Props, ...avatarIcon2Props }}
        className={
          "seldon-instance child-avatarIcon-UJbAT2 " +
          (avatarIcon2Props?.className ?? "")
        }
        iconProps={{ ...seldon.avatarIcon2IconProps, ...avatarIcon2IconProps }}
        textblockTitleProps={{
          ...seldon.avatarIcon2TextblockTitleProps,
          ...avatarIcon2TextblockTitleProps,
        }}
      />
      <AvatarIcon
        {...{ ...seldon.avatarIcon3Props, ...avatarIcon3Props }}
        className={
          "seldon-instance child-avatarIcon-zbwONg " +
          (avatarIcon3Props?.className ?? "")
        }
        iconProps={{ ...seldon.avatarIcon3IconProps, ...avatarIcon3IconProps }}
        textblockTitleProps={{
          ...seldon.avatarIcon3TextblockTitleProps,
          ...avatarIcon3TextblockTitleProps,
        }}
      />
      <AvatarIcon
        {...{ ...seldon.avatarIcon4Props, ...avatarIcon4Props }}
        className={
          "seldon-instance child-avatarIcon-Fp8rTY " +
          (avatarIcon4Props?.className ?? "")
        }
        iconProps={{ ...seldon.avatarIcon4IconProps, ...avatarIcon4IconProps }}
        textblockTitleProps={{
          ...seldon.avatarIcon4TextblockTitleProps,
          ...avatarIcon4TextblockTitleProps,
        }}
      />
      <AvatarIcon
        {...{ ...seldon.avatarIcon5Props, ...avatarIcon5Props }}
        className={
          "seldon-instance child-avatarIcon-eTs2kW " +
          (avatarIcon5Props?.className ?? "")
        }
        iconProps={{ ...seldon.avatarIcon5IconProps, ...avatarIcon5IconProps }}
        textblockTitleProps={{
          ...seldon.avatarIcon5TextblockTitleProps,
          ...avatarIcon5TextblockTitleProps,
        }}
      />
      <AvatarIcon
        {...{ ...seldon.avatarIcon6Props, ...avatarIcon6Props }}
        className={
          "seldon-instance child-avatarIcon-dVqQhA " +
          (avatarIcon6Props?.className ?? "")
        }
        iconProps={{ ...seldon.avatarIcon6IconProps, ...avatarIcon6IconProps }}
        textblockTitleProps={{
          ...seldon.avatarIcon6TextblockTitleProps,
          ...avatarIcon6TextblockTitleProps,
        }}
      />
    </HTMLUl>
  )
}

const seldon: ListGridProps = {
  avatarIconProps: {},
  avatarIconIconProps: {
    icon: "__default__",
  },
  avatarIconTextblockTitleProps: {},
  avatarIconTextblockTitleTitleProps: {
    children: "Component",
    htmlElement: "h4",
  },
  avatarIconTextblockTitleSubtitleProps: {
    children: "Variant",
    htmlElement: "h5",
  },
  avatarIconSelected1Props: {},
  avatarIconSelected1IconProps: {
    icon: "__default__",
  },
  avatarIconSelected1TextblockTitleProps: {},
  avatarIconSelected1TextblockTitleTitleProps: {
    children: "Component",
    htmlElement: "h4",
  },
  avatarIconSelected1TextblockTitleSubtitleProps: {
    children: "Variant",
    htmlElement: "h5",
  },
  avatarIcon2Props: {},
  avatarIcon2IconProps: {
    icon: "__default__",
  },
  avatarIcon2TextblockTitleProps: {},
  avatarIcon2TextblockTitleTitleProps: {
    children: "Component",
    htmlElement: "h4",
  },
  avatarIcon2TextblockTitleSubtitleProps: {
    children: "Variant",
    htmlElement: "h5",
  },
  avatarIcon3Props: {},
  avatarIcon3IconProps: {
    icon: "__default__",
  },
  avatarIcon3TextblockTitleProps: {},
  avatarIcon3TextblockTitleTitleProps: {
    children: "Component",
    htmlElement: "h4",
  },
  avatarIcon3TextblockTitleSubtitleProps: {
    children: "Variant",
    htmlElement: "h5",
  },
  avatarIcon4Props: {},
  avatarIcon4IconProps: {
    icon: "__default__",
  },
  avatarIcon4TextblockTitleProps: {},
  avatarIcon4TextblockTitleTitleProps: {
    children: "Component",
    htmlElement: "h4",
  },
  avatarIcon4TextblockTitleSubtitleProps: {
    children: "Variant",
    htmlElement: "h5",
  },
  avatarIcon5Props: {},
  avatarIcon5IconProps: {
    icon: "__default__",
  },
  avatarIcon5TextblockTitleProps: {},
  avatarIcon5TextblockTitleTitleProps: {
    children: "Component",
    htmlElement: "h4",
  },
  avatarIcon5TextblockTitleSubtitleProps: {
    children: "Variant",
    htmlElement: "h5",
  },
  avatarIcon6Props: {},
  avatarIcon6IconProps: {
    icon: "__default__",
  },
  avatarIcon6TextblockTitleProps: {},
  avatarIcon6TextblockTitleTitleProps: {
    children: "Component",
    htmlElement: "h4",
  },
  avatarIcon6TextblockTitleSubtitleProps: {
    children: "Variant",
    htmlElement: "h5",
  },
}
