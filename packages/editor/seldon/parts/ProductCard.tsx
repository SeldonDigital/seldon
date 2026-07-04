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
import { Chip, ChipProps } from "../elements/Chip"
import { Frame, FrameProps } from "../frames/Frame"
import { Icon, IconProps } from "../primitives/Icon"
import { Image, ImageProps } from "../primitives/Image"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { TextSubtitle, TextSubtitleProps } from "../primitives/TextSubtitle"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface ProductCardProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  image?: ImageProps | null
  frame?: FrameProps | null
  chip?: ChipProps | null
  textLabel?: TextLabelProps | null
  textSubtitle?: TextSubtitleProps | null
  textTitle?: TextTitleProps | null
  frame2?: FrameProps | null
  icon?: IconProps | null
  icon2?: IconProps | null
  icon3?: IconProps | null
  icon4?: IconProps | null
  icon5?: IconProps | null
  button?: ButtonProps | null
  icon6?: IconProps | null
  textLabel2?: TextLabelProps | null
}

/*****
 * Product Card: ProductCard
 * Level: Part
 * Intent: Ecommerce product card emphasizing image, price, title, rating, and a single add-to-cart action.
 * Tags: card, product, ecommerce, price, rating, cta, UI, commerce
 * Type: Inline
 *
 * @example
 * ```tsx
 * <ProductCard
 *   aria-hidden="false"
 *   image="/image.jpg"
 *   frame="{}"
 *   chip="{}"
 *   textLabel="{}"
 *   textSubtitle="Product Title"
 *   textTitle2="Product Title"
 *   icon="material-star"
 *   icon2="material-star"
 *   icon3="material-star"
 *   icon4="material-star"
 *   icon5="material-star"
 *   button={() => {}}
 * />
 * ```
 *****/
export function ProductCard({
  className = "",
  image = sdn.image,
  frame = sdn.frame,
  chip,
  textLabel,
  textSubtitle,
  textTitle,
  frame2 = sdn.frame2,
  icon,
  icon2,
  icon3,
  icon4,
  icon5,
  button,
  icon6 = sdn.icon6,
  textLabel2,
  children,
  seldonRefs,
  ...props
}: ProductCardProps) {
  const productCardClassName = combineClassNames("sdn-product-card", className)
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
  const icon2Props = applyRef(
    seldonRefs,
    icon2 === null
      ? null
      : {
          ...sdn.icon2,
          ...icon2,
          className: combineClassNames(sdn.icon2?.className, icon2?.className),
        },
  )
  const icon3Props = applyRef(
    seldonRefs,
    icon3 === null
      ? null
      : {
          ...sdn.icon3,
          ...icon3,
          className: combineClassNames(sdn.icon3?.className, icon3?.className),
        },
  )
  const icon4Props = applyRef(
    seldonRefs,
    icon4 === null
      ? null
      : {
          ...sdn.icon4,
          ...icon4,
          className: combineClassNames(sdn.icon4?.className, icon4?.className),
        },
  )
  const icon5Props = applyRef(
    seldonRefs,
    icon5 === null
      ? null
      : {
          ...sdn.icon5,
          ...icon5,
          className: combineClassNames(sdn.icon5?.className, icon5?.className),
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
  const icon6Props = applyRef(
    seldonRefs,
    icon6 === null
      ? null
      : {
          ...sdn.icon6,
          ...icon6,
          className: combineClassNames(sdn.icon6?.className, icon6?.className),
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

  return (
    <Frame
      className={productCardClassName}
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
            {textSubtitle && textSubtitleProps && (
              <TextSubtitle {...textSubtitleProps} />
            )}
            {textTitle && textTitleProps && <TextTitle {...textTitleProps} />}
            <Frame {...frame2Props}>
              {icon && iconProps && <Icon {...iconProps} />}
              {icon2 && icon2Props && <Icon {...icon2Props} />}
              {icon3 && icon3Props && <Icon {...icon3Props} />}
              {icon4 && icon4Props && <Icon {...icon4Props} />}
              {icon5 && icon5Props && <Icon {...icon5Props} />}
            </Frame>
            {button && buttonProps && (
              <Button {...buttonProps}>
                {icon6 && icon6Props && <Icon {...icon6Props} />}
                {textLabel2 && textLabel2Props && (
                  <TextLabel {...textLabel2Props} />
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
const sdn: ProductCardProps = {
  "aria-hidden": "false",
  className: "sdn-product-card",
  image: {
    src: "https://static.seldon.app/background-default-light.jpg",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--v8n4",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ovgw",
  },
  chip: {
    className: "sdn-chip sdn-chip--xv4c",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--7oyz",
  },
  textSubtitle: {
    className: "sdn-text-subtitle sdn-text-subtitle--chae",
  },
  textTitle: {
    className: "sdn-text-title sdn-text-title--bems",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--yn2e",
  },
  icon: {
    className: "sdn-icon sdn-icon--gsdg",
  },
  icon2: {
    className: "sdn-icon sdn-icon--gsdg",
  },
  icon3: {
    className: "sdn-icon sdn-icon--gsdg",
  },
  icon4: {
    className: "sdn-icon sdn-icon--gsdg",
  },
  icon5: {
    className: "sdn-icon sdn-icon--b9hs",
  },
  button: {
    className: "sdn-button sdn-button--heir",
  },
  icon6: {
    icon: "material-shoppingCart",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--ylte",
  },
}
