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
import { Frame, FrameProps } from "../frames/Frame"
import { Image, ImageProps } from "../primitives/Image"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface MediaCardCompactProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  image?: ImageProps | null
  frame?: FrameProps | null
  textTitle?: TextTitleProps | null
  textLabel?: TextLabelProps | null
}

/*****
 * Media Card: MediaCardCompact
 * Level: Part
 * Intent: Visual-first media card where the thumbnail dominates, supported by a title, creator, metrics, and a play action.
 * Tags: card, media, video, thumbnail, creator, play, streaming, UI
 * Type: Inline
 *
 * @example
 * ```tsx
 * <MediaCardCompact
 *   aria-hidden="false"
 *   image="/image.jpg"
 *   frame="{}"
 *   textTitle="Product Title"
 *   textLabel2="{}"
 * />
 * ```
 *****/
export function MediaCardCompact({
  className = "",
  image = sdn.image,
  frame = sdn.frame,
  textTitle,
  textLabel,
  children,
  seldonRefs,
  ...props
}: MediaCardCompactProps) {
  const mediaCardCompactClassName = combineClassNames(
    "sdn-media-card",
    className,
  )
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

  return (
    <Frame
      className={mediaCardCompactClassName}
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
            {textLabel && textLabelProps && <TextLabel {...textLabelProps} />}
          </Frame>
        </>
      )}
    </Frame>
  )
}

//
// Default property values
//
const sdn: MediaCardCompactProps = {
  "aria-hidden": "false",
  className: "sdn-media-card sdn-media-card",
  image: {
    src: "https://static.seldon.app/background-default-dark.jpg",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--vavb",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--cqnh",
  },
  textTitle: {
    className: "sdn-text-title sdn-text-title--adfu",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-title--adfu",
  },
}
