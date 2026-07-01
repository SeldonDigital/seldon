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
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface ArticleCardMinimalArticleCardProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  image?: ImageProps | null
  frame?: FrameProps | null
  chip?: ChipProps | null
  textLabel?: TextLabelProps | null
  textHeading?: TextHeadingProps | null
}

/*****
 * Article Card: ArticleCardMinimalArticleCard
 * Level: Part
 * Intent: Content preview card with a featured image, headline, short excerpt, and author metadata to drive click-throughs.
 * Tags: card, article, blog, preview, excerpt, author, content, UI
 * Type: Inline
 *
 * @example
 * ```tsx
 * <ArticleCardMinimalArticleCard
 *   aria-hidden="false"
 *   image="/image.jpg"
 *   frame="{}"
 *   chip="{}"
 *   textLabel="{}"
 *   textHeading="{}"
 * />
 * ```
 *****/
export function ArticleCardMinimalArticleCard({
  className = "",
  image = sdn.image,
  frame = sdn.frame,
  chip,
  textLabel,
  textHeading,
  children,
  seldonRefs,
  ...props
}: ArticleCardMinimalArticleCardProps) {
  const articleCardMinimalArticleCardClassName = combineClassNames(
    "sdn-article-card",
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
  const chipProps = applyRef(
    seldonRefs,
    chip === null
      ? null
      : {
          ...sdn.chip,
          ...chip,
          className: combineClassNames(sdn.chip?.className, chip?.className),
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
  const textHeadingProps = applyRef(
    seldonRefs,
    textHeading === null
      ? null
      : {
          ...sdn.textHeading,
          ...textHeading,
          className: combineClassNames(
            sdn.textHeading?.className,
            textHeading?.className,
          ),
        },
  )

  return (
    <Frame
      className={articleCardMinimalArticleCardClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {imageProps !== null && <Image {...imageProps} />}
          <Frame {...frameProps}>
            {chip && chipProps && (
              <Chip {...chipProps}>
                {textLabel && textLabelProps && (
                  <TextLabel {...textLabelProps} />
                )}
              </Chip>
            )}
            {textHeading && textHeadingProps && (
              <TextHeading {...textHeadingProps} />
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
const sdn: ArticleCardMinimalArticleCardProps = {
  "aria-hidden": "false",
  className: "sdn-article-card sdn-article-card",
  image: {
    src: "https://static.seldon.app/background-default-light.jpg",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--p3o3",
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
    className: "sdn-text-label sdn-text-label--lug5",
  },
  textHeading: {
    className: "sdn-text-heading sdn-text-heading--xkk9",
  },
}
