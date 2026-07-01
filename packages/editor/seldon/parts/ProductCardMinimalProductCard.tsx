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
import { TextSubtitle, TextSubtitleProps } from "../primitives/TextSubtitle"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface ProductCardMinimalProductCardProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  image?: ImageProps | null
  frame?: FrameProps | null
  textSubtitle?: TextSubtitleProps | null
  textTitle?: TextTitleProps | null
}

/*****
 * Product Card: ProductCardMinimalProductCard
 * Level: Part
 * Intent: Ecommerce product card emphasizing image, price, title, rating, and a single add-to-cart action.
 * Tags: card, product, ecommerce, price, rating, cta, UI, commerce
 * Type: Inline
 *
 * @example
 * ```tsx
 * <ProductCardMinimalProductCard
 *   aria-hidden="false"
 *   image="/image.jpg"
 *   frame="{}"
 *   textSubtitle="Product Title"
 *   textTitle2="Product Title"
 * />
 * ```
 *****/
export function ProductCardMinimalProductCard({
  className = "",
  image = sdn.image,
  frame = sdn.frame,
  textSubtitle,
  textTitle,
  children,
  seldonRefs,
  ...props
}: ProductCardMinimalProductCardProps) {
  const productCardMinimalProductCardClassName = combineClassNames(
    "sdn-product-card",
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
  const textSubtitleProps = applyRef(
    seldonRefs,
    textSubtitle === null
      ? null
      : {
          ...sdn.textSubtitle,
          ...textSubtitle,
          className: combineClassNames(
            sdn.textSubtitle?.className,
            textSubtitle?.className,
          ),
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

  return (
    <Frame
      className={productCardMinimalProductCardClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {imageProps !== null && <Image {...imageProps} />}
          <Frame {...frameProps}>
            {textSubtitle && textSubtitleProps && (
              <TextSubtitle {...textSubtitleProps} />
            )}
            {textTitle && textTitleProps && <TextTitle {...textTitleProps} />}
          </Frame>
        </>
      )}
    </Frame>
  )
}

//
// Default property values
//
const sdn: ProductCardMinimalProductCardProps = {
  "aria-hidden": "false",
  className: "sdn-product-card sdn-product-card",
  image: {
    src: "https://static.seldon.app/background-default-light.jpg",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--v8n4",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--cqnh",
  },
  textSubtitle: {
    className: "sdn-text-subtitle sdn-text-title--adfu",
  },
  textTitle: {
    className: "sdn-text-title sdn-text-title--bems",
  },
}
