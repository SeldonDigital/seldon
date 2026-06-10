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

export interface TextblockTitleProps extends HTMLAttributes<HTMLElement> {
  className?: string

  titleProps?: TitleProps
  subtitleProps?: SubtitleProps
}

export function TextblockTitle({
  className = "",
  titleProps,
  subtitleProps,
  ...props
}: TextblockTitleProps) {
  return (
    <Frame className={"variant-textblockTitle-default " + className} {...props}>
      <Title
        {...{ ...seldon.titleProps, ...titleProps }}
        className={
          "seldon-instance child-title-H-Z0cq " + (titleProps?.className ?? "")
        }
      />
      <Subtitle
        {...{ ...seldon.subtitleProps, ...subtitleProps }}
        className={
          "seldon-instance child-subtitle-OFAUqz " +
          (subtitleProps?.className ?? "")
        }
      />
    </Frame>
  )
}

const seldon: TextblockTitleProps = {
  titleProps: {
    children: "Title",
    htmlElement: "h4",
  },
  subtitleProps: {
    children: "Subtitle",
    htmlElement: "h5",
  },
}
