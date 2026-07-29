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
import { ButtonSimple, ButtonSimpleProps } from "../elements/ButtonSimple"
import { Chip, ChipProps } from "../elements/Chip"
import { Frame, FrameProps } from "../frames/Frame"
import { Image, ImageProps } from "../primitives/Image"
import { TextDescription, TextDescriptionProps } from "../primitives/TextDescription"
import { TextHeading, TextHeadingProps } from "../primitives/TextHeading"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface ArticleCardProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  image?: ImageProps | null

  frame?: FrameProps | null
  chip?: ChipProps | null
  textLabel?: TextLabelProps | null
  textHeading?: TextHeadingProps | null
  textDescription?: TextDescriptionProps | null
  frame2?: FrameProps | null
  avatar?: AvatarProps | null
  image2?: ImageProps | null
  frame3?: FrameProps | null
  textLabel2?: TextLabelProps | null
  textLabel3?: TextLabelProps | null
  buttonSimple?: ButtonSimpleProps | null
  textLabel4?: TextLabelProps | null
}

//
// Default property values
//
const sdn: ArticleCardProps = {
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
    className: "sdn-text-heading sdn-text-heading--xkk9",
  },
  textDescription: {
    children:
      "A short, two-line excerpt written for the card earns the click without giving everything away.",
    className: "sdn-text-description sdn-text-description--w5ys",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--l25c",
  },
  avatar: {
    className: "sdn-avatar sdn-avatar--a890",
  },
  image2: {
    src: "/avatar-bentley.png",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--to5v",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--blp5",
  },
  textLabel2: {
    children: "Sir Bentley",
    className: "sdn-text-label sdn-text-label--f3ym",
  },
  textLabel3: {
    children: "Mar 30 · 5 min read",
    className: "sdn-text-label sdn-text-label--yqnd",
  },
  buttonSimple: {
    className: "sdn-button-simple sdn-button-iconic--8tzd",
  },
  textLabel4: {
    children: "Read more",
    className: "sdn-text-label sdn-text-label--gtwp",
  },
}

/**
 * Article Card: ArticleCard
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
 *     Frame            frame2
 *       Avatar         avatar
 *         Image        image2
 *       Frame          frame3
 *         TextLabel    textLabel2
 *         TextLabel    textLabel3
 *       ButtonSimple   buttonSimple
 *         TextLabel    textLabel4
 *
 * @example
 * ```tsx
 * <ArticleCard
 *   aria-hidden="false"
 *   image="/image.jpg"
 *   frame="{}"
 *   chip="{}"
 *   textLabel="{}"
 *   textHeading="{}"
 *   textDescription2="{}"
 *   avatar="/image.jpg"
 *   textLabel2="{}"
 *   buttonSimple={() => {}}
 * />
 * ```
 */
export function ArticleCard({
  className = "",
  image,

  frame,
  chip,
  textLabel,
  textHeading,
  textDescription,
  frame2,
  avatar,
  image2,
  frame3,
  textLabel2,
  textLabel3,
  buttonSimple,
  textLabel4,

  children,
  seldonRefs,
  ...props
}: ArticleCardProps) {
  const articleCardClassName = combineClassNames("sdn-article-card", className)

  const imageProps = mergeSlot(sdn.image, image, seldonRefs)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const chipProps = mergeOptionalSlot(sdn.chip, chip, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const textHeadingProps = mergeOptionalSlot(sdn.textHeading, textHeading, seldonRefs)
  const textDescriptionProps = mergeOptionalSlot(sdn.textDescription, textDescription, seldonRefs)
  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const avatarProps = mergeOptionalSlot(sdn.avatar, avatar, seldonRefs)
  const image2Props = mergeSlot(sdn.image2, image2, seldonRefs)
  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)
  const buttonSimpleProps = mergeOptionalSlot(sdn.buttonSimple, buttonSimple, seldonRefs)
  const textLabel4Props = mergeOptionalSlot(sdn.textLabel4, textLabel4, seldonRefs)

  return (
    <Frame className={articleCardClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
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
            <Frame {...frame2Props}>
              {avatarProps !== null && <Avatar {...avatarProps} image={image2Props} />}
              <Frame {...frame3Props}>
                {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
                {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
              </Frame>
              {buttonSimpleProps !== null && (
                <ButtonSimple {...buttonSimpleProps}>
                  {textLabel4Props !== null && <TextLabel {...textLabel4Props} />}
                </ButtonSimple>
              )}
            </Frame>
          </Frame>
        </>
      )}
    </Frame>
  )
}
