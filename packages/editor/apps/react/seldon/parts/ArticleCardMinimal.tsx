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

import { Chip, ChipProps } from "../elements/Chip"
import { Frame, FrameProps } from "../frames/Frame"
import { Image, ImageProps } from "../primitives/Image"
import { TextHeading, TextHeadingProps } from "../primitives/TextHeading"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface ArticleCardMinimalProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  image?: ImageProps | null

  frame?: FrameProps | null
  chip?: ChipProps | null
  textLabel?: TextLabelProps | null
  textHeading?: TextHeadingProps | null
}

//
// Default property values
//
const sdn: ArticleCardMinimalProps = {
  "aria-hidden": "false",
  image: {
    src: "https://static.seldon.app/background-default-light.jpg",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--j9of",
  },

  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--mclm",
  },
  chip: {
    className: "sdn-chip sdn-chip--o0xb",
  },
  textLabel: {
    children: "Design",
    className: "sdn-text-label sdn-text-label--lug5",
  },
  textHeading: {
    children: "How to design better cards",
    className: "sdn-text-heading sdn-text-label--yqnd",
  },
}

/**
 * Article Card: ArticleCardMinimal
 * Level: Part
 * Intent: Content preview card with a featured image, headline, short excerpt, and author metadata to drive click-throughs.
 * Tags: card, article, blog, preview, excerpt, author, content, UI
 * Type: Inline
 *
 * Structure:
 *   Image          image
 *   Frame          frame
 *     Chip         chip
 *       TextLabel  textLabel
 *     TextHeading  textHeading
 *
 * @example
 * ```tsx
 * <ArticleCardMinimal
 *   aria-hidden="false"
 *   image="/image.jpg"
 *   frame="{}"
 *   chip="{}"
 *   textLabel="{}"
 *   textHeading="{}"
 * />
 * ```
 */
export function ArticleCardMinimal({
  className = "",
  image,

  frame,
  chip,
  textLabel,
  textHeading,

  children,
  seldonRefs,
  ...props
}: ArticleCardMinimalProps) {
  const articleCardMinimalClassName = combineClassNames("sdn-article-card", className)

  const imageProps = mergeSlot(sdn.image, image, seldonRefs)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const chipProps = mergeOptionalSlot(sdn.chip, chip, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const textHeadingProps = mergeOptionalSlot(sdn.textHeading, textHeading, seldonRefs)

  return (
    <Frame className={articleCardMinimalClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {imageProps !== null && <Image {...imageProps} />}
          <Frame {...frameProps}>
            {chipProps !== null && (
              <Chip {...chipProps}>
                {textLabelProps !== null && <TextLabel {...textLabelProps} />}
              </Chip>
            )}
            {textHeadingProps !== null && <TextHeading {...textHeadingProps} />}
          </Frame>
        </>
      )}
    </Frame>
  )
}
