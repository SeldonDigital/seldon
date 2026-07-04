/*****
 *
 * This code was generated using Seldon (https://github.com/SeldonDigital/seldon)
 *
 * License: https://github.com/SeldonDigital/seldon/blob/main/LICENSE.md
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it, in whole or in part,
 * for the purposes of training, fine-tuning, or otherwise improving (directly or indirectly)
 * any machine learning or artificial intelligence system without written permission.
 *
 *****/
import { HTMLAttributes } from "react"
import { Avatar, AvatarProps } from "../elements/Avatar"
import { Button, ButtonProps } from "../elements/Button"
import { Frame, FrameProps } from "../frames/Frame"
import { Icon, IconProps } from "../primitives/Icon"
import { Image, ImageProps } from "../primitives/Image"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface MediaCardProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  image?: ImageProps | null
  frame?: FrameProps | null
  textTitle?: TextTitleProps | null
  frame2?: FrameProps | null
  avatar?: AvatarProps | null
  image2?: ImageProps | null
  frame3?: FrameProps | null
  textLabel?: TextLabelProps | null
  textLabel2?: TextLabelProps | null
  button?: ButtonProps | null
  icon?: IconProps | null
  textLabel3?: TextLabelProps | null
}

/*****
 * Media Card: MediaCard
 * Level: Part
 * Intent: Visual-first media card where the thumbnail dominates, supported by a title, creator, metrics, and a play action.
 * Tags: card, media, video, thumbnail, creator, play, streaming, UI
 * Type: Inline
 *
 * @example
 * ```tsx
 * <MediaCard
 *   aria-hidden="false"
 *   image="/image.jpg"
 *   frame="{}"
 *   textTitle="Product Title"
 *   avatar="/image.jpg"
 *   textLabel="{}"
 *   textLabel2="{}"
 *   button={() => {}}
 *   icon="material-star"
 * />
 * ```
 *****/
export function MediaCard({
  className = "",
  image = sdn.image,
  frame = sdn.frame,
  textTitle,
  frame2 = sdn.frame2,
  avatar,
  image2 = sdn.image2,
  frame3 = sdn.frame3,
  textLabel,
  textLabel2,
  button,
  icon = sdn.icon,
  textLabel3,
  children,
  seldonRefs,
  ...props
}: MediaCardProps) {
  const mediaCardClassName = combineClassNames("sdn-media-card", className)
  const imageProps = applyRef(
    seldonRefs,
    image === null
      ? null
      : {
          ...sdn.image,
          ...image,
          className: combineClassNames(sdn.image?.className, image?.className),
        },
  )
  const frameProps = applyRef(
    seldonRefs,
    frame === null
      ? null
      : {
          ...sdn.frame,
          ...frame,
          className: combineClassNames(sdn.frame?.className, frame?.className),
        },
  )
  const textTitleProps = applyRef(
    seldonRefs,
    textTitle === null
      ? null
      : {
          ...sdn.textTitle,
          ...textTitle,
          className: combineClassNames(
            sdn.textTitle?.className,
            textTitle?.className,
          ),
        },
  )
  const frame2Props = applyRef(
    seldonRefs,
    frame2 === null
      ? null
      : {
          ...sdn.frame2,
          ...frame2,
          className: combineClassNames(
            sdn.frame2?.className,
            frame2?.className,
          ),
        },
  )
  const avatarProps = applyRef(
    seldonRefs,
    avatar === null
      ? null
      : {
          ...sdn.avatar,
          ...avatar,
          className: combineClassNames(
            sdn.avatar?.className,
            avatar?.className,
          ),
        },
  )
  const image2Props = applyRef(
    seldonRefs,
    image2 === null
      ? null
      : {
          ...sdn.image2,
          ...image2,
          className: combineClassNames(
            sdn.image2?.className,
            image2?.className,
          ),
        },
  )
  const frame3Props = applyRef(
    seldonRefs,
    frame3 === null
      ? null
      : {
          ...sdn.frame3,
          ...frame3,
          className: combineClassNames(
            sdn.frame3?.className,
            frame3?.className,
          ),
        },
  )
  const textLabelProps = applyRef(
    seldonRefs,
    textLabel === null
      ? null
      : {
          ...sdn.textLabel,
          ...textLabel,
          className: combineClassNames(
            sdn.textLabel?.className,
            textLabel?.className,
          ),
        },
  )
  const textLabel2Props = applyRef(
    seldonRefs,
    textLabel2 === null
      ? null
      : {
          ...sdn.textLabel2,
          ...textLabel2,
          className: combineClassNames(
            sdn.textLabel2?.className,
            textLabel2?.className,
          ),
        },
  )
  const buttonProps = applyRef(
    seldonRefs,
    button === null
      ? null
      : {
          ...sdn.button,
          ...button,
          className: combineClassNames(
            sdn.button?.className,
            button?.className,
          ),
        },
  )
  const iconProps = applyRef(
    seldonRefs,
    icon === null
      ? null
      : {
          ...sdn.icon,
          ...icon,
          className: combineClassNames(sdn.icon?.className, icon?.className),
        },
  )
  const textLabel3Props = applyRef(
    seldonRefs,
    textLabel3 === null
      ? null
      : {
          ...sdn.textLabel3,
          ...textLabel3,
          className: combineClassNames(
            sdn.textLabel3?.className,
            textLabel3?.className,
          ),
        },
  )

  return (
    <Frame
      className={mediaCardClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {imageProps !== null && <Image {...imageProps} />}
          <Frame {...frameProps}>
            {textTitle && textTitleProps && <TextTitle {...textTitleProps} />}
            <Frame {...frame2Props}>
              {avatar && avatarProps && (
                <Avatar {...avatarProps} image={image2Props} />
              )}
              <Frame {...frame3Props}>
                {textLabel && textLabelProps && (
                  <TextLabel {...textLabelProps} />
                )}
                {textLabel2 && textLabel2Props && (
                  <TextLabel {...textLabel2Props} />
                )}
              </Frame>
            </Frame>
            {button && buttonProps && (
              <Button {...buttonProps}>
                {icon && iconProps && <Icon {...iconProps} />}
                {textLabel3 && textLabel3Props && (
                  <TextLabel {...textLabel3Props} />
                )}
              </Button>
            )}
          </Frame>
        </>
      )}
    </Frame>
  )
}

//
// Default property values
//
const sdn: MediaCardProps = {
  "aria-hidden": "false",
  className: "sdn-media-card",
  image: {
    src: "https://static.seldon.app/background-default-dark.jpg",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--p3o3",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--m0wp",
  },
  textTitle: {
    className: "sdn-text-title sdn-text-title--adfu",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--9cdq",
  },
  avatar: {
    className: "sdn-avatar sdn-avatar--a890",
  },
  image2: {
    src: "/avatar-bentley.png",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--ohvb",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ew9f",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--p1kq",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--nlqr",
  },
  button: {
    className: "sdn-button sdn-button--heir",
  },
  icon: {
    icon: "material-playArrow",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
  },
  textLabel3: {
    className: "sdn-text-label sdn-text-label--ylte",
  },
}
