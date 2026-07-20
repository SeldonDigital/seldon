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

import { Frame } from "../frames/Frame"
import { Image, ImageProps } from "../primitives/Image"
import {
  TextDescription,
  TextDescriptionProps,
} from "../primitives/TextDescription"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface SectionSectionBrandProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  image?: ImageProps | null
  textTitle?: TextTitleProps | null
  textDescription?: TextDescriptionProps | null
}

/*****
 * Section: SectionBrand
 * Level: Element
 * Intent: Navigation section containing links to important pages. Can be used in footers, headers, sidebars, or any other layout context. Follows Material Design navigation patterns.
 * Tags: section, navigation, links, menu, element, layout, header, footer, sidebar
 * Type: Custom
 *
 * @example
 * ```tsx
 * <SectionSectionBrand
 *   aria-hidden="false"
 *   image="/image.jpg"
 *   textTitle="Product Title"
 *   textDescription2="{}"
 * />
 * ```
 *****/
export function SectionSectionBrand({
  className = "",
  image = sdn.image,
  textTitle,
  textDescription,
  children,
  seldonRefs,
  ...props
}: SectionSectionBrandProps) {
  const sectionSectionBrandClassName = combineClassNames(
    "sdn-section",
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

  return (
    <Frame
      className={sectionSectionBrandClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {imageProps !== null && <Image {...imageProps} />}
          {textTitle && textTitleProps && <TextTitle {...textTitleProps} />}
          {textDescription && textDescriptionProps && (
            <TextDescription {...textDescriptionProps} />
          )}
        </>
      )}
    </Frame>
  )
}

//
// Default property values
//
const sdn: SectionSectionBrandProps = {
  "aria-hidden": "false",
  className: "sdn-section",
  image: {
    src: "https://static.seldon.app/logo.svg",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--wxaq",
  },
  textTitle: {
    className: "sdn-text-title sdn-text-title--unrf",
  },
  textDescription: {
    className: "sdn-text-description sdn-text-title--unrf",
  },
}
