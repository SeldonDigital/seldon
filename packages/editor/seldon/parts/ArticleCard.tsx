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
import {
  TextDescription,
  TextDescriptionProps,
} from "../primitives/TextDescription"
import { TextHeading, TextHeadingProps } from "../primitives/TextHeading"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface ArticleCardProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
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

/*****
 * Article Card: ArticleCard
 * Level: Part
 * Intent: Content preview card with a featured image, headline, short excerpt, and author metadata to drive click-throughs.
 * Tags: card, article, blog, preview, excerpt, author, content, UI
 * Type: Inline
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
 *****/
export function ArticleCard({
  className = "",
  image = sdn.image,
  frame = sdn.frame,
  chip,
  textLabel,
  textHeading,
  textDescription,
  frame2 = sdn.frame2,
  avatar,
  image2 = sdn.image2,
  frame3 = sdn.frame3,
  textLabel2,
  textLabel3,
  buttonSimple,
  textLabel4,
  children,
  seldonRefs,
  ...props
}: ArticleCardProps) {
  const articleCardClassName = combineClassNames("sdn-article-card", className)
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
  const textDescriptionProps = applyRef(
    seldonRefs,
    textDescription === null
      ? null
      : {
          ...sdn.textDescription,
          ...textDescription,
          className: combineClassNames(
            sdn.textDescription?.className,
            textDescription?.className,
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
  const buttonSimpleProps = applyRef(
    seldonRefs,
    buttonSimple === null
      ? null
      : {
          ...sdn.buttonSimple,
          ...buttonSimple,
          className: combineClassNames(
            sdn.buttonSimple?.className,
            buttonSimple?.className,
          ),
        },
  )
  const textLabel4Props = applyRef(
    seldonRefs,
    textLabel4 === null
      ? null
      : {
          ...sdn.textLabel4,
          ...textLabel4,
          className: combineClassNames(
            sdn.textLabel4?.className,
            textLabel4?.className,
          ),
        },
  )

  return (
    <Frame
      className={articleCardClassName}
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
            {textDescription && textDescriptionProps && (
              <TextDescription {...textDescriptionProps} />
            )}
            <Frame {...frame2Props}>
              {avatar && avatarProps && (
                <Avatar {...avatarProps} image={image2Props} />
              )}
              <Frame {...frame3Props}>
                {textLabel2 && textLabel2Props && (
                  <TextLabel {...textLabel2Props} />
                )}
                {textLabel3 && textLabel3Props && (
                  <TextLabel {...textLabel3Props} />
                )}
              </Frame>
              {buttonSimple && buttonSimpleProps && (
                <ButtonSimple {...buttonSimpleProps}>
                  {textLabel4 && textLabel4Props && (
                    <TextLabel {...textLabel4Props} />
                  )}
                </ButtonSimple>
              )}
            </Frame>
          </Frame>
        </>
      )}
    </Frame>
  )
}

//
// Default property values
//
const sdn: ArticleCardProps = {
  "aria-hidden": "false",
  className: "sdn-article-card",
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
  textDescription: {
    className: "sdn-text sdn-text-description--w5ys",
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
    className: "sdn-image sdn-image--to5v",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ew9f",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--p1kq",
  },
  textLabel3: {
    className: "sdn-text-label sdn-text-title--adfu",
  },
  buttonSimple: {
    className: "sdn-button-simple sdn-button-iconic--8tzd",
  },
  textLabel4: {
    className: "sdn-text-label sdn-text-label--gtwp",
  },
}
