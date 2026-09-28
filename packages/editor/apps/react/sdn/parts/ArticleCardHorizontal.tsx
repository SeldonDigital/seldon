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
import { Chip } from "../elements/Chip"
import { Frame } from "../frames/Frame"
import { Image } from "../primitives/Image"
import { TextDescription } from "../primitives/TextDescription"
import { TextHeading } from "../primitives/TextHeading"
import { TextLabel } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

import type { ChipProps } from "../elements/Chip"
import type { FrameProps } from "../frames/Frame"
import type { ImageProps } from "../primitives/Image"
import type { TextDescriptionProps } from "../primitives/TextDescription"
import type { TextHeadingProps } from "../primitives/TextHeading"
import type { TextLabelProps } from "../primitives/TextLabel"
import type { SeldonRefs } from "../utils/merge-slot"
import type { HTMLAttributes } from "react"

export interface ArticleCardHorizontalProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  image?: ImageProps | null

  frame?: FrameProps | null
  chip?: ChipProps | null
  textLabel?: TextLabelProps | null
  textHeading?: TextHeadingProps | null
  textDescription?: TextDescriptionProps | null
}

//
// Default property values
//
const sdn: ArticleCardHorizontalProps = {
  "aria-hidden": "false",
  image: {
    src: "/sdn/assets/background-default-light.jpg",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--afq6",
  },

  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--zett",
  },
  chip: {
    className: "sdn-chip sdn-chip--jsvs",
  },
  textLabel: {
    children: "Design",
    className: "sdn-text-label sdn-text-label--lug5",
  },
  textHeading: {
    children: "How to design better cards",
    className: "sdn-text-heading sdn-text-heading--q8wa",
  },
  textDescription: {
    children:
      "A short, two-line excerpt written for the card earns the click without giving everything away.",
    className: "sdn-text-description sdn-text-description--lwq7",
  },
}

/**
 * Article Card: ArticleCardHorizontal
 * Level: Part
 * Intent: Content preview card with a featured image, headline, short excerpt, and author metadata to drive click-throughs.
 * Tags: card, article, blog, preview, excerpt, author, content, UI
 * Type: Inline
 *
 * Structure:
 *   Image              image
 *   Frame              frame
 *     Chip             chip
 *       TextLabel      textLabel
 *     TextHeading      textHeading
 *     TextDescription  textDescription
 *
 * @example
 * ```tsx
 * <ArticleCardHorizontal
 *   aria-hidden="false"
 *   image="/image.jpg"
 *   frame="{}"
 *   chip="{}"
 *   textLabel="{}"
 *   textHeading="{}"
 *   textDescription2="{}"
 * />
 * ```
 */
export function ArticleCardHorizontal({
  className = "",
  image,

  frame,
  chip,
  textLabel,
  textHeading,
  textDescription,

  children,
  seldonRefs,
  ...props
}: ArticleCardHorizontalProps) {
  const articleCardHorizontalClassName = combineClassNames("sdn-article-card-horizontal", className)

  const imageProps = mergeSlot(sdn.image, image, seldonRefs)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const chipProps = mergeOptionalSlot(sdn.chip, chip, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const textHeadingProps = mergeOptionalSlot(sdn.textHeading, textHeading, seldonRefs)
  const textDescriptionProps = mergeOptionalSlot(sdn.textDescription, textDescription, seldonRefs)

  return (
    <Frame className={articleCardHorizontalClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
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
            {textDescriptionProps !== null && <TextDescription {...textDescriptionProps} />}
          </Frame>
        </>
      )}
    </Frame>
  )
}
