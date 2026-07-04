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
import { Button, ButtonProps } from "../elements/Button"
import { Frame, FrameProps } from "../frames/Frame"
import { Icon, IconProps } from "../primitives/Icon"
import { Image, ImageProps } from "../primitives/Image"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { TextSubtitle, TextSubtitleProps } from "../primitives/TextSubtitle"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface ProductCardHorizontalProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  image?: ImageProps | null
  frame?: FrameProps | null
  textSubtitle?: TextSubtitleProps | null
  textTitle?: TextTitleProps | null
  button?: ButtonProps | null
  icon?: IconProps | null
  textLabel?: TextLabelProps | null
}

/*****
 * Product Card: ProductCardHorizontal
 * Level: Part
 * Intent: Ecommerce product card emphasizing image, price, title, rating, and a single add-to-cart action.
 * Tags: card, product, ecommerce, price, rating, cta, UI, commerce
 * Type: Inline
 *
 * @example
 * ```tsx
 * <ProductCardHorizontal
 *   aria-hidden="false"
 *   image="/image.jpg"
 *   frame="{}"
 *   textSubtitle="Product Title"
 *   textTitle2="Product Title"
 *   button={() => {}}
 *   icon="material-star"
 *   textLabel="{}"
 * />
 * ```
 *****/
export function ProductCardHorizontal({
  className = "",
  image = sdn.image,
  frame = sdn.frame,
  textSubtitle,
  textTitle,
  button,
  icon = sdn.icon,
  textLabel,
  children,
  seldonRefs,
  ...props
}: ProductCardHorizontalProps) {
  const productCardHorizontalClassName = combineClassNames(
    "sdn-product-card-horizontal",
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
      className={productCardHorizontalClassName}
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
            {button && buttonProps && (
              <Button {...buttonProps}>
                {icon && iconProps && <Icon {...iconProps} />}
                {textLabel && textLabelProps && (
                  <TextLabel {...textLabelProps} />
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
const sdn: ProductCardHorizontalProps = {
  "aria-hidden": "false",
  className: "sdn-product-card-horizontal sdn-product-card",
  image: {
    src: "https://static.seldon.app/background-default-light.jpg",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--jk3c",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--3hfo",
  },
  textSubtitle: {
    className: "sdn-text-subtitle sdn-text-title--adfu",
  },
  textTitle: {
    className: "sdn-text-title sdn-text-title--8nvl",
  },
  button: {
    className: "sdn-button sdn-button-iconic--pgsr",
  },
  icon: {
    icon: "material-shoppingCart",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--ylte",
  },
}
